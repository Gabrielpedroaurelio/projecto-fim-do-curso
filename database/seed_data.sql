-- SEED DATA PARA POSTGRESQL (Gestão Escolar - Fim de Curso)
-- Baseado nos modelos Django atualizados (Senhas Opcionais)

BEGIN;

-- 1. TIPOS DE DISCIPLINA
INSERT INTO tipo_disciplina (id_tipo_disciplina, nome_tipo, sigla) VALUES 
(1, 'Sócio-Cultural', 'SC'),
(2, 'Científica', 'CN'),
(3, 'Técnica, Tecnológica e Prática', 'TTP')
ON CONFLICT (id_tipo_disciplina) DO NOTHING;
SELECT setval('tipo_disciplina_id_tipo_disciplina_seq', (SELECT MAX(id_tipo_disciplina) FROM tipo_disciplina));

-- 2. CLASSES
INSERT INTO classe (id_classe, nivel, descricao) VALUES 
(1, 10, '10ª Classe'),
(2, 11, '11ª Classe'),
(3, 12, '12ª Classe'),
(4, 13, '13ª Classe')
ON CONFLICT (id_classe) DO NOTHING;
SELECT setval('classe_id_classe_seq', (SELECT MAX(id_classe) FROM classe));

-- 3. PERÍODOS
INSERT INTO periodo (id_periodo, periodo, id_responsavel_id) VALUES 
(1, 'Manhã', NULL),
(2, 'Tarde', NULL),
(3, 'Noite', NULL)
ON CONFLICT (periodo) DO NOTHING;
SELECT setval('periodo_id_periodo_seq', (SELECT MAX(id_periodo) FROM periodo));

-- 4. SALAS
INSERT INTO sala (id_sala, numero_sala, capacidade_alunos, localizacao, data_criacao, data_atualizacao, status_base) VALUES 
(1, 1, 45, 'Bloco A - R/C', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Activo'),
(2, 2, 45, 'Bloco A - R/C', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Activo'),
(3, 3, 40, 'Bloco B - 1º Andar', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Activo'),
(4, 5, 35, 'Lab Informática 1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Activo')
ON CONFLICT (id_sala) DO NOTHING;
SELECT setval('sala_id_sala_seq', (SELECT MAX(id_sala) FROM sala));

-- 5. DEPARTAMENTOS
INSERT INTO departamento (id_departamento, nome_departamento, chefe_id_funcionario_id) VALUES 
(1, 'Departamento de Informática', NULL),
(2, 'Departamento de Ciências Exactas', NULL)
ON CONFLICT (id_departamento) DO NOTHING;
SELECT setval('departamento_id_departamento_seq', (SELECT MAX(id_departamento) FROM departamento));

-- 6. ÁREAS DE FORMAÇÃO
INSERT INTO area_formacao (id_area_formacao, nome_area, id_responsavel_id, data_criacao, data_atualizacao, status_base) VALUES 
(1, 'Informática', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Activo'),
(2, 'Construção Civil', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Activo')
ON CONFLICT (id_area_formacao) DO NOTHING;
SELECT setval('area_formacao_id_area_formacao_seq', (SELECT MAX(id_area_formacao) FROM area_formacao));

-- 7. CURSOS
INSERT INTO curso (id_curso, nome_curso, id_area_formacao_id, duracao, id_responsavel_id, data_criacao, data_atualizacao, status_base) VALUES 
(1, 'Informática de Gestão', 1, 4, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Activo'),
(2, 'Técnico de Informática', 1, 4, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Activo')
ON CONFLICT (id_curso) DO NOTHING;
SELECT setval('curso_id_curso_seq', (SELECT MAX(id_curso) FROM curso));

-- 8. DISCIPLINAS
INSERT INTO disciplina (id_disciplina, nome, sigla, carga_horaria, data_criacao, data_atualizacao, status_base) VALUES 
(1, 'Matemática', 'MAT', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Activo'),
(2, 'Língua Portuguesa', 'LP', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Activo'),
(3, 'Técnicas de Programação', 'TLP', 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Activo'),
(4, 'Sistemas de Exploração', 'SE', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Activo')
ON CONFLICT (id_disciplina) DO NOTHING;
SELECT setval('disciplina_id_disciplina_seq', (SELECT MAX(id_disciplina) FROM disciplina));

-- 9. MATRIZES CURRICULARES
INSERT INTO matriz_curricular (id_matriz_curricular, id_curso_id, id_classe_id, descricao, ano_letivo, ativo, data_criacao, data_atualizacao, status_base) VALUES 
(1, 1, 1, 'Matriz IG 10ª 2024', '2024/2025', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Activo')
ON CONFLICT (id_matriz_curricular) DO NOTHING;
SELECT setval('matriz_curricular_id_matriz_curricular_seq', (SELECT MAX(id_matriz_curricular) FROM matriz_curricular));

-- 10. VINCULAR DISCIPLINAS ÀS MATRIZES
INSERT INTO matriz_curricular_disciplina (id_matriz_disciplina, id_matriz_curricular_id, id_disciplina_id, carga_horaria, coeficiente, e_nuclear) VALUES 
(1, 1, 1, 6, 1.5, TRUE),
(2, 1, 2, 4, 1.0, FALSE),
(3, 1, 3, 8, 2.0, TRUE)
ON CONFLICT (id_matriz_disciplina) DO NOTHING;
SELECT setval('matriz_curricular_disciplina_id_matriz_disciplina_seq', (SELECT MAX(id_matriz_disciplina) FROM matriz_curricular_disciplina));

-- 11. TURMAS
INSERT INTO turma (id_turma, id_sala_id, id_curso_id, id_classe_id, id_periodo_id, id_matriz_curricular_id, ano, codigo_turma, data_criacao, data_atualizacao, status_base) VALUES 
(1, 1, 1, 1, 1, 1, '2024', 'S1IG10M24', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Activo')
ON CONFLICT (id_turma) DO NOTHING;
SELECT setval('turma_id_turma_seq', (SELECT MAX(id_turma) FROM turma));

-- 12. ALUNOS (Sem senha definida no SQL)
INSERT INTO aluno (id_aluno, numero_bi, nome_completo, email, numero_matricula, telefone, status_aluno, modo_user, id_turma_id, genero, data_criacao, data_atualizacao, status_base, senha_hash) VALUES 
(1, '009876543LA041', 'Gabriel Pedro Aurélio', 'gabriel@exemplo.com', 'ALU2024001', '923000111', 'Activo', 'Inativo', 1, 'M', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Activo', NULL),
(2, '001234567HA042', 'Maria dos Santos', 'maria@exemplo.com', 'ALU2024002', '931000222', 'Activo', 'Inativo', 1, 'F', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Activo', NULL)
ON CONFLICT (id_aluno) DO NOTHING;
SELECT setval('aluno_id_aluno_seq', (SELECT MAX(id_aluno) FROM aluno));

COMMIT;
