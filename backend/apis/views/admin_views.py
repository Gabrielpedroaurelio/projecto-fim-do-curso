from django.shortcuts import render, redirect, get_object_or_404
from django.views import View
from django.contrib import messages
from django.db import transaction
from django.utils import timezone
from apis.models import (
    Turma, Disciplina, Aluno, Nota,
    MatrizCurricularDisciplina, Periodo, Documento
)

class GradeLaunchView(View):
    template_name = 'admin/grade_launch.html'

    def get(self, request):
        context = self._get_context_data(request)
        return render(request, self.template_name, context)

    def post(self, request):
        data = request.POST
        id_turma = data.get('id_turma')
        id_disciplina = data.get('id_disciplina')
        tipo_avaliacao = data.get('tipo_avaliacao')
        trimestre = data.get('trimestre')
        
        if not (id_turma and id_disciplina and tipo_avaliacao and trimestre):
            messages.error(request, "Todos os campos de filtro são obrigatórios.")
            return self.get(request)

        try:
            turma = Turma.objects.get(pk=id_turma)
            disciplina = Disciplina.objects.get(pk=id_disciplina)
            
            # Recuperar alunos
            alunos = Aluno.objects.filter(id_turma=turma, status_aluno='Activo').order_by('nome_completo')
            
            count_created = 0
            count_updated = 0
            
            with transaction.atomic():
                for aluno in alunos:
                    nota_value = data.get(f'nota_{aluno.id_aluno}')
                    
                    if nota_value:
                        nota_value = float(nota_value)
                        
                        # Validar limites
                        if nota_value < 0 or nota_value > 20:
                            raise ValueError(f"Nota inválida para o aluno {aluno.nome_completo}")

                        # Buscar ou criar nota
                        nota_obj, created = Nota.objects.update_or_create(
                            id_aluno=aluno,
                            id_disciplina=disciplina,
                            tipo_avaliacao=tipo_avaliacao,
                            trimestre=trimestre,
                            id_turma=turma,
                            defaults={
                                'valor': nota_value,
                                # 'id_professor': request.user.funcionario if hasattr(request.user, 'funcionario') else None 
                                # Assumindo que o usuário logado no admin pode não ser um funcionario linkado diretamente
                            }
                        )
                        
                        if created:
                            count_created += 1
                        else:
                            count_updated += 1
            
            messages.success(request, f"Notas salvas com sucesso! ({count_created} criadas, {count_updated} atualizadas)")
            # Manter filtros na url ou redirect para clean state? Melhor manter para continuar lançando
            # Para simplificar, redirect para mesma view com query params se quiséssemos manter estado
            
        except Exception as e:
            messages.error(request, f"Erro ao salvar notas: {str(e)}")
            
        return self.get(request)

    def _get_context_data(self, request):
        # Filtros iniciais
        context = {
            'turmas': Turma.objects.all().order_by('codigo_turma'),
            'disciplinas': [], # Carregado via JS ou Postback simples se selecionado
            'tipos_avaliacao': Nota.TIPO_AVALIACAO_CHOICES,
            'trimestres': Nota.TRIMESTRE_CHOICES,
            'selected_turma': None,
            'selected_disciplina': None,
            'selected_tipo': None,
            'selected_trimestre': None,
            'alunos_notas': []
        }
        
        # Recuperar parâmetros (GET ou POST preservado)
        id_turma = request.GET.get('id_turma') or request.POST.get('id_turma')
        id_disciplina = request.GET.get('id_disciplina') or request.POST.get('id_disciplina')
        tipo_avaliacao = request.GET.get('tipo_avaliacao') or request.POST.get('tipo_avaliacao')
        trimestre = request.GET.get('trimestre') or request.POST.get('trimestre')
        
        if id_turma:
            turma = get_object_or_404(Turma, pk=id_turma)
            context['selected_turma'] = int(id_turma)
            
            # Carregar disciplinas da turma (Idealmente via Matriz, mas fallback para todas se não houver matriz)
            # Logica: Matriz -> Disciplinas. Se não, todas disciplinas.
            if turma.id_matriz_curricular:
                # Buscar disciplinas da matriz
                matriz_disciplinas = MatrizCurricularDisciplina.objects.filter(
                    id_matriz_curricular=turma.id_matriz_curricular
                ).select_related('id_disciplina')
                context['disciplinas'] = [md.id_disciplina for md in matriz_disciplinas]
            else:
                 # Fallback: Todas disciplinas (menos ideal, mas funcional)
                 context['disciplinas'] = Disciplina.objects.all().order_by('nome')

        if id_turma and id_disciplina and tipo_avaliacao and trimestre:
             context['selected_disciplina'] = int(id_disciplina)
             context['selected_tipo'] = tipo_avaliacao
             context['selected_trimestre'] = trimestre
             
             # Carregar alunos e notas existentes
             alunos = Aluno.objects.filter(id_turma_id=id_turma, status_aluno='Activo').order_by('nome_completo')
             
             alunos_list = []
             for aluno in alunos:
                 # Tentar buscar nota existente
                 nota = Nota.objects.filter(
                     id_aluno=aluno,
                     id_disciplina_id=id_disciplina,
                     tipo_avaliacao=tipo_avaliacao,
                     trimestre=trimestre
                 ).first()
                 
                 alunos_list.append({
                     'aluno': aluno,
                     'nota_valor': nota.valor if nota else ''
                 })
            
             context['alunos_notas'] = alunos_list
             
        return context
