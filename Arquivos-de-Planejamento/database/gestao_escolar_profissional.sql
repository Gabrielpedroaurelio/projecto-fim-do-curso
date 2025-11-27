-- ===================================================================
-- SISTEMA DE GESTÃO DE DECLARAÇÕES ESCOLARES - VERSÃO PROFISSIONAL
-- Banco de dados PostgreSQL
-- ===================================================================
CREATE DATABASE gestao_escolar WITH OWNER = postgres ENCODING 'utf8' CONNECTION LIMIT -1;
\c gestao_escolar;

-- =========================
-- 1) TIPOS ENUM
-- =========================
-- Define gênero do aluno/funcionário
CREATE TYPE genero_type AS ENUM('F','M');

-- Define período das turmas
CREATE TYPE periodo_type AS ENUM('Manhã','Tarde','Noite');

-- Status do aluno
CREATE TYPE status_aluno_type AS ENUM('Activo','Expulso','Transferido','Suspenso');

-- Status do funcionário
CREATE TYPE status_funcionario_type AS ENUM('Activo','Inactivo','Demitido','Banido');

-- Tipo de avaliação
CREATE TYPE tipo_avaliacao_type AS ENUM('Prova do Professor','Prova Trimestral','Avaliação Continua');

-- Status de fatura
CREATE TYPE fatura_status_type AS ENUM('pendente','paga','cancelada');

-- Status de solicitação de documento
CREATE TYPE status_solicitacao_type AS ENUM('pendente','aprovado','rejeitado','pago');

-- =========================
-- 2) TABELAS BASE
-- =========================

-- SALA: Armazena as salas de aula
CREATE TABLE IF NOT EXISTS sala (
    id_sala SERIAL PRIMARY KEY,                       -- Identificador único da sala
    numero_sala SMALLINT NOT NULL,                    -- Número da sala
    capacidade_alunos INT NOT NULL,                   -- Capacidade máxima de alunos
    img_path TEXT[],                                   -- Imagens da sala (array de paths)
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP  -- Data de criação
);

-- CLASSE: Representa o ano/nível
CREATE TABLE IF NOT EXISTS classe (
    id_classe SERIAL PRIMARY KEY,                     -- Identificador único da classe
    nivel SMALLINT NOT NULL,                          -- Ex: 10, 11, 12
    descricao VARCHAR(80)                              -- Descrição opcional da classe
);

-- CARGO: Cargos de funcionários
CREATE TABLE IF NOT EXISTS cargo (
    id_cargo SERIAL PRIMARY KEY,                      -- ID do cargo
    nome_cargo VARCHAR(100) NOT NULL                  -- Nome do cargo (ex: Professor, Diretor)
);

-- CATEGORIA: Categoria de livros
CREATE TABLE IF NOT EXISTS categoria (
    id_categoria SERIAL PRIMARY KEY,
    nome_categoria VARCHAR(100) NOT NULL
);

-- FUNCIONÁRIO: Todos os tipos de funcionários do sistema
CREATE TABLE IF NOT EXISTS funcionario (
    id_funcionario SERIAL PRIMARY KEY,               -- Identificador único
    numero_bi VARCHAR(20) UNIQUE,                   -- Número do BI (opcional)
    codigo_identificacao VARCHAR(50) UNIQUE,        -- Código interno de identificação
    nome_completo VARCHAR(150) NOT NULL,            -- Nome completo
    id_cargo INT REFERENCES cargo(id_cargo) ON DELETE SET NULL, -- Cargo do funcionário
    genero genero_type,                             -- Gênero
    email VARCHAR(150) UNIQUE,                      -- Email único
    telefone VARCHAR(30),                            -- Telefone de contato
    provincia_residencia VARCHAR(100),              -- Endereço: província
    municipio_residencia VARCHAR(100),              -- Endereço: município
    bairro_residencia VARCHAR(100),                 -- Endereço: bairro
    senha_hash VARCHAR(255),                        -- Senha criptografada
    status_funcionario status_funcionario_type DEFAULT 'Activo', -- Status atual
    descricao TEXT,                                 -- Descrição/opcional
    data_admissao DATE,                             -- Data de admissão
    is_online BOOLEAN DEFAULT FALSE,                -- Estado online
    img_path TEXT,                                  -- Foto do funcionário
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Data de criação
);

-- DEPARTAMENTO: Departamentos da instituição
CREATE TABLE IF NOT EXISTS departamento (
    id_departamento SERIAL PRIMARY KEY,
    nome_departamento VARCHAR(150) NOT NULL,       -- Nome do departamento
    chefe_id_funcionario INT REFERENCES funcionario(id_funcionario) ON DELETE SET NULL -- Chefe do departamento
);

-- SEÇÃO: Seções dentro dos departamentos
CREATE TABLE IF NOT EXISTS seccao (
    id_seccao SERIAL PRIMARY KEY,
    nome_seccao VARCHAR(150) NOT NULL,
    id_departamento INT REFERENCES departamento(id_departamento) ON DELETE SET NULL
);

-- CARGO_FUNCIONÁRIO: Histórico de cargos ocupados
CREATE TABLE IF NOT EXISTS cargo_funcionario (
    id_cargo_funcionario SERIAL PRIMARY KEY,
    id_cargo INT REFERENCES cargo(id_cargo) ON DELETE CASCADE,
    id_funcionario INT REFERENCES funcionario(id_funcionario) ON DELETE CASCADE,
    data_inicio DATE,                                -- Data de início no cargo
    data_fim DATE                                    -- Data de saída
);

-- AREA_FORMACAO: Áreas de formação dos cursos
CREATE TABLE IF NOT EXISTS area_formacao (
    id_area_formacao SERIAL PRIMARY KEY,
    nome_area VARCHAR(150) NOT NULL,
    id_responsavel INT REFERENCES funcionario(id_funcionario) ON DELETE SET NULL, -- Coordenador da área
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CURSO: Cursos oferecidos
CREATE TABLE IF NOT EXISTS curso (
    id_curso SERIAL PRIMARY KEY,
    nome_curso VARCHAR(150) NOT NULL,
    id_area_formacao INT REFERENCES area_formacao(id_area_formacao) ON DELETE SET NULL,
    duracao_meses INT,
    id_responsavel INT REFERENCES funcionario(id_funcionario) ON DELETE SET NULL, -- Coordenador
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PERÍODO: Manhã, tarde, noite
CREATE TABLE IF NOT EXISTS periodo (
    id_periodo SERIAL PRIMARY KEY,
    periodo periodo_type NOT NULL,
    id_responsavel INT REFERENCES funcionario(id_funcionario) ON DELETE SET NULL
);

-- TURMA: Cada turma de alunos
CREATE TABLE IF NOT EXISTS turma (
    id_turma SERIAL PRIMARY KEY,
    codigo_turma VARCHAR(50) UNIQUE NOT NULL,       -- Código único da turma
    id_sala INT REFERENCES sala(id_sala) ON DELETE SET NULL,
    id_curso INT REFERENCES curso(id_curso) ON DELETE SET NULL,
    id_classe INT REFERENCES classe(id_classe) ON DELETE SET NULL,
    id_periodo INT REFERENCES periodo(id_periodo) ON DELETE SET NULL,
    ano SMALLINT,                                   -- Ano corrente
    id_responsavel INT REFERENCES funcionario(id_funcionario) ON DELETE SET NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 3) ALUNOS E ENCARREGADOS
-- =========================

-- ENCARREGADO: Responsável pelo aluno
CREATE TABLE IF NOT EXISTS encarregado (
    id_encarregado SERIAL PRIMARY KEY,
    nome_completo VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    telefone VARCHAR(30)[],
    provincia_residencia VARCHAR(100),
    municipio_residencia VARCHAR(100),
    bairro_residencia VARCHAR(100),
    numero_casa VARCHAR(100),
    senha_hash VARCHAR(255),
    img_path TEXT,
    is_online BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ALUNO
CREATE TABLE IF NOT EXISTS aluno (
    id_aluno SERIAL PRIMARY KEY,
    numero_bi VARCHAR(20) UNIQUE,
    nome_completo VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    numero_matricula BIGINT UNIQUE,
    telefone VARCHAR(30)[],
    provincia_residencia VARCHAR(100),
    municipio_residencia VARCHAR(100),
    bairro_residencia VARCHAR(100),
    numero_casa VARCHAR(100),
    senha_hash VARCHAR(255),
    genero genero_type,
    status_aluno status_aluno_type DEFAULT 'Activo',
    modo_user VARCHAR(20) DEFAULT 'Inativo',       -- Status do login
    id_turma INT REFERENCES turma(id_turma) ON DELETE SET NULL,
    img_path TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_online BOOLEAN DEFAULT FALSE
);

-- RELAÇÃO ALUNO-ENCARREGADO
CREATE TABLE IF NOT EXISTS aluno_encarregado (
    id_aluno_encarregado SERIAL PRIMARY KEY,
    id_aluno INT REFERENCES aluno(id_aluno) ON DELETE CASCADE,
    id_encarregado INT REFERENCES encarregado(id_encarregado) ON DELETE CASCADE,
    grau_parentesco VARCHAR(80) -- pai, mae, tutor
);

-- =========================
-- 4) DOCUMENTOS (PDF) COM IDENTIFICADOR ÚNICO
-- =========================
CREATE TABLE IF NOT EXISTS documento (
    id_documento SERIAL PRIMARY KEY,
    id_aluno INT REFERENCES aluno(id_aluno) ON DELETE SET NULL,
    tipo_documento VARCHAR(100),                     -- Ex: Declaração, Certificado
    caminho_pdf TEXT,                                -- Path do arquivo PDF
    imagem_carimbo TEXT,                             -- Path ou Base64 da assinatura/carimbo
    uuid_documento UUID DEFAULT gen_random_uuid(),   -- Identificador único do documento (anti-fraude)
    criado_por INT REFERENCES funcionario(id_funcionario) ON DELETE SET NULL,
    data_emissao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SOLICITAÇÃO DE DOCUMENTO (para fluxo de pagamento e aprovação)
CREATE TABLE IF NOT EXISTS solicitacao_documento (
    id_solicitacao SERIAL PRIMARY KEY,
    id_aluno INT REFERENCES aluno(id_aluno) ON DELETE SET NULL,
    id_encarregado INT REFERENCES encarregado(id_encarregado) ON DELETE SET NULL,
    id_funcionario INT REFERENCES funcionario(id_funcionario) ON DELETE SET NULL, -- Secretário responsável
    tipo_documento VARCHAR(100),
    status_solicitacao status_solicitacao_type DEFAULT 'pendente',
    caminho_arquivo TEXT,                             -- PDF gerado após aprovação
    uuid_documento UUID,                              -- Referência ao documento final
    data_solicitacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_aprovacao TIMESTAMP WITH TIME ZONE
);

-- =========================
-- 6) BIBLIOTECA E LIVROS DIGITAIS
-- =========================

-- LIVRO: Livro físico ou digital da escola
CREATE TABLE IF NOT EXISTS livro (
    id_livro SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,                     -- Título do livro
    editora VARCHAR(150),                             -- Editora
    id_responsavel INT REFERENCES funcionario(id_funcionario) ON DELETE SET NULL, -- Funcionário responsável pelo upload
    caminho_arquivo TEXT,                             -- Path do arquivo digital
    id_categoria INT REFERENCES categoria(id_categoria) ON DELETE SET NULL,      -- Categoria do livro
    data_upload TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP               -- Data de cadastro
);

-- =========================
-- 7) DISCIPLINAS E VINCULAÇÕES
-- =========================

-- TIPO_DISCIPLINA: Ex: Obrigatória, Optativa
CREATE TABLE IF NOT EXISTS tipo_disciplina (
    id_tipo_disciplina SERIAL PRIMARY KEY,
    nome_tipo VARCHAR(80),                            -- Nome do tipo de disciplina
    sigla VARCHAR(20)                                 -- Sigla
);

-- DISCIPLINA: Cada disciplina ofertada
CREATE TABLE IF NOT EXISTS disciplina (
    id_disciplina SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    id_tipo_disciplina INT REFERENCES tipo_disciplina(id_tipo_disciplina) ON DELETE SET NULL,
    carga_horaria INT,                                -- Horas semanais ou totais
    id_coordenador INT REFERENCES funcionario(id_funcionario) ON DELETE SET NULL, -- Coordenador da disciplina
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- DISCIPLINA_CURSO: Relaciona disciplinas a cursos
CREATE TABLE IF NOT EXISTS disciplina_curso (
    id_disciplina_curso SERIAL PRIMARY KEY,
    id_curso INT REFERENCES curso(id_curso) ON DELETE CASCADE,
    id_disciplina INT REFERENCES disciplina(id_disciplina) ON DELETE CASCADE
);

-- PROFESSOR_DISCIPLINA: Vincula professores às disciplinas e turmas
CREATE TABLE IF NOT EXISTS professor_disciplina (
    id_professor_disciplina SERIAL PRIMARY KEY,
    id_funcionario INT REFERENCES funcionario(id_funcionario) ON DELETE CASCADE,
    id_disciplina INT REFERENCES disciplina(id_disciplina) ON DELETE CASCADE,
    id_turma INT REFERENCES turma(id_turma) ON DELETE CASCADE
);

-- =========================
-- 8) AVALIAÇÕES, NOTAS E FALTAS
-- =========================

-- NOTA: Avaliações de alunos
CREATE TABLE IF NOT EXISTS nota (
    id_nota SERIAL PRIMARY KEY,
    id_aluno INT REFERENCES aluno(id_aluno) ON DELETE CASCADE,
    id_disciplina INT REFERENCES disciplina(id_disciplina) ON DELETE CASCADE,
    id_professor INT REFERENCES funcionario(id_funcionario) ON DELETE SET NULL,
    id_turma INT REFERENCES turma(id_turma) ON DELETE CASCADE,
    tipo_avaliacao tipo_avaliacao_type,
    valor NUMERIC(5,2),                               -- Nota obtida
    data_lancamento TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- FALTA_ALUNO: Registro de faltas
CREATE TABLE IF NOT EXISTS falta_aluno (
    id_falta SERIAL PRIMARY KEY,
    id_aluno INT REFERENCES aluno(id_aluno) ON DELETE CASCADE,
    id_disciplina INT REFERENCES disciplina(id_disciplina) ON DELETE SET NULL,
    id_turma INT REFERENCES turma(id_turma) ON DELETE CASCADE,
    data_falta DATE NOT NULL,
    justificada BOOLEAN DEFAULT FALSE,
    observacao TEXT
);

-- =========================
-- 9) FINANCEIRO: Faturas e Pagamentos
-- =========================

-- FATURA: Cobrança aos alunos
CREATE TABLE IF NOT EXISTS fatura (
    id_fatura SERIAL PRIMARY KEY,
    id_aluno INT REFERENCES aluno(id_aluno) ON DELETE SET NULL,
    descricao VARCHAR(255),                           -- Ex: Mensalidade, Material
    total NUMERIC(12,2) NOT NULL,
    status fatura_status_type DEFAULT 'pendente',
    data_vencimento DATE,
    data_pagamento DATE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PAGAMENTO: Registro de pagamentos
CREATE TABLE IF NOT EXISTS pagamento (
    id_pagamento SERIAL PRIMARY KEY,
    id_fatura INT REFERENCES fatura(id_fatura) ON DELETE CASCADE,
    valor_pago NUMERIC(12,2) NOT NULL,
    metodo_pagamento VARCHAR(80),                     -- Ex: Dinheiro, Transferência
    comprovante_path TEXT,                            -- Path do comprovante digital
    id_recebedor INT REFERENCES funcionario(id_funcionario) ON DELETE SET NULL, -- Funcionário que recebeu
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 10) MATRÍCULAS E INSCRIÇÕES
-- =========================

-- INSCRIÇÃO: Pré-matrícula
CREATE TABLE IF NOT EXISTS inscricao (
    id_inscricao SERIAL PRIMARY KEY,
    data_inscricao DATE DEFAULT CURRENT_DATE,
    nome_candidato VARCHAR(150),
    documento_candidato JSONB,                        -- Documento em JSON para flexibilidade
    resultado_avaliacao VARCHAR(80)                   -- Resultado preliminar
);

-- MATRÍCULA: Registro definitivo
CREATE TABLE IF NOT EXISTS matricula (
    id_matricula SERIAL PRIMARY KEY,
    id_aluno INT REFERENCES aluno(id_aluno) ON DELETE CASCADE,
    id_turma INT REFERENCES turma(id_turma) ON DELETE SET NULL,
    data_matricula DATE DEFAULT CURRENT_DATE,
    ativo BOOLEAN DEFAULT TRUE
);

-- =========================
-- 11) HISTÓRICO E AUDITORIA
-- =========================

-- HISTÓRICO: Registra ações importantes
CREATE TABLE IF NOT EXISTS historico (
    id_historico SERIAL PRIMARY KEY,
    id_funcionario INT REFERENCES funcionario(id_funcionario) ON DELETE SET NULL,
    id_aluno INT REFERENCES aluno(id_aluno) ON DELETE SET NULL,
    tipo_accao VARCHAR(50),                           -- Descrição da ação
    dados_anteriores JSONB,
    dados_novos JSONB,
    data_hora TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- HISTÓRICO_LOGIN: Auditoria de acessos
CREATE TABLE IF NOT EXISTS historico_login (
    id_historico_login SERIAL PRIMARY KEY,
    id_funcionario INT REFERENCES funcionario(id_funcionario) ON DELETE SET NULL,
    id_aluno INT REFERENCES aluno(id_aluno) ON DELETE SET NULL,
    id_encarregado INT REFERENCES encarregado(id_encarregado) ON DELETE SET NULL,
    ip_usuario INET,
    dispositivo VARCHAR(150),
    navegador VARCHAR(150),
    hora_entrada TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    hora_saida TIMESTAMP WITH TIME ZONE
);

-- =========================
-- 12) TRIGGERS DE AUDITORIA AUTOMÁTICA
-- =========================

-- Função genérica para histórico
CREATE OR REPLACE FUNCTION fn_historico_gerar() RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        INSERT INTO historico (tipo_accao, dados_anteriores, dados_novos, data_hora)
        VALUES (TG_TABLE_NAME || ':' || TG_OP, row_to_json(OLD), row_to_json(NEW), CURRENT_TIMESTAMP);
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO historico (tipo_accao, dados_novos, data_hora)
        VALUES (TG_TABLE_NAME || ':' || TG_OP, row_to_json(NEW), CURRENT_TIMESTAMP);
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO historico (tipo_accao, dados_anteriores, data_hora)
        VALUES (TG_TABLE_NAME || ':' || TG_OP, row_to_json(OLD), CURRENT_TIMESTAMP);
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Adiciona trigger para aluno, funcionário e faturas
DROP TRIGGER IF EXISTS trg_historico_aluno ON aluno;
CREATE TRIGGER trg_historico_aluno
AFTER INSERT OR UPDATE OR DELETE ON aluno
FOR EACH ROW EXECUTE FUNCTION fn_historico_gerar();

DROP TRIGGER IF EXISTS trg_historico_funcionario ON funcionario;
CREATE TRIGGER trg_historico_funcionario
AFTER INSERT OR UPDATE OR DELETE ON funcionario
FOR EACH ROW EXECUTE FUNCTION fn_historico_gerar();

DROP TRIGGER IF EXISTS trg_historico_fatura ON fatura;
CREATE TRIGGER trg_historico_fatura
AFTER INSERT OR UPDATE OR DELETE ON fatura
FOR EACH ROW EXECUTE FUNCTION fn_historico_gerar();

-- =========================
-- 13) VIEWS PARA DASHBOARD
-- =========================

-- Alunos por turma e curso
CREATE OR REPLACE VIEW view_alunos_turma AS
SELECT a.id_aluno,
       a.nome_completo,
       t.codigo_turma AS nome_turma,
       c.nome_curso
FROM aluno a
LEFT JOIN turma t ON a.id_turma = t.id_turma
LEFT JOIN curso c ON t.id_curso = c.id_curso;

-- Notas e médias por aluno
CREATE OR REPLACE VIEW view_notas_aluno AS
SELECT n.id_aluno,
       n.id_turma,
       d.nome AS disciplina,
       n.tipo_avaliacao,
       n.valor,
       AVG(n.valor) OVER (PARTITION BY n.id_aluno, n.id_turma) AS media_turma
FROM nota n
JOIN disciplina d ON n.id_disciplina = d.id_disciplina;

-- =========================
-- FIM DO SCRIPT - SISTEMA ESCOLAR COMPLETO
-- =========================
