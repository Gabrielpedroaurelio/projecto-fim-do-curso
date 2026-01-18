from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Sum, Avg
from django.utils import timezone
from datetime import timedelta
from apis.models import Aluno, SolicitacaoDocumento, Fatura, Nota, Turma
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
        
        # 2. Dados do Gráfico de Receita (últimos 6 meses)
        revenue_data = []
        for i in range(5, -1, -1):
            date = timezone.now() - timedelta(days=i*30)
            month_name = date.strftime('%b')
            month_revenue = Fatura.objects.filter(
                status='pago', 
                criado_em__year=date.year, 
                criado_em__month=date.month
            ).aggregate(total=Sum('total'))['total'] or 0
            revenue_data.append({'name': month_name, 'value': float(month_revenue)})

        # 3. Desempenho Operacional (Radar Chart - Fictício baseado em dados reais)
        # Vamos usar médias de notas por categoria ou algo similar
        performance_data = [
            {'subject': 'Solicitações', 'A': min(150, total_solicitacoes * 10), 'fullMark': 150},
            {'subject': 'Alunos', 'A': min(150, Aluno.objects.filter(status_aluno='Activo').count()), 'fullMark': 150},
            {'subject': 'Turmas', 'A': min(150, Turma.objects.count() * 5), 'fullMark': 150},
            {'subject': 'Média Geral', 'A': min(150, (Nota.objects.aggregate(Avg('valor'))['valor__avg'] or 0) * 10), 'fullMark': 150},
            {'subject': 'Eficiência', 'A': 110, 'fullMark': 150}, # Mocked
            {'subject': 'Retenção', 'A': 130, 'fullMark': 150}, # Mocked
        ]

        # 4. Atividades Recentes (Últimas 5 solicitações)
        recent_solicitacoes = SolicitacaoDocumento.objects.all()[:5]
        # Usar o serializer existente para formatar as solicitações
        serializer = SolicitacaoDocumentoListSerializer(recent_solicitacoes, many=True, context={'request': request})

        return Response({
            'kpis': {
                'total_solicitacoes': total_solicitacoes,
                'declaracoes_emitidas': declaracoes_emitidas,
                'novos_alunos': novos_alunos,
                'receita_total': float(receita_total),
                'percentuais': {
                    'solicitacoes': 22.2, # Mocked percentage change
                    'declaracoes': 104.5,
                    'alunos': 12.3,
                    'receita': 14.8
                }
            },
            'revenue_data': revenue_data,
            'performance_data': performance_data,
            'recent_activities': serializer.data
        })
