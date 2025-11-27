CREATE DATABASE gestao_escolar WITH OWNER = postgres ENCODING 'utf8' CONNECTION LIMIT -1;
\c gestao_escolar;

CREATE TYPE genero_type AS ENUM('F','M');
CREATE TYPE periodo_type AS ENUM('Manhã','Tarde','Noite');
CREATE TYPE status_aluno_type AS ENUM('Activo','Expulso','Transferido','Suspenso');
CREATE TYPE status_funcionario_type AS ENUM('Activo','Inactivo','Demitido','Banido');
CREATE TYPE tipo_avaliacao_type AS ENUM('Prova do Professor','Prova Trimestral','Avaliação Continua');
CREATE TABLE sala (
    id_sala SERIAL PRIMARY KEY,
    numero_sala SMALLINT,
    capacidade_alunos INT,
    img_path TEXT[],
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE classe (
    id_classe SERIAL PRIMARY KEY,
    classe INT
);

CREATE TABLE cargo (
    id_cargo SERIAL PRIMARY KEY,
    cargo VARCHAR(50)
);

CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nome_categoria VARCHAR(100)
);
CREATE TABLE funcionario (
    id_funcionario SERIAL PRIMARY KEY,
    numero_bi VARCHAR(14),
    codigo_identificacao VARCHAR(50),
    nome_completo VARCHAR(100),
    id_cargo INT REFERENCES cargo(id_cargo),
    genero genero_type,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    provincia_residencia VARCHAR(50),
    municipio_residencia VARCHAR(50),
    bairro_residencia VARCHAR(50),
    senha_hash VARCHAR(255),
    status_funcionario status_funcionario_type,
    descricao TEXT,
    data_adimicao DATE,
    is_online BOOLEAN DEFAULT FALSE,
    img_path TEXT
);
CREATE TABLE departamento (
    id_departamento SERIAL PRIMARY KEY,
    nome_departamento VARCHAR(100),
    id_funcionario INT REFERENCES funcionario(id_funcionario)
);

CREATE TABLE seccao (
    id_seccao SERIAL PRIMARY KEY,
    nome_seccao VARCHAR(100),
    id_departamento INT REFERENCES departamento(id_departamento)
);
CREATE TABLE cargo_funcionario (
    id_cargo_funcionario SERIAL PRIMARY KEY,
    id_cargo INT REFERENCES cargo(id_cargo),
    id_funcionario INT REFERENCES funcionario(id_funcionario)
);
CREATE TABLE area_formacao (
    id_area_formacao SERIAL PRIMARY KEY,
    nome_area VARCHAR(100),
    id_funcionario INT REFERENCES funcionario(id_funcionario),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE curso (
    id_curso SERIAL PRIMARY KEY,
    nome_curso VARCHAR(100),
    id_area_formacao INT NOT NULL REFERENCES area_formacao(id_area_formacao),
    duracao INT,
    id_funcionario INT REFERENCES funcionario(id_funcionario),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE periodo (
    id_periodo SERIAL PRIMARY KEY,
    periodo periodo_type,
    id_funcionario INT REFERENCES funcionario(id_funcionario)
);
CREATE TABLE turma (
    id_turma SERIAL PRIMARY KEY,
    turma VARCHAR(30) UNIQUE NOT NULL,
    id_sala INT REFERENCES sala(id_sala),
    id_curso INT REFERENCES curso(id_curso),
    id_classe INT REFERENCES classe(id_classe),
    id_periodo INT REFERENCES periodo(id_periodo),
    ano INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_funcionario INT REFERENCES funcionario(id_funcionario)
);
CREATE TABLE encarregado (
    id_encarregado SERIAL PRIMARY KEY,
    nome_completo VARCHAR(50),
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(20)[],
    provincia_residencia VARCHAR(50),
    municipio_residencia VARCHAR(50),
    bairro_residencia VARCHAR(50),
    numero_casa VARCHAR(50),
    senha_hash VARCHAR(255),
    img_path TEXT,
    is_online BOOLEAN DEFAULT FALSE
);
CREATE TABLE aluno (
    id_aluno SERIAL PRIMARY KEY,
    numero_bi VARCHAR(14) UNIQUE NOT NULL,
    nome_completo VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    numero_matricula BIGINT UNIQUE,
    telefone VARCHAR(20)[],
    provincia_residencia VARCHAR(50),
    municipio_residencia VARCHAR(50),
    bairro_residencia VARCHAR(50),
    numero_casa VARCHAR(50),
    senha_hash VARCHAR(255),
    genero genero_type,
    status_aluno status_aluno_type,
    modo_user VARCHAR(10) DEFAULT 'Inativo',
    id_turma INT REFERENCES turma(id_turma),
    img_path TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_online BOOLEAN DEFAULT FALSE
);
CREATE TABLE aluno_encarregado (
    id_aluno_encarregado SERIAL PRIMARY KEY,
    id_aluno INT REFERENCES aluno(id_aluno),
    id_encarregado INT REFERENCES encarregado(id_encarregado)
);
CREATE TABLE escola (
    id_escola SERIAL PRIMARY KEY,
    nome_escola VARCHAR(200),
    numero_escola BIGINT,
    nivel VARCHAR(50) DEFAULT 'Ensino Médio',
    localizacao JSON,
    logo_path TEXT,
    id_diretor_pedagogico INT REFERENCES funcionario(id_funcionario),
    id_diretor_geral INT REFERENCES funcionario(id_funcionario)
);
CREATE TABLE tipo_disciplina (
    id_tipo_disciplina SERIAL PRIMARY KEY,
    nome_tipo VARCHAR(50),
    sigla VARCHAR(10)
);

CREATE TABLE disciplina (
    id_disciplina SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    id_tipo_disciplina INT REFERENCES tipo_disciplina(id_tipo_disciplina),
    carga_horaria INT,
    id_funcionario INT REFERENCES funcionario(id_funcionario),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE disciplina_curso (
    id_disciplina_curso SERIAL PRIMARY KEY,
    id_curso INT REFERENCES curso(id_curso),
    id_disciplina INT REFERENCES disciplina(id_disciplina)
);
CREATE TABLE professor_disciplina (
    id_professor_disciplina SERIAL PRIMARY KEY,
    id_funcionario INT REFERENCES funcionario(id_funcionario),
    id_disciplina INT REFERENCES disciplina(id_disciplina),
    id_turma INT REFERENCES turma(id_turma)
);
CREATE TABLE nota (
    id_nota SERIAL PRIMARY KEY,
    id_aluno INT REFERENCES aluno(id_aluno),
    id_disciplina INT REFERENCES disciplina(id_disciplina),
    id_professor INT REFERENCES funcionario(id_funcionario),
    id_turma INT REFERENCES turma(id_turma),
    tipo_avaliacao tipo_avaliacao_type,
    valor DECIMAL(4,2),
    data_lancamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE falta_aluno (
    id_falta SERIAL PRIMARY KEY,
    id_aluno INT REFERENCES aluno(id_aluno),
    id_disciplina INT REFERENCES disciplina(id_disciplina),
    id_turma INT REFERENCES turma(id_turma),
    data_falta DATE NOT NULL,
    justificada BOOLEAN DEFAULT FALSE,
    observacao TEXT
);
CREATE TABLE documento (
    id_documento SERIAL PRIMARY KEY,
    tipo_documento VARCHAR(55),
    id_aluno INT REFERENCES aluno(id_aluno),
    data_emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    caminho_arquivo TEXT
);
CREATE TABLE historico (
    id_historico SERIAL PRIMARY KEY,
    id_funcionario INT REFERENCES funcionario(id_funcionario),
    id_aluno INT REFERENCES aluno(id_aluno),
    tipo_accao VARCHAR(20),
    dados_anteriores TEXT,
    dados_novos TEXT,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE historico_login (
    id_historico_login SERIAL PRIMARY KEY,
    id_funcionario INT REFERENCES funcionario(id_funcionario),
    id_aluno INT REFERENCES aluno(id_aluno),
    id_encarregado INT REFERENCES encarregado(id_encarregado),
    ip_usuario inet,
    dispositivo VARCHAR(50),
    navegador VARCHAR(50),
    hora_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hora_saida TIMESTAMP
);
CREATE TABLE livro (
    id_livro SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    editora VARCHAR(100) NOT NULL,
    id_funcionario INT REFERENCES funcionario(id_funcionario),
    caminho_arquivo TEXT,
    id_categoria INT REFERENCES categoria(id_categoria),
    data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE fatura (
    id_fatura SERIAL PRIMARY KEY,
    id_aluno INT REFERENCES aluno(id_aluno),
    descricao VARCHAR(255),
    total DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'pendente',
    data_pagamento DATE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pagamento (
    id_pagamento SERIAL PRIMARY KEY,
    id_fatura INT REFERENCES fatura(id_fatura),
    valor_pago DECIMAL(10,2),
    metodo_pagamento VARCHAR(20),
    comprovante_path TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE solicitacao_documento (
    id_solicitacao SERIAL PRIMARY KEY,
    id_aluno INT REFERENCES aluno(id_aluno),
    id_funcionario INT REFERENCES funcionario(id_funcionario),
    tipo_documento VARCHAR(50),
    status_solicitacao VARCHAR(20) DEFAULT 'pendente',
    caminho_arquivo TEXT,
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_aprovacao TIMESTAMP
);
CREATE TABLE inscricao (
    id_inscricao SERIAL PRIMARY KEY,
    data_inscricao DATE,
    nome_candidato VARCHAR(100)
);
