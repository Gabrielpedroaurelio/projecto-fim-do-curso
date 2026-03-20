import os
from datetime import datetime
from django.utils import timezone
from django.db.models import Sum, Count
from apis.models import SolicitacaoDocumento, Fatura, Aluno, Turma, ConfiguracaoSistema
from apis.services.pdf_service import PDFService

class ReportService:
    """
    Serviço para geração de relatórios gerenciais e estatísticos em PDF.
    """

    @staticmethod
    def gerar_relatorio_mensal_solicitacoes(mes, ano):
        """
        Gera um relatório PDF detalhado das solicitações e financeiro de um mês específico.
        """
        # 1. Coleta de Dados
        solicitacoes = SolicitacaoDocumento.objects.filter(
            data_solicitacao__month=mes,
            data_solicitacao__year=ano
        ).select_related('id_aluno', 'id_aluno__id_turma')

        resumo_status = solicitacoes.values('status_solicitacao').annotate(total=Count('id_solicitacao'))
        
        financeiro = Fatura.objects.filter(
            criado_em__month=mes,
            criado_em__year=ano
        )
        
        total_pago = financeiro.filter(status='paga').aggregate(total=Sum('total'))['total'] or 0
        total_pendente = financeiro.filter(status='pendente').aggregate(total=Sum('total'))['total'] or 0
        
        config = ConfiguracaoSistema.objects.first()
        
        # 2. Preparar Contexto para o Template
        context = {
            'mes': mes,
            'ano': ano,
            'data_emissao': timezone.now(),
            'solicitacoes': solicitacoes,
            'resumo_status': resumo_status,
            'total_pago': total_pago,
            'total_pendente': total_pendente,
            'total_geral': total_pago + total_pendente,
            'config': config,
            'projeto_nome': config.nome_instituicao if config else "IP Maiombe",
            'title': f'Relatório Mensal - {mes}/{ano}'
        }

        # 3. Renderizar PDF
        return PDFService.render_to_pdf('pdf/report_mensal.html', context)

    @staticmethod
    def gerar_listagem_alunos(turma_id):
        """
        Gera uma lista de alunos de uma turma específica para pauta ou chamada.
        """
        try:
            turma = Turma.objects.select_related('id_curso', 'id_classe', 'id_periodo').get(id_turma=turma_id)
            alunos = Aluno.objects.filter(id_turma=turma, status_aluno='Activo').order_by('nome_completo')
            
            config = ConfiguracaoSistema.objects.first()
            
            context = {
                'turma': turma,
                'alunos': alunos,
                'total_alunos': alunos.count(),
                'data_emissao': timezone.now(),
                'config': config,
                'title': f'Listagem de Alunos - {turma.codigo_turma}'
            }
            
            return PDFService.render_to_pdf('pdf/report_alunos.html', context)
        except Turma.DoesNotExist:
            raise ValueError("Turma não encontrada.")
