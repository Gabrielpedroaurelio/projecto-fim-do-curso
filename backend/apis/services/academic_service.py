from django.db.models import Avg
from apis.models import Nota, FaltaAluno, Aluno

class AcademicService:
    """
    Serviço para gestão de notas, faltas e desempenho académico
    """
    
    @staticmethod
    def calcular_media_disciplina(aluno_id, disciplina_id):
        """
        Calcula a média de um aluno em uma disciplina específica
        """
        notas = Nota.objects.filter(id_aluno_id=aluno_id, id_disciplina_id=disciplina_id)
        if not notas.exists():
            return 0
            
        media = notas.aggregate(Avg('valor'))['valor__avg']
        return round(media, 2)

    @staticmethod
    def obter_resumo_academico(aluno_id):
        """
        Retorna um resumo completo do desempenho do aluno
        """
        aluno = Aluno.objects.get(id_aluno=aluno_id)
        notas = Nota.objects.filter(id_aluno=aluno)
        faltas = FaltaAluno.objects.filter(id_aluno=aluno).count()
        
        media_geral = notas.aggregate(Avg('valor'))['valor__avg'] or 0
        
        # Agrupar por disciplina
        disciplinas_stats = {}
        for nota in notas:
            disc_nome = nota.id_disciplina.nome
            if disc_nome not in disciplinas_stats:
                disciplinas_stats[disc_nome] = []
            disciplinas_stats[disc_nome].append(float(nota.valor))
            
        resumo_disciplinas = [
            {
                'disciplina': nome,
                'media': round(sum(vals)/len(vals), 2),
                'total_avaliacoes': len(vals)
            }
            for nome, vals in disciplinas_stats.items()
        ]
        
        return {
            'aluno': aluno.nome_completo,
            'media_geral': round(media_geral, 2),
            'total_faltas': faltas,
            'desempenho_por_disciplina': resumo_disciplinas,
            'situacao': 'Aprovado' if media_geral >= 10 else 'Reprovado' # Lógica simplificada
        }

    @staticmethod
    def get_boletim_aluno(aluno, classe=None):
        """
        Calcula as notas detalhadas (MAC, PP, PT) e médias por trimestre.
        Retorna estrutura pronta para a Declaração de Aproveitamento e Boletim.
        """
        from apis.models import MatrizCurricularDisciplina, Nota, MatrizCurricular

        # Se nenhuma classe for especificada, usa a classe da turma atual do aluno
        if not classe and aluno.id_turma:
            classe = aluno.id_turma.id_classe

        if not classe:
            return []

        # Tentar buscar a matriz curricular ativa para o curso e classe
        matriz = MatrizCurricular.objects.filter(
            id_curso=aluno.id_turma.id_curso,
            id_classe=classe,
            ativo=True
        ).first()

        # Se não achar matriz específica da classe, tenta genericamente (fallback)
        if not matriz:
             # Fallback ou retorno vazio. 
             # Para sistemas legados sem matriz, talvez precisássemos iterar sobre Disciplinas do Curso
             # Mas vamos assumir que a Matriz é necessária para o boletim correto.
             return []

        disciplinas_matriz = MatrizCurricularDisciplina.objects.filter(
            id_matriz_curricular=matriz
        ).select_related('id_disciplina')

        resultados = []
        
        for m_disc in disciplinas_matriz:
            notas_disc = Nota.objects.filter(id_aluno=aluno, id_matriz_disciplina=m_disc)
            
            # Estrutura por trimestre
            grades = {
                '1': {'MAC': 0.0, 'PP': 0.0, 'PT': 0.0, 'MT': 0.0},
                '2': {'MAC': 0.0, 'PP': 0.0, 'PT': 0.0, 'MT': 0.0},
                '3': {'MAC': 0.0, 'PP': 0.0, 'PT': 0.0, 'MT': 0.0}
            }
            
            # Flags para saber se houve lançamento no trimestre
            teve_nota = {'1': False, '2': False, '3': False}

            for n in notas_disc:
                if n.trimestre in grades and n.tipo_nota in grades[n.trimestre]:
                    grades[n.trimestre][n.tipo_nota] = float(n.valor)
                    teve_nota[n.trimestre] = True

            # Calcular Médias Trimestrais (MT = (MAC + PP + PT) / 3) ou regra específica
            # Regra Comum: MT = (MAC + PP + PT) / 3
            # Ajuste: Se faltar alguma nota (ex: PP), deve dividir por 3 ou apenas pelas lançadas?
            # Geralmente em sistemas escolares divide-se por 3 fixo se o trimestre já fechou, 
            # ou calcula-se parcial. Vamos assumir divisão por 3 para MT oficial.
            
            for t in grades:
                g = grades[t]
                # Se tivermos as 3 notas, cálculo direto. Se faltar, considera 0.
                if teve_nota[t]: 
                    # Se quiser ignorar zeros não lançados, a lógica seria diferente.
                    # As regras angolanas geralmente exigem MAC, PP e PT.
                    mt = (g['MAC'] + g['PP'] + g['PT']) / 3
                    g['MT'] = round(mt, 1)

            # Média Final (MF = (MT1 + MT2 + MT3) / 3)
            # Somar apenas trimestres com média > 0 ou dividir por 3 sempre?
            # Se estamos no 1º trimestre, a MF não deve ser calculada ainda ou deve ser parcial?
            # Vamos calcular baseada nos trimestres que têm MT gerada.
            
            soma_mt = sum(grades[t]['MT'] for t in grades if grades[t]['MT'] > 0)
            count_mt = sum(1 for t in grades if grades[t]['MT'] > 0)
            
            # Se já tiver notas nos 3 trimestres, divide por 3.
            # Se for parcial, mostra a média atual acumulada? 
            # Regra padrão: MF é calculada ao final. Mas para visualização parcial:
            
            if count_mt > 0:
                # Opção A: Média Parcial (soma / qtd_trimestres_com_nota)
                # Opção B: Média Projetada (soma / 3) -> Penaliza quem ainda não teve nota
                # Vamos usar Opção A para visualização durante o ano, mas Opção B para Aprovação Final.
                media_final = soma_mt / count_mt
            else:
                media_final = 0.0

            def nota_para_extenso(n):
                nomes = {
                    0: 'Zero', 1: 'Um', 2: 'Dois', 3: 'Três', 4: 'Quatro', 5: 'Cinco',
                    6: 'Seis', 7: 'Sete', 8: 'Oito', 9: 'Nove', 10: 'Dez',
                    11: 'Onze', 12: 'Doze', 13: 'Treze', 14: 'Catorze', 15: 'Quinze',
                    16: 'Dezasseis', 17: 'Dezassete', 18: 'Dezoito', 19: 'Dezanove', 20: 'Vinte'
                }
                inteiro = int(round(n))
                return nomes.get(inteiro, str(inteiro))

            status_disciplina = '---'
            if count_mt == 3: # Só define status final se tiver os 3 trimestres (ou forçado encerramento)
                # Regra de aprovação: MF >= 10 (ou 9.5 arredondado)
                status_disciplina = 'Aprovado' if round(media_final) >= 10 else 'Reprovado'

            resultados.append({
                'id_disciplina': m_disc.id_disciplina.id_disciplina,
                'disciplina': m_disc.id_disciplina.nome,
                'coeficiente': m_disc.coeficiente,
                'trimestres': grades,
                'media_final': f"{media_final:.1f}",
                'media_final_valor': media_final,
                'media_final_extenso': nota_para_extenso(media_final),
                'resultado': status_disciplina,
                'count_mt': count_mt # Útil para saber se o ano fechou
            })

        return resultados
