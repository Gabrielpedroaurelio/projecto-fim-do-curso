import uuid
from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from apis.models import SolicitacaoDocumento, Fatura, Funcionario
from apis.services.pdf_service import PDFService

class DocumentService:
    """
    Serviço para gestão de documentos e solicitações (Fluxo RUP v2)
    """
    
    @staticmethod
    def criar_solicitacao(aluno_id, tipo_documento, canal_pagamento, encarregado_id=None, classe_id=None):
        """
        Cria uma nova solicitação e gera uma fatura automática (RUP)
        """
        from apis.models import Aluno, Classe
        
        # 1. Validar categoria
        categorias_permitidas = ['DECLARAÇÃO', 'CERTIFICADO', 'BOLETIM']
        tipo_base = tipo_documento.upper()
        
        # Verificar se é um boletim específico (1, 2, 3)
        is_boletim = 'BOLETIM' in tipo_base
        
        # Correção: Verificar se ALGUMA categoria permitida está contida no tipo base
        if not any(cat in tipo_base for cat in categorias_permitidas):
            raise ValueError(f"Tipo de documento '{tipo_base}' não permitido. Use: {', '.join(categorias_permitidas)}")

        # 2. Obter dados do aluno e classe atual (ou histórica)
        try:
            from apis.models import Aluno, Classe, Matricula
            aluno = Aluno.objects.select_related('id_turma__id_classe').get(id_aluno=aluno_id)
        except Aluno.DoesNotExist:
            raise ValueError("Aluno não encontrado.")

        nivel_atual = None
        if aluno.id_turma and aluno.id_turma.id_classe:
            nivel_atual = aluno.id_turma.id_classe.nivel
        else:
            # Buscar na última matrícula se não tem turma ativa
            ultima_mat = Matricula.objects.filter(id_aluno=aluno).select_related('id_turma__id_classe').order_by('-data_matricula').first()
            if ultima_mat and ultima_mat.id_turma:
                nivel_atual = ultima_mat.id_turma.id_classe.nivel

        classe_solicitada_obj = None
        if classe_id:
            try:
                classe_solicitada_obj = Classe.objects.get(id_classe=classe_id)
            except Classe.DoesNotExist:
                raise ValueError("Classe solicitada inválida.")

        # 3. Validação de Regras de Negócio (Nível)
        if nivel_atual is not None and classe_solicitada_obj:
            nivel_solicitado = classe_solicitada_obj.nivel

            if 'DECLARAÇÃO' in tipo_base:
                # Regra: Máximo permitida = Classe Atual (se frequência) ou Classe Atual - 1 (se conclusão)
                # Para simplificar, permitimos até a classe atual se for Declaração de Frequência
                if nivel_solicitado > nivel_atual:
                    raise ValueError(f"Não é possível solicitar declaração para uma classe futura ({nivel_solicitado}ª) baseada no seu histórico ({nivel_atual}ª).")
            
            if 'BOLETIM' in tipo_base:
                # Boletim: Permitida Classe Atual ou inferior
                if nivel_solicitado > nivel_atual:
                    raise ValueError(f"Boletim não disponível para classe futura baseada na matricula ({nivel_atual}ª).")

            if 'CERTIFICADO' in tipo_base:
                # Apenas se aprovado na última classe do ciclo (12ª ou 13ª)
                # Aqui precisaria verificar histórico de aprovação.
                # Por simplicidade verificamos se o solicitado é 12 ou 13.
                if nivel_solicitado not in [12, 13]:
                    raise ValueError("Certificado apenas para 12ª ou 13ª classe.")
        
        # 4. Gerar RUP
        timestamp = int(timezone.now().timestamp())
        rup_code = f"{timestamp}-{aluno_id}"
        
        expiracao = timezone.now() + timedelta(hours=24)
        valor_doc = 2500.00 # Valor base exemplo, poderia vir de uma tabela de Preços
        
        solicitacao = SolicitacaoDocumento.objects.create(
            id_aluno_id=aluno_id,
            id_encarregado_id=encarregado_id,
            tipo_documento=tipo_documento,
            canal_pagamento_rup=canal_pagamento,
            data_expiracao_rup=expiracao,
            status_solicitacao='pendente',
            rupe=rup_code,
            valor_rupe=valor_doc,
            classe_solicitada=classe_solicitada_obj
        )
        
        # Gerar fatura (RUP) automática
        fatura = Fatura.objects.create(
            id_aluno_id=aluno_id,
            descricao=f"RUP {rup_code} - Emissão de {tipo_documento}",
            total=valor_doc,
            data_vencimento=expiracao.date(),
            status='pendente'
        )
        
        return solicitacao, fatura

    @staticmethod
    def validar_pagamento_rupe(fatura_id, funcionario_id=None):
        """
        Valida o pagamento do RUP e inicia a geração do PDF
        """
        fatura = Fatura.objects.get(id_fatura=fatura_id)
        fatura.status = 'paga'
        fatura.data_pagamento = timezone.now().date()
        fatura.save()
        
        # Buscar solicitação vinculada
        solicitacao = SolicitacaoDocumento.objects.filter(
            id_aluno=fatura.id_aluno,
            status_solicitacao='pendente'
        ).order_by('-data_solicitacao').first()
        
        if solicitacao:
            solicitacao.status_solicitacao = 'pago'
            solicitacao.save()
            
            # Gerar o PDF agora que foi pago (Aguardando Assinatura)
            DocumentService.gerar_pdf_documento(solicitacao.id_solicitacao, funcionario_id)
            
        return fatura

    @staticmethod
    def gerar_pdf_documento(solicitacao_id, funcionario_id=None):
        """
        Gera o arquivo PDF oficial após o pagamento
        """
        from apis.models import Documento
        
        solicitacao = SolicitacaoDocumento.objects.select_related(
            'id_aluno', 'id_aluno__id_turma', 'id_aluno__id_turma__id_curso'
        ).get(id_solicitacao=solicitacao_id)
        
        doc_uuid = uuid.uuid4()
        solicitacao.uuid_documento = doc_uuid
        solicitacao.save() # Persistir no banco ANTES de passar para o contexto e salvar o PDF
        
        # Contexto para o template
        context = {
            'aluno': solicitacao.id_aluno,
            'solicitacao': solicitacao,
            'hoje': timezone.now(),
            'site_url': settings.SITE_URL if hasattr(settings, 'SITE_URL') else 'http://localhost:8000'
        }
        
        # Selecionar template e carregar notas se necessário
        template_name = 'pdf/declaracao_matricula.html'
        tipo_base = solicitacao.tipo_documento.upper()

        if 'CERTIFICADO' in tipo_base or 'BOLETIM' in tipo_base or 'APROVEITAMENTO' in tipo_base:
            # Carregar as notas para todos os documentos que precisam de dados acadêmicos
            context['notas_finais'] = DocumentService._get_notas_finais_aluno(
                solicitacao.id_aluno, 
                solicitacao.classe_solicitada
            )
            
            # Extrair curso e classe de forma robusta para os labels do template
            # Tenta pegar da nota, senão da turma do aluno, senão da classe solicitada
            curso_obj = None
            classe_obj = solicitacao.classe_solicitada
            
            if context['notas_finais']:
                # No AcademicService.get_boletim_aluno, a lógica de curso/classe já foi processada
                # Mas para garantir que os labels apareçam, vamos reforçar aqui
                if solicitacao.id_aluno.id_turma:
                    curso_obj = solicitacao.id_aluno.id_turma.id_curso
                    classe_obj = classe_obj or solicitacao.id_aluno.id_turma.id_classe

            context['curso'] = curso_obj
            context['classe'] = classe_obj

            if 'CERTIFICADO' in tipo_base:
                template_name = 'pdf/certificado.html'
            elif 'APROVEITAMENTO' in tipo_base:
                template_name = 'pdf/declaracao_aproveitamento.html'
            elif 'BOLETIM' in tipo_base:
                template_name = 'pdf/boletim.html'
                # Extrair o número do trimestre do tipo_documento (ex: "BOLETIM_1" -> 1)
                try:
                    trimester = tipo_base.split('_')[-1]
                    if trimester in ['1', '2', '3']:
                        context['trimestre_selecionado'] = trimester
                    else:
                        context['trimestre_selecionado'] = '1' # Default para o 1º se não especificado
                except:
                    context['trimestre_selecionado'] = '1'
            
        pdf_content = PDFService.render_to_pdf(template_name, context)
        
        if pdf_content:
            # A própria função _get_document_path agora cuida da categorização baseada no tipo
            structured_sub_dir = DocumentService._get_document_path(solicitacao.id_aluno, solicitacao.tipo_documento)
            
            filename = f"doc_{doc_uuid}.pdf"
            relative_path = PDFService.save_pdf(pdf_content, filename, sub_dir=structured_sub_dir)
            
            solicitacao.caminho_arquivo = relative_path
            solicitacao.status_solicitacao = 'aguardando_assinatura'
            solicitacao.save()
            
            return relative_path
        return None

    @staticmethod

    def _get_notas_finais_aluno(aluno, classe):
        """
        Calcula as notas detalhadas (MAC, PP, PT) e médias por trimestre.
        Proxy para AcademicService para evitar duplicação.
        """
        from apis.services.academic_service import AcademicService
        return AcademicService.get_boletim_aluno(aluno, classe)

    @staticmethod
    def _get_document_path(aluno, tipo_base):
        """
        Gera o caminho estruturado: estudantes/[ID_ALUNO]/documentos/[CATEGORIA]/
        """
        # 1. Identificar categoria simplificada
        categoria = 'OUTROS'
        tipo_upper = tipo_base.upper()
        if 'DECLARAÇÃO' in tipo_upper: categoria = 'DECLARACOES'
        elif 'CERTIFICADO' in tipo_upper: categoria = 'CERTIFICADOS'
        elif 'BOLETIM' in tipo_upper or 'APROVEITAMENTO' in tipo_upper: categoria = 'BOLETIM_NOTAS'
        elif 'RUP' in tipo_upper: categoria = 'FINANCEIRO'

        # 2. Pasta do aluno baseada no ID para estabilidade (evita quebra se mudar nome)
        # Mas mantemos um sufixo do nome para facilidade de navegação manual
        nome_breve = aluno.nome_completo.split(' ')[0]
        aluno_folder = f"{aluno.id_aluno}_{nome_breve}"
        
        # 3. Construir path relativo
        path = f"estudantes/{aluno_folder}/documentos/{categoria}"
        return path

    @staticmethod
    def assinar_e_aprovar(solicitacao_id, funcionario_id):
        """
        Diretor assina digitalmente e aprova para levantamento
        """
        from apis.models import Documento, Funcionario
        
        solicitacao = SolicitacaoDocumento.objects.get(id_solicitacao=solicitacao_id)
        funcionario = Funcionario.objects.get(id_funcionario=funcionario_id)
        
        solicitacao.status_solicitacao = 'disponivel'
        solicitacao.id_funcionario = funcionario
        solicitacao.data_aprovacao = timezone.now()
        solicitacao.save()
        
        # Criar registro oficial de documento emitido
        Documento.objects.create(
            id_aluno=solicitacao.id_aluno,
            tipo_documento=solicitacao.tipo_documento,
            caminho_pdf=solicitacao.caminho_arquivo,
            uuid_documento=solicitacao.uuid_documento,
            criado_por=funcionario
        )
        
        return solicitacao
    @staticmethod
    def gerar_comprovativo_rup(solicitacao_id):
        """
        Gera um PDF simples com os dados do RUP para impressão
        """
        solicitacao = SolicitacaoDocumento.objects.get(id_solicitacao=solicitacao_id)
        fatura = Fatura.objects.filter(id_aluno=solicitacao.id_aluno, status='pendente').last()
        
        context = {
            'solicitacao': solicitacao,
            'fatura': fatura,
            'aluno': solicitacao.id_aluno,
            'escola': settings.SCHOOL_INFO if hasattr(settings, 'SCHOOL_INFO') else {'nome': 'Gestão Escolar'},
            'hoje': timezone.now()
        }
        
        # Renderizar PDF do RUP (usando um template simples)
        pdf_content = PDFService.render_to_pdf('pdf/rup_comprovativo.html', context)
        
        if pdf_content:
            # "RUP" vai cair na categoria FINANCEIRO no novo _get_document_path
            structured_sub_dir = DocumentService._get_document_path(solicitacao.id_aluno, "RUP")
            filename = f"rup_{solicitacao.uuid_documento}.pdf"
            relative_path = PDFService.save_pdf(pdf_content, filename, sub_dir=structured_sub_dir)
            return relative_path
        return None

    @staticmethod
    def confirmar_pagamento_funcionario(solicitacao_id, funcionario_id):
        """
        Funcionário confirma o pagamento, gera o documento final (com assinatura digital)
        e marca como impresso para assinatura manual.
        """
        if not funcionario_id:
            raise ValueError("ID do funcionário responsável é obrigatório para confirmar o pagamento.")
            
        try:
            solicitacao = SolicitacaoDocumento.objects.get(id_solicitacao=solicitacao_id)
        except SolicitacaoDocumento.DoesNotExist:
            raise ValueError(f"Solicitação ID {solicitacao_id} não encontrada.")
        
        try:
            # 1. Atualizar Fatura
            fatura = Fatura.objects.filter(id_aluno=solicitacao.id_aluno, status='pendente').last()
            if fatura:
                fatura.status = 'paga'
                fatura.data_pagamento = timezone.now().date()
                fatura.save()
                
            # 2. Atualizar Solicitação
            solicitacao.status_solicitacao = 'pago'
            solicitacao.save()
            
            # 3. Gerar Documento Final (PDF com Assinatura Digital)
            # O método gerar_pdf_documento já deve incluir a lógica da assinatura digital no template
            caminho_pdf = DocumentService.gerar_pdf_documento(solicitacao_id, funcionario_id)
            
            # 3.1 Recarregar a solicitação para garantir que temos o uuid_documento e o caminho_arquivo atualizados
            solicitacao.refresh_from_db()
            
            if caminho_pdf:
                # 4. Marcar como Disponível imediatamente (Fluxo Instantâneo)
                solicitacao.status_solicitacao = 'disponivel'
                solicitacao.data_aprovacao = timezone.now()
                solicitacao.id_funcionario_id = funcionario_id # Quem confirmou/aprovou
                solicitacao.save()
                
                # 5. Criar registro oficial de Documento para aparecer nas listagens
                from apis.models import Documento, Funcionario
                funcionario = Funcionario.objects.get(id_funcionario=funcionario_id)
                
                Documento.objects.create(
                    id_aluno=solicitacao.id_aluno,
                    tipo_documento=solicitacao.tipo_documento,
                    caminho_pdf=solicitacao.caminho_arquivo,
                    uuid_documento=solicitacao.uuid_documento,
                    criado_por=funcionario,
                    data_emissao=timezone.now()
                )

                return caminho_pdf
            else:
                raise Exception("Erro ao gerar o conteúdo do PDF.")
                
        except Exception as e:
            # Capturar erro original para depuração
            import traceback
            print(f"ERRO CRÍTICO NA GERAÇÃO DE DOCUMENTO: {str(e)}")
            print(traceback.format_exc())
            raise Exception(f"Erro ao processar documento: {str(e)}")
