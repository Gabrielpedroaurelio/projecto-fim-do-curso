-- Esquema do Banco de Dados PostgreSQL
-- Gerado manualmente a partir da análise dos Models Django
-- Projeto: Gestão Escolar

-- -----------------------------------------------------
-- Tabelas de Suporte e Básicas
-- -----------------------------------------------------

CREATE TABLE cargo (
    id_cargo SERIAL PRIMARY KEY,
    nome_cargo VARCHAR(100) UNIQUE NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sala (
    id_sala SERIAL PRIMARY KEY,
    numero_sala SMALLINT NOT NULL,
    capacidade_alunos INTEGER NOT NULL,
    --img_path VARCHAR(255),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE classe (
    id_classe SERIAL PRIMARY KEY,
    nivel SMALLINT NOT NULL,
    descricao VARCHAR(80)
);

CREATE TABLE periodo (
    id_periodo SERIAL PRIMARY KEY,
    periodo VARCHAR(10) UNIQUE NOT NULL,
    id_responsavel INTEGER -- FK preenchida depois
);

CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nome_categoria VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE tipo_disciplina (
    id_tipo_disciplina SERIAL PRIMARY KEY,
    nome_tipo VARCHAR(80) NOT NULL,
    sigla VARCHAR(20)
);

-- -----------------------------------------------------
-- Tabelas de Usuários
-- -----------------------------------------------------

CREATE TABLE funcionario (
    id_funcionario SERIAL PRIMARY KEY,
    numero_bi VARCHAR(20) UNIQUE,
    codigo_identificacao VARCHAR(50) UNIQUE NOT NULL,
    nome_completo VARCHAR(150) NOT NULL,
    id_cargo INTEGER REFERENCES cargo(id_cargo) ON DELETE SET NULL,
    genero VARCHAR(1),
    email VARCHAR(150) UNIQUE,
    telefone VARCHAR(30),
    provincia_residencia VARCHAR(100),
    municipio_residencia VARCHAR(100),
    bairro_residencia VARCHAR(100),
    senha_hash VARCHAR(255) NOT NULL,
    status_funcionario VARCHAR(20) DEFAULT 'Activo',
    descricao TEXT,
    data_admissao DATE,
    is_online BOOLEAN DEFAULT FALSE,
    img_path VARCHAR(255),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_funcionario_email ON funcionario(email);
CREATE INDEX idx_funcionario_cargo ON funcionario(id_cargo);

ALTER TABLE periodo ADD CONSTRAINT fk_periodo_responsavel FOREIGN KEY (id_responsavel) REFERENCES funcionario(id_funcionario) ON DELETE SET NULL;

CREATE TABLE encarregado (
    id_encarregado SERIAL PRIMARY KEY,
    nome_completo VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    telefone VARCHAR(30) NOT NULL,
    provincia_residencia VARCHAR(100),
    municipio_residencia VARCHAR(100),
    bairro_residencia VARCHAR(100),
    numero_casa VARCHAR(100),
    senha_hash VARCHAR(255) NOT NULL,
    img_path VARCHAR(255),
    is_online BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_encarregado_email ON encarregado(email);

CREATE TABLE cargo_funcionario (
    id_cargo_funcionario SERIAL PRIMARY KEY,
    id_cargo INTEGER REFERENCES cargo(id_cargo) ON DELETE CASCADE,
    id_funcionario INTEGER REFERENCES funcionario(id_funcionario) ON DELETE CASCADE,
    data_inicio DATE,
    data_fim DATE
);

-- -----------------------------------------------------
-- Estrutura Acadêmica
-- -----------------------------------------------------

CREATE TABLE departamento (
    id_departamento SERIAL PRIMARY KEY,
    nome_departamento VARCHAR(150) NOT NULL,
    chefe_id_funcionario INTEGER REFERENCES funcionario(id_funcionario) ON DELETE SET NULL
);

CREATE TABLE seccao (
    id_seccao SERIAL PRIMARY KEY,
    nome_seccao VARCHAR(150) NOT NULL,
    id_departamento INTEGER REFERENCES departamento(id_departamento) ON DELETE SET NULL
);

CREATE TABLE area_formacao (
    id_area_formacao SERIAL PRIMARY KEY,
    nome_area VARCHAR(150) NOT NULL,
    id_responsavel INTEGER REFERENCES funcionario(id_funcionario) ON DELETE SET NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE curso (
    id_curso SERIAL PRIMARY KEY,
    nome_curso VARCHAR(150) NOT NULL,
    id_area_formacao INTEGER REFERENCES area_formacao(id_area_formacao) ON DELETE SET NULL,
    duracao INTEGER DEFAULT 4,
    id_responsavel INTEGER REFERENCES funcionario(id_funcionario) ON DELETE SET NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE matriz_curricular (
    id_matriz_curricular SERIAL PRIMARY KEY,
    id_curso INTEGER REFERENCES curso(id_curso) ON DELETE CASCADE,
    id_classe INTEGER REFERENCES classe(id_classe) ON DELETE CASCADE,
    descricao VARCHAR(150),
    ano_letivo VARCHAR(20),
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_curso, id_classe, ano_letivo)
);

CREATE TABLE disciplina (
    id_disciplina SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    id_tipo_disciplina INTEGER REFERENCES tipo_disciplina(id_tipo_disciplina) ON DELETE SET NULL,
    carga_horaria INTEGER,
    id_coordenador INTEGER REFERENCES funcionario(id_funcionario) ON DELETE SET NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE matriz_curricular_disciplina (
    id_matriz_disciplina SERIAL PRIMARY KEY,
    id_matriz_curricular INTEGER REFERENCES matriz_curricular(id_matriz_curricular) ON DELETE CASCADE,
    id_disciplina INTEGER REFERENCES disciplina(id_disciplina) ON DELETE CASCADE,
    carga_horaria INTEGER DEFAULT 0,
    coeficiente DECIMAL(4,2) DEFAULT 1.00,
    e_nuclear BOOLEAN DEFAULT TRUE,
    UNIQUE(id_matriz_curricular, id_disciplina)
);

CREATE TABLE turma (
    id_turma SERIAL PRIMARY KEY,
    id_sala INTEGER REFERENCES sala(id_sala) ON DELETE SET NULL,
    id_curso INTEGER REFERENCES curso(id_curso) ON DELETE SET NULL,
    id_classe INTEGER REFERENCES classe(id_classe) ON DELETE SET NULL,
    id_periodo INTEGER REFERENCES periodo(id_periodo) ON DELETE SET NULL,
    id_matriz_curricular INTEGER REFERENCES matriz_curricular(id_matriz_curricular) ON DELETE SET NULL,
    ano VARCHAR(4),
    codigo_turma VARCHAR(50) UNIQUE,
    id_responsavel INTEGER REFERENCES funcionario(id_funcionario) ON DELETE SET NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE horario (
    id_horario SERIAL PRIMARY KEY,
    id_turma INTEGER REFERENCES turma(id_turma) ON DELETE CASCADE,
    id_disciplina INTEGER REFERENCES disciplina(id_disciplina) ON DELETE CASCADE,
    id_professor INTEGER REFERENCES funcionario(id_funcionario) ON DELETE SET NULL,
    dia_semana VARCHAR(20) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Alunos e Matrículas
-- -----------------------------------------------------

CREATE TABLE aluno (
    id_aluno SERIAL PRIMARY KEY,
    numero_bi VARCHAR(14) UNIQUE,
    nome_completo VARCHAR(150) NOT NULL,
    email VARCHAR(250) UNIQUE,
    numero_matricula VARCHAR(50) UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    provincia_residencia VARCHAR(100),
    municipio_residencia VARCHAR(100),
    bairro_residencia VARCHAR(100),
    numero_casa VARCHAR(100),
    nome_pai VARCHAR(150),
    nome_mae VARCHAR(150),
    data_nascimento DATE,
    naturalidade VARCHAR(100),
    provincia_naturalidade VARCHAR(100),
    data_emissao_bilhete DATE,
    senha_hash VARCHAR(255),
    genero VARCHAR(1) DEFAULT 'F',
    status_aluno VARCHAR(20) DEFAULT 'Activo',
    modo_user VARCHAR(20) DEFAULT 'Inativo',
    id_turma INTEGER REFERENCES turma(id_turma) ON DELETE SET NULL,
    img_path VARCHAR(255),
    is_online BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_aluno_status ON aluno(status_aluno);
CREATE INDEX idx_aluno_turma ON aluno(id_turma);
CREATE INDEX idx_aluno_email ON aluno(email);

CREATE TABLE aluno_encarregado (
    id_aluno_encarregado SERIAL PRIMARY KEY,
    id_aluno INTEGER REFERENCES aluno(id_aluno) ON DELETE CASCADE,
    id_encarregado INTEGER REFERENCES encarregado(id_encarregado) ON DELETE CASCADE,
    grau_parentesco VARCHAR(80),
    UNIQUE(id_aluno, id_encarregado)
);

CREATE TABLE inscricao (
    id_inscricao SERIAL PRIMARY KEY,
    data_inscricao DATE DEFAULT CURRENT_DATE,
    nome_candidato VARCHAR(150),
    documento_candidato JSONB,
    resultado_avaliacao VARCHAR(80)
);

CREATE TABLE matricula (
    id_matricula SERIAL PRIMARY KEY,
    id_aluno INTEGER REFERENCES aluno(id_aluno) ON DELETE CASCADE,
    id_turma INTEGER REFERENCES turma(id_turma) ON DELETE SET NULL,
    data_matricula DATE DEFAULT CURRENT_DATE,
    ativo BOOLEAN DEFAULT TRUE
);

-- -----------------------------------------------------
-- Avaliações e Faltas
-- -----------------------------------------------------

CREATE TABLE professor_disciplina (
    id_professor_disciplina SERIAL PRIMARY KEY,
    id_funcionario INTEGER REFERENCES funcionario(id_funcionario) ON DELETE CASCADE,
    id_disciplina INTEGER REFERENCES disciplina(id_disciplina) ON DELETE CASCADE,
    id_turma INTEGER REFERENCES turma(id_turma) ON DELETE CASCADE,
    UNIQUE(id_funcionario, id_disciplina, id_turma)
);

CREATE TABLE nota (
    id_nota SERIAL PRIMARY KEY,
    id_aluno INTEGER REFERENCES aluno(id_aluno) ON DELETE CASCADE,
    id_disciplina INTEGER REFERENCES disciplina(id_disciplina) ON DELETE CASCADE,
    id_professor INTEGER REFERENCES funcionario(id_funcionario) ON DELETE SET NULL,
    id_turma INTEGER REFERENCES turma(id_turma) ON DELETE CASCADE,
    tipo_avaliacao VARCHAR(30),
    tipo_nota VARCHAR(20),
    trimestre VARCHAR(20),
    valor DECIMAL(5,2) CHECK (valor >= 0 AND valor <= 20),
    data_lancamento TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_nota_aluno_disciplina ON nota(id_aluno, id_disciplina);

CREATE TABLE falta_aluno (
    id_falta SERIAL PRIMARY KEY,
    id_aluno INTEGER REFERENCES aluno(id_aluno) ON DELETE CASCADE,
    id_disciplina INTEGER REFERENCES disciplina(id_disciplina) ON DELETE SET NULL,
    id_turma INTEGER REFERENCES turma(id_turma) ON DELETE CASCADE,
    data_falta DATE NOT NULL,
    justificada BOOLEAN DEFAULT FALSE,
    observacao TEXT
);

CREATE INDEX idx_falta_aluno_data ON falta_aluno(id_aluno, data_falta);

-- -----------------------------------------------------
-- Financeiro
-- -----------------------------------------------------

CREATE TABLE fatura (
    id_fatura SERIAL PRIMARY KEY,
    id_aluno INTEGER REFERENCES aluno(id_aluno) ON DELETE SET NULL,
    descricao VARCHAR(255) NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente',
    data_vencimento DATE,
    data_pagamento DATE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fatura_status ON fatura(status);
CREATE INDEX idx_fatura_aluno ON fatura(id_aluno);

CREATE TABLE pagamento (
    id_pagamento SERIAL PRIMARY KEY,
    id_fatura INTEGER REFERENCES fatura(id_fatura) ON DELETE CASCADE,
    valor_pago DECIMAL(12,2) NOT NULL,
    metodo_pagamento VARCHAR(80),
    comprovante_path VARCHAR(255),
    id_recebedor INTEGER REFERENCES funcionario(id_funcionario) ON DELETE SET NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Biblioteca
-- -----------------------------------------------------

CREATE TABLE livro (
    id_livro SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    editora VARCHAR(150),
    id_responsavel INTEGER REFERENCES funcionario(id_funcionario) ON DELETE SET NULL,
    caminho_arquivo VARCHAR(255) NOT NULL,
    id_categoria INTEGER REFERENCES categoria(id_categoria) ON DELETE SET NULL,
    data_upload TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    img_path VARCHAR(255),
    recomendado BOOLEAN DEFAULT FALSE
);

-- -----------------------------------------------------
-- Documentos e Solicitações
-- -----------------------------------------------------

CREATE TABLE historico_turma_aluno (
    id_historico SERIAL PRIMARY KEY,
    id_aluno INTEGER REFERENCES aluno(id_aluno) ON DELETE CASCADE,
    id_turma INTEGER REFERENCES turma(id_turma) ON DELETE CASCADE,
    id_classe INTEGER REFERENCES classe(id_classe) ON DELETE CASCADE,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    ativo BOOLEAN DEFAULT TRUE,
    ano_letivo VARCHAR(9) DEFAULT '2024',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hta_aluno ON historico_turma_aluno(id_aluno);
CREATE INDEX idx_hta_aluno_ativo ON historico_turma_aluno(id_aluno, ativo);
CREATE INDEX idx_hta_classe ON historico_turma_aluno(id_classe);

CREATE TABLE documento (
    id_documento SERIAL PRIMARY KEY,
    id_aluno INTEGER REFERENCES aluno(id_aluno) ON DELETE SET NULL,
    tipo_documento VARCHAR(100) NOT NULL,
    caminho_pdf VARCHAR(255),
    uuid_documento UUID UNIQUE DEFAULT gen_random_uuid(),
    criado_por INTEGER REFERENCES funcionario(id_funcionario) ON DELETE SET NULL,
    data_emissao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documento_aluno ON documento(id_aluno);
CREATE INDEX idx_documento_uuid ON documento(uuid_documento);

CREATE TABLE solicitacao_documento (
    id_solicitacao SERIAL PRIMARY KEY,
    id_aluno INTEGER REFERENCES aluno(id_aluno) ON DELETE SET NULL,
    id_encarregado INTEGER REFERENCES encarregado(id_encarregado) ON DELETE SET NULL,
    id_funcionario INTEGER REFERENCES funcionario(id_funcionario) ON DELETE SET NULL,
    tipo_documento VARCHAR(100) NOT NULL,
    status_solicitacao VARCHAR(30) DEFAULT 'pendente',
    rupe VARCHAR(100) UNIQUE,
    valor_rupe DECIMAL(12,2),
    classe_solicitada INTEGER REFERENCES classe(id_classe) ON DELETE SET NULL,
    canal_pagamento_rup VARCHAR(20),
    data_expiracao_rup TIMESTAMP WITH TIME ZONE,
    caminho_arquivo VARCHAR(255),
    uuid_documento UUID,
    data_solicitacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_aprovacao TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_solicitacao_status ON solicitacao_documento(status_solicitacao);
CREATE INDEX idx_solicitacao_aluno ON solicitacao_documento(id_aluno);
CREATE INDEX idx_solicitacao_data ON solicitacao_documento(data_solicitacao);

-- -----------------------------------------------------
-- Auditoria e Sistema
-- -----------------------------------------------------

CREATE TABLE notificacao (
    id_notificacao SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo VARCHAR(10) DEFAULT 'info',
    lida BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    id_funcionario INTEGER REFERENCES funcionario(id_funcionario) ON DELETE CASCADE,
    id_aluno INTEGER REFERENCES aluno(id_aluno) ON DELETE CASCADE,
    id_encarregado INTEGER REFERENCES encarregado(id_encarregado) ON DELETE CASCADE
);

CREATE TABLE configuracao_sistema (
    id SERIAL PRIMARY KEY,
    nome_instituicao VARCHAR(200) NOT NULL,
    nif VARCHAR(50),
    endereco VARCHAR(255),
    telefone VARCHAR(50),
    email_oficial VARCHAR(150), -- Na models estava EmailField(150) omitido as vezes
    logo VARCHAR(255),
    backup_automatico BOOLEAN DEFAULT TRUE,
    frequencia_backup VARCHAR(50) DEFAULT 'diario',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE historico (
    id_historico SERIAL PRIMARY KEY,
    id_funcionario INTEGER REFERENCES funcionario(id_funcionario) ON DELETE SET NULL,
    id_aluno INTEGER REFERENCES aluno(id_aluno) ON DELETE SET NULL,
    tipo_accao VARCHAR(50) NOT NULL,
    dados_anteriores JSONB,
    dados_novos JSONB,
    data_hora TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_historico_data ON historico(data_hora);

CREATE TABLE historico_login (
    id_historico_login SERIAL PRIMARY KEY,
    id_funcionario INTEGER REFERENCES funcionario(id_funcionario) ON DELETE SET NULL,
    id_aluno INTEGER REFERENCES aluno(id_aluno) ON DELETE SET NULL,
    id_encarregado INTEGER REFERENCES encarregado(id_encarregado) ON DELETE SET NULL,
    ip_usuario INET,
    dispositivo VARCHAR(150),
    navegador VARCHAR(150),
    hora_entrada TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    hora_saida TIMESTAMP WITH TIME ZONE
);
