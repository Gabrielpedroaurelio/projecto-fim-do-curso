
CREATE DATABASE gestao_escolar with owner = postgres encoding='utf8' connection limit -1;
\c gestao_escolar;


create type genero_type as enum('F','M');
create type periodo_type as enum('Manhã','Tarde','Noite');
CREATE TABLE sala (
    id_sala SERIAL PRIMARY KEY,
    numero_sala SMALLINT,
   -- localizacao VARCHAR(255),
    capacidade_alunos INT,
    img_path TEXT[],
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE classe (
    id_classe SERIAL PRIMARY KEY,
    classe INT
);


CREATE TABLE area_formacao (
    id_area_formacao SERIAL PRIMARY KEY,
    nome_area VARCHAR(100),
    id_funcionario int references funcionario(id_funcionario),-- responsavel pra o departamento
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE curso (
    id_curso SERIAL PRIMARY KEY,
    nome_curso VARCHAR(100),
    id_area_formacao INT NOT NULL REFERENCES area_formacao(id_area_formacao),
    duracao INT,
    id_funcionario int references funcionario(id_funcionario),-- responsavel pelo curso
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE periodo (
    id_periodo SERIAL PRIMARY KEY,
    periodo periodo_type,
    id_funcionario int references funcionario(id_funcionario),-- responsavel pelo periodo
);


CREATE TABLE turma (
    id_turma SERIAL PRIMARY KEY,
    turma VARCHAR(30) UNIQUE NOT NULL,
    id_sala INT NOT NULL REFERENCES sala(id_sala),
    id_curso INT REFERENCES curso(id_curso),
    id_classe INT NOT NULL REFERENCES classe(id_classe),
    id_periodo INT NOT NULL REFERENCES periodo(id_periodo),
    ano YEAR,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_funcionario int references funcionario(id_funcionario)-- responsavel pra o departamento

);


CREATE TABLE aluno (
    id_aluno SERIAL PRIMARY KEY,
    numero_bi VARCHAR(14) UNIQUE not null,
    nome_completo VARCHAR(100),
    email VARCHAR(100) NULL UNIQUE,
    numero_matricula bigint unique,
    telefone VARCHAR(20)[],
    provincia_residencia VARCHAR(50),
    municipio_residencia VARCHAR(50),
    bairro_residencia VARCHAR(50),
    numero_casa VARCHAR(50),
    senha_hash VARCHAR(255) default null,
    genero genero_type,
    status_aluno  enum('Activo','Expulso','Transferido','Suspenso'),
    modo_user VARCHAR(10) DEFAULT 'Inativo',
    id_turma INT NOT NULL REFERENCES turma(id_turma),
    img_path TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_online BOOLEAN DEFAULT FALSE
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
    img_path TEXT, null
 is_online BOOLEAN DEFAULT FALSE);

CREATE TABLE aluno_encarregado (
    id_aluno_encarregado serial primary key,
    id_aluno INT NOT NULL REFERENCES aluno(id_aluno),
    id_encarregado INT NOT NULL REFERENCES encarregado(id_encarregado),
    
);
 
CREATE TABLE departamento (
    id_departamento SERIAL PRIMARY KEY,
    nome_departamento VARCHAR(100),
    id_funcionario int references funcionario(id_funcionario)-- chefe de departamento
);

 
CREATE TABLE seccao (
    id_seccao SERIAL PRIMARY KEY,
    nome_seccao VARCHAR(100),
    id_departamento INT REFERENCES departamento(id_departamento)
);
 create table cargo(
    id_cargo serial primary key,
    cargo varchar(50),
  --salario money
 );
CREATE TABLE funcionario (
    id_funcionario SERIAL PRIMARY KEY,
    numero_bi varchar(14),
    codigo_identificacao VARCHAR(50),
    nome_completo VARCHAR(50),
    id_cargo int references cargo(id_cargo),
    genero genero_type,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    provincia_residencia VARCHAR(50),
    municipio_residencia VARCHAR(50),
    bairro_residencia VARCHAR(50),
    senha_hash VARCHAR(255),
    status_funcionario enum('Activo','Inactivo','Demitido','Banido')
    descricao TEXT,
    data_adimicao date,
    id_seccao INT REFERENCES secao(id_secao),
     is_online BOOLEAN DEFAULT FALSE
    img_path TEXT
);
create table cargo_funcionario(
    id_cargo_funcionario serial primary key,
    id_cargo int references cargo(id_cargo),
    id_funcionario int references funcionario(id_funcionario)
);

 
CREATE TABLE escola (
    id_escola SERIAL PRIMARY KEY,
    nome_escola VARCHAR(200),
    numero_escola  bigint,
    nivel VARCHAR(50) DEFAULT 'Ensino Médio',
    localizacao json,
    logo_path text null,
    id_diretor_pedagogico INT REFERENCES funcionario(id_funcionario),--id_diretor_pedagogico
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
    carga_horaria int,
    id_funcionario int references  funcionario(id_funcionario),
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
    tipo_avaliacao enum('Prova do Professor','Prova Trimestral','Avaliação Continua'),
    valor DECIMAL(4,2) ,
    data_lancamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE falta_aluno (
    id_falta SERIAL PRIMARY KEY,
    id_aluno INT REFERENCES aluno(id_aluno),
    id_disciplina INT REFERENCES disciplina(id_disciplina),
    id_turma INT REFERENCES turma(id_turma),
    data_falta DATE NOT NULL,
    justificada BOOLEAN DEFAULT FALSE,
    observacao TEXT null
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
    id_aluno INT REFERENCES funcionario(id_funcionario),
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

CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nome_categoria VARCHAR(100)
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
/* able for bu book */
CREATE TABLE fatura (
    id_fatura SERIAL PRIMARY KEY,
    id_aluno INT REFERENCES aluno(id_aluno),
    descricao VARCHAR(255),
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente',
    data_pagamento DATE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE pagamento (
    id_pagamento SERIAL PRIMARY KEY,
    id_fatura INT REFERENCES fatura(id_fatura),
    valor_pago DECIMAL(10,2) NOT NULL,
    metodo_pagamento VARCHAR(20),
    rupe VARCHAR(25),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE solicitacao_documento (
    id_solicitacao SERIAL PRIMARY KEY,
    id_aluno INT REFERENCES aluno(id_aluno),
    --id_encarregado INT REFERENCES encarregado(id_encarregado),
    id_funcionario INT REFERENCES funcionario(id_funcionario),
    tipo_documento VARCHAR(50),
    status_solicitacao VARCHAR(20) DEFAULT 'pendente', -- pendente, aprovado, rejeitado
    caminho_arquivo TEXT,
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_aprovacao TIMESTAMP
);

CREATE TABLE inscricao(
    id_inscricao SERIAL PRIMARY KEY,
    data_inscricao DATE,
    nome_candidato VARCHAR(100),
    
);

CREATE TABLE matricula(
    id_matricula
);

-- ======================================
-- Índices
-- ======================================
CREATE INDEX idx_aluno_email ON aluno(email);
CREATE INDEX idx_aluno_turma ON aluno(id_turma);
CREATE INDEX idx_nota_aluno_disciplina ON nota(id_aluno, id_disciplina);
CREATE INDEX idx_documento_aluno_tipo ON documento(id_aluno, tipo_documento);

-- ======================================
-- Views
-- ======================================
CREATE OR REPLACE VIEW view_alunos_turma AS
SELECT a.id_aluno, a.nome, a.sobrenome, t.nome_turma, c.nome_curso
FROM aluno a
JOIN turma t ON a.id_turma = t.id_turma
LEFT JOIN curso c ON t.id_curso = c.id_curso;

CREATE OR REPLACE VIEW view_notas_aluno AS
SELECT n.id_aluno, n.id_turma, d.nome AS disciplina, n.tipo_avaliacao, n.valor,
       calcular_media_aluno(n.id_aluno, n.id_turma) AS media_turma
FROM nota n
JOIN disciplina d ON n.id_disciplina = d.id_disciplina;

-- ======================================
-- Materialized Views
-- ======================================
CREATE MATERIALIZED VIEW mv_media_alunos AS
SELECT id_aluno, id_turma, calcular_media_aluno(id_aluno, id_turma) AS media
FROM aluno;
