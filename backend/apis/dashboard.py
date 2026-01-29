
from django.db.models import Count, Avg, Sum
from django.db.models.functions import TruncMonth
from apis.models import (
    Aluno, Funcionario, Turma, Curso, SolicitacaoDocumento, Fatura, Nota
)
import datetime

def dashboard_callback(request, context):
    """
    Callback para popular o dashboard do Django Unfold.
    """
    try:
        # =====================================================================
        # DADOS GERAIS (KPIs)
        # =====================================================================
        total_alunos_ativos = Aluno.objects.filter(status_aluno='Activo').count()
        total_funcionarios = Funcionario.objects.filter(status_funcionario='Activo').count()
        
        # Financeiro
        faturas_pendentes_count = Fatura.objects.filter(status='pendente').count()
        total_pendente_kz = Fatura.objects.filter(status='pendente').aggregate(total=Sum('total'))['total'] or 0
        
        # Acadêmico
        media_geral_escola = Nota.objects.filter(valor__isnull=False).aggregate(media=Avg('valor'))['media'] or 0
        
        kpis = [
            {
                'title': 'Alunos Ativos',
                'metric': total_alunos_ativos,
                'footer': 'Total de alunos matriculados',
                'icon': 'school',
                'color': 'primary',
            },
            {
                'title': 'Funcionários',
                'metric': total_funcionarios,
                'footer': 'Professores e Staff',
                'icon': 'badge',
                'color': 'info',
            },
            {
                'title': 'Média Geral',
                'metric': f"{media_geral_escola:.1f}",
                'footer': 'Desempenho global da escola',
                'icon': 'trending_up',
                'color': 'success' if media_geral_escola >= 10 else 'danger',
            },
            {
                'title': 'Faturas Pendentes',
                'metric': f"{total_pendente_kz:,.2f} Kz",
                'footer': f"{faturas_pendentes_count} faturas em aberto",
                'icon': 'payments',
                'color': 'warning',
            },
        ]

        # =====================================================================
        # GRÁFICOS
        # =====================================================================
        
        # 1. GRÁFICO DE COLUNAS: Alunos por Curso
        # ---------------------------------------------------------------------
        alunos_por_curso = Aluno.objects.values('id_turma__id_curso__nome_curso') \
            .annotate(total=Count('id_aluno')) \
            .order_by('-total')
            
        col_labels = [item['id_turma__id_curso__nome_curso'] for item in alunos_por_curso if item['id_turma__id_curso__nome_curso']]
        col_data = [item['total'] for item in alunos_por_curso if item['id_turma__id_curso__nome_curso']]
        
        # 2. GRÁFICO DE SETOR (PIE): Distribuição por Gênero
        # ---------------------------------------------------------------------
        alunos_por_genero = Aluno.objects.values('genero').annotate(total=Count('id_aluno'))
        pie_labels = [item['genero'] for item in alunos_por_genero if item['genero']]
        pie_data = [item['total'] for item in alunos_por_genero if item['genero']]
        
        # 3. GRÁFICO DE LINHA: Evolução de Matrículas (Simulado por ID ou Data se houver)
        # Como Aluno não tem 'created_at' explícito no código visto, vamos usar 'Nota' por mês 
        # como proxy de atividade, ou tentar Matrículas se tiver data.
        # Vamos usar Notas lançadas por mês nos últimos 6 meses.
        
        from django.utils import timezone
        last_6_months = timezone.now() - datetime.timedelta(days=180)
        notas_por_mes = Nota.objects.filter(data_lancamento__gte=last_6_months) \
            .annotate(month=TruncMonth('data_lancamento')) \
            .values('month') \
            .annotate(total=Count('id_nota')) \
            .order_by('month')
            
        line_labels = [item['month'].strftime('%b/%Y') for item in notas_por_mes]
        line_data = [item['total'] for item in notas_por_mes]

        charts = [
            {
                "title": "Alunos por Curso (Top Cursos)",
                "type": "bar", # Unfold usa 'bar' para colunas verticais se configurado, ou horizontal.
                "labels": col_labels,
                "datasets": [
                    {
                        "label": "Total de Alunos",
                        "data": col_data,
                        "backgroundColor": "#10B981", # Emerald 500
                        "borderColor": "#059669",
                        "borderWidth": 1,
                    }
                ]
            },
            {
                "title": "Distribuição por Gênero",
                "type": "doughnut", # ou 'pie'
                "labels": pie_labels,
                "datasets": [
                    {
                        "data": pie_data,
                        "backgroundColor": ["#3B82F6", "#EC4899", "#6366F1"], # Blue, Pink, Indigo
                        "hoverOffset": 4
                    }
                ]
            },
             {
                "title": "Atividade Acadêmica (Notas Lançadas/Mês)",
                "type": "line",
                "labels": line_labels,
                "datasets": [
                    {
                        "label": "Notas Lançadas",
                        "data": line_data,
                        "borderColor": "#F59E0B", # Amber
                        "backgroundColor": "rgba(245, 158, 11, 0.2)",
                        "fill": True,
                        "tension": 0.4
                    }
                ]
            }
        ]

        context.update({
            "kpis": kpis,
            "charts": charts
        })

    except Exception as e:
        print(f"Erro no Dashboard: {e}")
        # Fallback silencioso
        context.update({"kpis": [], "charts": []})

    return context
