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
    def criar_solicitacao(aluno_id, tipo_documento, canal_pagamento, encarregado_id=None):
        """
        Cria uma nova solicitação e gera uma fatura automática (RUP)
        """
        # Validar categoria
        categorias_permitidas = ['DECLARAÇÃO', 'CERTIFICADO', 'BOLETIM']
        tipo_base = tipo_documento.split('(')[0].strip().upper()
        
        if tipo_base not in categorias_permitidas:
            raise ValueError(f"Tipo de documento '{tipo_base}' não permitido. Use: {', '.join(categorias_permitidas)}")

        expiracao = timezone.now() + timedelta(hours=24)
        
        solicitacao = SolicitacaoDocumento.objects.create(
            id_aluno_id=aluno_id,
            id_encarregado_id=encarregado_id,
            tipo_documento=tipo_documento,
            canal_pagamento_rup=canal_pagamento,
            data_expiracao_rup=expiracao,
            status_solicitacao='pendente'
        )
        
        # Gerar fatura (RUP) automática
        fatura = Fatura.objects.create(
            id_aluno_id=aluno_id,
            descricao=f"RUP - Emissão de {tipo_documento}",
            total=2500.00, # Valor base exemplo
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
        
        # Contexto para o template
        context = {
            'aluno': solicitacao.id_aluno,
            'solicitacao': solicitacao,
            'hoje': timezone.now(),
            'site_url': settings.SITE_URL if hasattr(settings, 'SITE_URL') else 'http://localhost:8000'
        }
        
        # Selecionar template
        template_name = 'pdf/declaracao_matricula.html'
        if 'CERTIFICADO' in solicitacao.tipo_documento.upper():
            template_name = 'pdf/certificado.html'
        elif 'BOLETIM' in solicitacao.tipo_documento.upper():
            template_name = 'pdf/boletim.html'
            
        pdf_content = PDFService.render_to_pdf(template_name, context)
        
        if pdf_content:
            filename = f"doc_{doc_uuid}.pdf"
            relative_path = PDFService.save_pdf(pdf_content, filename)
            solicitacao.caminho_arquivo = relative_path
            solicitacao.status_solicitacao = 'aguardando_assinatura'
            solicitacao.save()
            
            return relative_path
        return None

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
            filename = f"rup_{solicitacao.uuid_documento}.pdf"
            relative_path = PDFService.save_pdf(pdf_content, filename)
            return relative_path
        return None

    @staticmethod
    def confirmar_pagamento_funcionario(solicitacao_id, funcionario_id):
        """
        Funcionário confirma o pagamento, gera o documento final (com assinatura digital)
        e marca como impresso para assinatura manual.
        """
        solicitacao = SolicitacaoDocumento.objects.get(id_solicitacao=solicitacao_id)
        
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
        
        if caminho_pdf:
            # 4. Marcar como Impresso (pronto para levar ao diretor)
            solicitacao.status_solicitacao = 'impresso'
            solicitacao.save()
            return caminho_pdf
            
        raise Exception("Erro ao gerar o documento PDF final.")
