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
        from apis.models import MatrizCurricularDisciplina, Nota, MatrizCurricular, Matricula

        # 1. Identificar a Curso e a Matriz Curricular
        matriz = None
        
        # Prioridade 1: Matriz direta da turma do aluno
        if aluno.id_turma and aluno.id_turma.id_matriz_curricular:
            matriz = aluno.id_turma.id_matriz_curricular
            if not classe:
                classe = aluno.id_turma.id_classe
        
        # Prioridade 2: Buscar por Curso e Classe se matriz não definida na turma
        if not matriz:
            curso = None
            if aluno.id_turma:
                curso = aluno.id_turma.id_curso
                if not classe:
                    classe = aluno.id_turma.id_classe
            
            if not curso or not classe:
                ultima_matricula = Matricula.objects.filter(id_aluno=aluno).select_related('id_turma__id_curso', 'id_turma__id_classe').order_by('-data_matricula').first()
                if ultima_matricula and ultima_matricula.id_turma:
                    curso = curso or ultima_matricula.id_turma.id_curso
                    classe = classe or ultima_matricula.id_turma.id_classe
            
            if curso and classe:
                matriz = MatrizCurricular.objects.filter(id_curso=curso, id_classe=classe, ativo=True).first()
                if not matriz:
                    matriz = MatrizCurricular.objects.filter(id_curso=curso, id_classe=classe).first()

        if not matriz:
            # Fallback: Se não tem matriz, busca todas as disciplinas que o aluno tem nota
            notas_aluno = Nota.objects.filter(id_aluno=aluno).select_related('id_disciplina')
            if not notas_aluno.exists():
                return []
                
            resultados = []
            disciplinas_processadas = set()
            
            # Agrupar notas por disciplina
            for nota in notas_aluno:
                disc = nota.id_disciplina
                if disc.id_disciplina in disciplinas_processadas:
                    continue
                    
                disciplinas_processadas.add(disc.id_disciplina)
                
                # Buscar todas as notas desta disciplina
                notas_disc = [n for n in notas_aluno if n.id_disciplina_id == disc.id_disciplina]
                
                # Estrutura por trimestre (None indica que não foi lançada)
                grades = {
                    '1': {'MAC': None, 'PP': None, 'PT': None, 'MT': None},
                    '2': {'MAC': None, 'PP': None, 'PT': None, 'MT': None},
                    '3': {'MAC': None, 'PP': None, 'PT': None, 'MT': None}
                }
                
                teve_nota = {'1': False, '2': False, '3': False}

                for n in notas_disc:
                    # Normalizar trimestre (Ex: "1º Trimestre" -> "1", "1" -> "1")
                    t_raw = str(n.trimestre) if n.trimestre else ''
                    t_key = t_raw.split('º')[0].strip() if 'º' in t_raw else t_raw.strip()
                    
                    if t_key in grades and n.tipo_nota in grades[t_key]:
                        grades[t_key][n.tipo_nota] = float(n.valor)
                        teve_nota[t_key] = True

                # Calcular Médias Trimestrais (MT = (MAC + PP + PT) / 3)
                for t in grades:
                    g = grades[t]
                    if teve_nota[t]:
                        # Consideramos 0 para notas não lançadas se o trimestre teve algum lançamento
                        v_mac = g['MAC'] if g['MAC'] is not None else 0.0
                        v_pp = g['PP'] if g['PP'] is not None else 0.0
                        v_pt = g['PT'] if g['PT'] is not None else 0.0
                        
                        mt = (v_mac + v_pp + v_pt) / 3
                        g['MT'] = round(mt, 1)

                # Média Final
                soma_mt = sum(grades[t]['MT'] for t in grades if grades[t]['MT'] is not None)
                count_mt = sum(1 for t in grades if grades[t]['MT'] is not None)
                
                if count_mt > 0:
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
                if count_mt == 3:
                    status_disciplina = 'Aprovado' if round(media_final) >= 10 else 'Reprovado'

                resultados.append({
                    'id_disciplina': disc.id_disciplina,
                    'disciplina': disc.nome,
                    'coeficiente': 1.0, # Default já que não temos matriz
                    'trimestres': grades,
                    'media_final': f"{media_final:.1f}",
                    'media_final_valor': media_final,
                    'media_final_extenso': nota_para_extenso(media_final),
                    'resultado': status_disciplina,
                    'count_mt': count_mt
                })
            
            return resultados

        disciplinas_matriz = MatrizCurricularDisciplina.objects.filter(
            id_matriz_curricular=matriz
        ).select_related('id_disciplina')

        resultados = []
        
        for m_disc in disciplinas_matriz:
            notas_disc = Nota.objects.filter(id_aluno=aluno, id_disciplina=m_disc.id_disciplina)
            
            # Estrutura por trimestre (None indica que não foi lançada)
            grades = {
                '1': {'MAC': None, 'PP': None, 'PT': None, 'MT': None},
                '2': {'MAC': None, 'PP': None, 'PT': None, 'MT': None},
                '3': {'MAC': None, 'PP': None, 'PT': None, 'MT': None}
            }
            
            teve_nota = {'1': False, '2': False, '3': False}

            for n in notas_disc:
                # Normalizar trimestre (Ex: "1º Trimestre" -> "1", "1" -> "1")
                t_raw = str(n.trimestre) if n.trimestre else ''
                t_key = t_raw.split('º')[0].strip() if 'º' in t_raw else t_raw.strip()
                
                if t_key in grades and n.tipo_nota in grades[t_key]:
                    grades[t_key][n.tipo_nota] = float(n.valor)
                    teve_nota[t_key] = True

            # Calcular Médias Trimestrais (MT = (MAC + PP + PT) / 3)
            for t in grades:
                g = grades[t]
                if teve_nota[t]:
                    # Consideramos 0 para notas não lançadas se o trimestre teve algum lançamento
                    v_mac = g['MAC'] if g['MAC'] is not None else 0.0
                    v_pp = g['PP'] if g['PP'] is not None else 0.0
                    v_pt = g['PT'] if g['PT'] is not None else 0.0
                    
                    mt = (v_mac + v_pp + v_pt) / 3
                    g['MT'] = round(mt, 1)

            # Média Final
            soma_mt = sum(grades[t]['MT'] for t in grades if grades[t]['MT'] is not None)
            count_mt = sum(1 for t in grades if grades[t]['MT'] is not None)
            
            if count_mt > 0:
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
            if count_mt == 3:
                status_disciplina = 'Aprovado' if round(media_final) >= 10 else 'Reprovado'

            resultados.append({
                'id_disciplina': m_disc.id_disciplina.id_disciplina,
                'disciplina': m_disc.id_disciplina.nome,
                'coeficiente': float(m_disc.coeficiente),
                'trimestres': grades,
                'media_final': f"{media_final:.1f}",
                'media_final_valor': media_final,
                'media_final_extenso': nota_para_extenso(media_final),
                'resultado': status_disciplina,
                'count_mt': count_mt
            })

        return resultados
