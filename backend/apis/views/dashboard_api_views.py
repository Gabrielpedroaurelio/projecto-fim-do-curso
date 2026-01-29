from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Sum, Avg, Q
from django.utils import timezone
from datetime import timedelta
from apis.models import Aluno, SolicitacaoDocumento, Fatura, Nota, Turma, HistoricoLogin
from apis.serializers.documento_serializers import SolicitacaoDocumentoListSerializer

class DashboardStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 1. KPIs
        total_solicitacoes = SolicitacaoDocumento.objects.count()
        declaracoes_emitidas = SolicitacaoDocumento.objects.filter(status_solicitacao='aprovado').count()
        
        # Novos alunos (últimos 30 dias)
        um_mes_atras = timezone.now() - timedelta(days=30)
        novos_alunos = Aluno.objects.filter(criado_em__gte=um_mes_atras).count()
        
        # Receita total (Faturas pagas)
        receita_total = Fatura.objects.filter(status='pago').aggregate(total=Sum('total'))['total'] or 0
        
        # 2. Dados de Engajamento de Usuários (Últimos 6 meses)
        # Comparação de logins ou atividade de Alunos, Funcionários, Encarregados
        engagement_data = []
        for i in range(5, -1, -1):
            date = timezone.now() - timedelta(days=i*30)
            month_name = date.strftime('%b')
            
            # Filtra logins por mês e tipo de usuario
            alunos_logins = HistoricoLogin.objects.filter(
                id_aluno__isnull=False,
                hora_entrada__year=date.year,
                hora_entrada__month=date.month
            ).count()
            
            funcionarios_logins = HistoricoLogin.objects.filter(
                id_funcionario__isnull=False,
                hora_entrada__year=date.year,
                hora_entrada__month=date.month
            ).count()
            
            encarregados_logins = HistoricoLogin.objects.filter(
                id_encarregado__isnull=False,
                hora_entrada__year=date.year,
                hora_entrada__month=date.month
            ).count()

            engagement_data.append({
                'name': month_name, 
                'Alunos': alunos_logins,
                'Funcionarios': funcionarios_logins,
                'Encarregados': encarregados_logins
            })

        # 3. Comparação de Solicitações por Tipo (Últimos 6 meses)
        requests_comparison_data = []
        for i in range(5, -1, -1):
            date = timezone.now() - timedelta(days=i*30)
            month_name = date.strftime('%b')
            
            declaracoes = SolicitacaoDocumento.objects.filter(
                tipo_documento__icontains='Declaração',
                data_solicitacao__year=date.year,
                data_solicitacao__month=date.month
            ).count()
            
            certificados = SolicitacaoDocumento.objects.filter(
                tipo_documento__icontains='Certificado',
                data_solicitacao__year=date.year,
                data_solicitacao__month=date.month
            ).count()
            
            boletins = SolicitacaoDocumento.objects.filter(
                tipo_documento__icontains='Boletim',
                data_solicitacao__year=date.year,
                data_solicitacao__month=date.month
            ).count()

            requests_comparison_data.append({
                'name': month_name,
                'Declaracao': declaracoes,
                'Certificado': certificados,
                'Boletim': boletins
            })

        # 4. Atividades Recentes (Últimas 5 solicitações)
        recent_solicitacoes = SolicitacaoDocumento.objects.all().order_by('-data_solicitacao')[:5]
        serializer = SolicitacaoDocumentoListSerializer(recent_solicitacoes, many=True, context={'request': request})

        return Response({
            'kpis': {
                'total_solicitacoes': total_solicitacoes,
                'declaracoes_emitidas': declaracoes_emitidas,
                'novos_alunos': novos_alunos,
                'receita_total': float(receita_total),
                'percentuais': {
                    'solicitacoes': 22.2, 
                    'declaracoes': 104.5,
                    'alunos': 12.3,
                    'receita': 14.8
                }
            },
            'engagement_data': engagement_data,
            'requests_comparison_data': requests_comparison_data,
            'recent_activities': serializer.data
        })
