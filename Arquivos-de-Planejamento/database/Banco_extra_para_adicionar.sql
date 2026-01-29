create table if not exists MatrizCurricular (
    id_matriz_curricular serial primary key,
    id_classe int references class(id_classe) on delete cascade,
    id_curso int references curso(id_curso) on delete cascade,
)
create table MatrizcurricularDisciplina(
    id_matriz_curricular_disciplina serial primary key,
    id_disciplina int references disciplina(id_disciplina),
    id_matriz_curricular int references MatrizCurricular(id_matriz_curricular)
);
alter table turma add column id_matriz_curricular  int references MatrizCurricular(id_matriz_curricular);
create table nota(
    id_nota serial primary key,
    id_aluno int references aluno(id_aluno),
    nota number(3,1) not null,
    data_lancamento TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    tipo_nota enum("MAC", "PP","PT")
    trimestre enum("1º Trimestre","2º Trimestre","3º Trimestre")

)
CREATE TABLE "cargo" (
    "id_cargo" SERIAL PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "nome_cargo" VARCHAR(100) UNIQUE NOT NULL
);
CREATE TABLE "funcionario" (
    "id_funcionario" SERIAL PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "numero_bi" VARCHAR(20) UNIQUE,
    "codigo_identificacao" VARCHAR(50) UNIQUE NOT NULL,
    "nome_completo" VARCHAR(150) NOT NULL,
    "id_cargo_id" INTEGER REFERENCES "cargo" ("id_cargo") ON DELETE SET NULL,
    "genero" VARCHAR(1),
    "email" VARCHAR(150) UNIQUE,
    "telefone" VARCHAR(30),
    "provincia_residencia" VARCHAR(100),
    "municipio_residencia" VARCHAR(100),
    "bairro_residencia" VARCHAR(100),
    "senha_hash" VARCHAR(255) NOT NULL,
    "status_funcionario" VARCHAR(20) DEFAULT 'Activo',
    "descricao" TEXT,
    "data_admissao" DATE,
    "is_online" BOOLEAN DEFAULT FALSE,
    "img_path" VARCHAR(100)
);
CREATE TABLE "encarregado" (
    "id_encarregado" SERIAL PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "nome_completo" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) UNIQUE,
    "telefone" JSONB DEFAULT '[]',
    "provincia_residencia" VARCHAR(100),
    "municipio_residencia" VARCHAR(100),
    "bairro_residencia" VARCHAR(100),
    "numero_casa" VARCHAR(100),
    "senha_hash" VARCHAR(255) NOT NULL,
    "img_path" VARCHAR(100),
    "is_online" BOOLEAN DEFAULT FALSE
);
CREATE TABLE "cargo_funcionario" (
    "id_cargo_funcionario" SERIAL PRIMARY KEY,
    "id_cargo_id" INTEGER NOT NULL REFERENCES "cargo" ("id_cargo") ON DELETE CASCADE,
    "id_funcionario_id" INTEGER NOT NULL REFERENCES "funcionario" ("id_funcionario") ON DELETE CASCADE,
    "data_inicio" DATE,
    "data_fim" DATE
);
-- --------------------------------------------------------
-- ACADEMICO (Estrutura)
-- --------------------------------------------------------
CREATE TABLE "sala" (
    "id_sala" SERIAL PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "numero_sala" SMALLINT NOT NULL,
    "capacidade_alunos" INTEGER NOT NULL,
    "img_path" VARCHAR(100)
);
CREATE TABLE "classe" (
    "id_classe" SERIAL PRIMARY KEY,
    "nivel" SMALLINT NOT NULL,
    "descricao" VARCHAR(80)
);
CREATE TABLE "departamento" (
    "id_departamento" SERIAL PRIMARY KEY,
    "nome_departamento" VARCHAR(150) NOT NULL,
    "chefe_id_funcionario_id" INTEGER REFERENCES "funcionario" ("id_funcionario") ON DELETE SET NULL
);
CREATE TABLE "seccao" (
    "id_seccao" SERIAL PRIMARY KEY,
    "nome_seccao" VARCHAR(150) NOT NULL,
    "id_departamento_id" INTEGER REFERENCES "departamento" ("id_departamento") ON DELETE SET NULL
);
CREATE TABLE "area_formacao" (
    "id_area_formacao" SERIAL PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "nome_area" VARCHAR(150) NOT NULL,
    "id_responsavel_id" INTEGER REFERENCES "funcionario" ("id_funcionario") ON DELETE SET NULL
);
CREATE TABLE "curso" (
    "id_curso" SERIAL PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "nome_curso" VARCHAR(150) NOT NULL,
    "id_area_formacao_id" INTEGER REFERENCES "area_formacao" ("id_area_formacao") ON DELETE SET NULL,
    "duracao" INTEGER DEFAULT 4,
    "id_responsavel_id" INTEGER REFERENCES "funcionario" ("id_funcionario") ON DELETE SET NULL
);
CREATE TABLE "periodo" (
    "id_periodo" SERIAL PRIMARY KEY,
    "periodo" VARCHAR(10) UNIQUE NOT NULL,
    "id_responsavel_id" INTEGER REFERENCES "funcionario" ("id_funcionario") ON DELETE SET NULL
);
CREATE TABLE "matriz_curricular" (
    "id_matriz_curricular" SERIAL PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "id_curso_id" INTEGER NOT NULL REFERENCES "curso" ("id_curso") ON DELETE CASCADE,
    "id_classe_id" INTEGER NOT NULL REFERENCES "classe" ("id_classe") ON DELETE CASCADE,
    "descricao" VARCHAR(150),
    "ano_letivo" VARCHAR(20),
    "ativo" BOOLEAN DEFAULT TRUE,
    UNIQUE ("id_curso_id", "id_classe_id", "ano_letivo")
);
-- (Disciplina e criada aqui para referenciar na matriz)
CREATE TABLE "tipo_disciplina" (
    "id_tipo_disciplina" SERIAL PRIMARY KEY,
    "nome_tipo" VARCHAR(80) NOT NULL,
    "sigla" VARCHAR(20)
);
CREATE TABLE "disciplina" (
    "id_disciplina" SERIAL PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "nome" VARCHAR(150) NOT NULL,
    "id_tipo_disciplina_id" INTEGER REFERENCES "tipo_disciplina" ("id_tipo_disciplina") ON DELETE SET NULL,
    "carga_horaria" INTEGER,
    "id_coordenador_id" INTEGER REFERENCES "funcionario" ("id_funcionario") ON DELETE SET NULL
);
CREATE TABLE "matriz_curricular_disciplina" (
    "id_matriz_disciplina" SERIAL PRIMARY KEY,
    "id_matriz_curricular_id" INTEGER NOT NULL REFERENCES "matriz_curricular" ("id_matriz_curricular") ON DELETE CASCADE,
    "id_disciplina_id" INTEGER NOT NULL REFERENCES "disciplina" ("id_disciplina") ON DELETE CASCADE,
    "carga_horaria" INTEGER DEFAULT 0,
    "coeficiente" DECIMAL(4, 2) DEFAULT 1.00,
    "e_nuclear" BOOLEAN DEFAULT TRUE,
    UNIQUE ("id_matriz_curricular_id", "id_disciplina_id")
);
CREATE TABLE "turma" (
    "id_turma" SERIAL PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "id_sala_id" INTEGER REFERENCES "sala" ("id_sala") ON DELETE SET NULL,
    "id_curso_id" INTEGER REFERENCES "curso" ("id_curso") ON DELETE SET NULL,
    "id_classe_id" INTEGER REFERENCES "classe" ("id_classe") ON DELETE SET NULL,
    "id_periodo_id" INTEGER REFERENCES "periodo" ("id_periodo") ON DELETE SET NULL,
    "id_matriz_curricular_id" INTEGER REFERENCES "matriz_curricular" ("id_matriz_curricular") ON DELETE SET NULL,
    "ano" VARCHAR(4),
    "codigo_turma" VARCHAR(50) UNIQUE,
    "id_responsavel_id" INTEGER REFERENCES "funcionario" ("id_funcionario") ON DELETE SET NULL
);
CREATE TABLE "horario" (
    "id_horario" SERIAL PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "id_turma_id" INTEGER NOT NULL REFERENCES "turma" ("id_turma") ON DELETE CASCADE,
    "id_disciplina_id" INTEGER NOT NULL REFERENCES "disciplina" ("id_disciplina") ON DELETE CASCADE,
    "id_professor_id" INTEGER REFERENCES "funcionario" ("id_funcionario") ON DELETE SET NULL,
    "dia_semana" VARCHAR(20) NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fim" TIME NOT NULL
);
-- --------------------------------------------------------
-- ALUNOS E MATRICULAS
-- --------------------------------------------------------
CREATE TABLE "aluno" (
    "id_aluno" SERIAL PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "numero_bi" VARCHAR(14) UNIQUE,
    "nome_completo" VARCHAR(150) NOT NULL,
    "email" VARCHAR(250) UNIQUE,
    "numero_matricula" BIGINT UNIQUE,
    "telefone" VARCHAR(20) NOT NULL,
    "provincia_residencia" VARCHAR(100),
    "municipio_residencia" VARCHAR(100),
    "bairro_residencia" VARCHAR(100),
    "numero_casa" VARCHAR(100),
    "nome_pai" VARCHAR(150),
    "nome_mae" VARCHAR(150),
    "data_nascimento" DATE,
    "naturalidade" VARCHAR(100),
    "provincia_naturalidade" VARCHAR(100),
    "data_emissao_bilhete" DATE,
    "senha_hash" VARCHAR(255),
    "genero" VARCHAR(1) DEFAULT 'F',
    "status_aluno" VARCHAR(20) DEFAULT 'Activo',
    "modo_user" VARCHAR(20) DEFAULT 'Inativo',
    "id_turma_id" INTEGER REFERENCES "turma" ("id_turma") ON DELETE SET NULL,
    "img_path" VARCHAR(100),
    "is_online" BOOLEAN DEFAULT FALSE
);
CREATE TABLE "aluno_encarregado" (
    "id_aluno_encarregado" SERIAL PRIMARY KEY,
    "id_aluno_id" INTEGER NOT NULL REFERENCES "aluno" ("id_aluno") ON DELETE CASCADE,
    "id_encarregado_id" INTEGER NOT NULL REFERENCES "encarregado" ("id_encarregado") ON DELETE CASCADE,
    "grau_parentesco" VARCHAR(80),
    UNIQUE ("id_aluno_id", "id_encarregado_id")
);
CREATE TABLE "inscricao" (
    "id_inscricao" SERIAL PRIMARY KEY,
    "data_inscricao" DATE DEFAULT CURRENT_DATE,
    "nome_candidato" VARCHAR(150),
    "documento_candidato" JSONB,
    "resultado_avaliacao" VARCHAR(80)
);
CREATE TABLE "matricula" (
    "id_matricula" SERIAL PRIMARY KEY,
    "id_aluno_id" INTEGER NOT NULL REFERENCES "aluno" ("id_aluno") ON DELETE CASCADE,
    "id_turma_id" INTEGER REFERENCES "turma" ("id_turma") ON DELETE SET NULL,
    "data_matricula" DATE DEFAULT CURRENT_DATE,
    "ativo" BOOLEAN DEFAULT TRUE
);
-- --------------------------------------------------------
-- AVALIACOES E DISCIPLINA
-- --------------------------------------------------------
CREATE TABLE "disciplina_curso" (
    "id_disciplina_curso" SERIAL PRIMARY KEY,
    "id_curso_id" INTEGER NOT NULL REFERENCES "curso" ("id_curso") ON DELETE CASCADE,
    "id_disciplina_id" INTEGER NOT NULL REFERENCES "disciplina" ("id_disciplina") ON DELETE CASCADE,
    UNIQUE ("id_curso_id", "id_disciplina_id")
);
CREATE TABLE "professor_disciplina" (
    "id_professor_disciplina" SERIAL PRIMARY KEY,
    "id_funcionario_id" INTEGER NOT NULL REFERENCES "funcionario" ("id_funcionario") ON DELETE CASCADE,
    "id_disciplina_id" INTEGER NOT NULL REFERENCES "disciplina" ("id_disciplina") ON DELETE CASCADE,
    "id_turma_id" INTEGER NOT NULL REFERENCES "turma" ("id_turma") ON DELETE CASCADE,
    UNIQUE ("id_funcionario_id", "id_disciplina_id", "id_turma_id")
);
CREATE TABLE "nota" (
    "id_nota" SERIAL PRIMARY KEY,
    "id_aluno_id" INTEGER NOT NULL REFERENCES "aluno" ("id_aluno") ON DELETE CASCADE,
    "id_disciplina_id" INTEGER REFERENCES "disciplina" ("id_disciplina") ON DELETE CASCADE,
    "id_matriz_disciplina_id" INTEGER REFERENCES "matriz_curricular_disciplina" ("id_matriz_disciplina") ON DELETE SET NULL,
    "id_professor_id" INTEGER REFERENCES "funcionario" ("id_funcionario") ON DELETE SET NULL,
    "id_turma_id" INTEGER NOT NULL REFERENCES "turma" ("id_turma") ON DELETE CASCADE,
    "tipo_avaliacao" VARCHAR(30),
    "tipo_nota" VARCHAR(20),
    "trimestre" VARCHAR(20),
    "valor" DECIMAL(5, 2) NOT NULL,
    "data_lancamento" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "falta_aluno" (
    "id_falta" SERIAL PRIMARY KEY,
    "id_aluno_id" INTEGER NOT NULL REFERENCES "aluno" ("id_aluno") ON DELETE CASCADE,
    "id_disciplina_id" INTEGER REFERENCES "disciplina" ("id_disciplina") ON DELETE SET NULL,
    "id_turma_id" INTEGER NOT NULL REFERENCES "turma" ("id_turma") ON DELETE CASCADE,
    "data_falta" DATE NOT NULL,
    "justificada" BOOLEAN DEFAULT FALSE,
    "observacao" TEXT
);
-- --------------------------------------------------------
-- FINANCEIRO
-- --------------------------------------------------------
CREATE TABLE "fatura" (
    "id_fatura" SERIAL PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "id_aluno_id" INTEGER REFERENCES "aluno" ("id_aluno") ON DELETE SET NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "total" DECIMAL(12, 2) NOT NULL,
    "status" VARCHAR(20) DEFAULT 'pendente',
    "data_vencimento" DATE,
    "data_pagamento" DATE
);
CREATE TABLE "pagamento" (
    "id_pagamento" SERIAL PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "id_fatura_id" INTEGER NOT NULL REFERENCES "fatura" ("id_fatura") ON DELETE CASCADE,
    "valor_pago" DECIMAL(12, 2) NOT NULL,
    "metodo_pagamento" VARCHAR(80),
    "comprovante_path" VARCHAR(100),
    "id_recebedor_id" INTEGER REFERENCES "funcionario" ("id_funcionario") ON DELETE SET NULL
);
-- --------------------------------------------------------
-- DOCUMENTOS E BIBLIOTECA
-- --------------------------------------------------------
CREATE TABLE "documento" (
    "id_documento" SERIAL PRIMARY KEY,
    "id_aluno_id" INTEGER REFERENCES "aluno" ("id_aluno") ON DELETE SET NULL,
    "tipo_documento" VARCHAR(100) NOT NULL,
    "caminho_pdf" VARCHAR(100),
    "uuid_documento" UUID UNIQUE NOT NULL,
    "criado_por_id" INTEGER REFERENCES "funcionario" ("id_funcionario") ON DELETE SET NULL,
    "data_emissao" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "solicitacao_documento" (
    "id_solicitacao" SERIAL PRIMARY KEY,
    "id_aluno_id" INTEGER REFERENCES "aluno" ("id_aluno") ON DELETE SET NULL,
    "id_encarregado_id" INTEGER REFERENCES "encarregado" ("id_encarregado") ON DELETE SET NULL,
    "id_funcionario_id" INTEGER REFERENCES "funcionario" ("id_funcionario") ON DELETE SET NULL,
    "tipo_documento" VARCHAR(100) NOT NULL,
    "status_solicitacao" VARCHAR(30) DEFAULT 'pendente',
    "rupe" VARCHAR(100) UNIQUE,
    "valor_rupe" DECIMAL(12, 2),
    "classe_solicitada_id" INTEGER REFERENCES "classe" ("id_classe") ON DELETE SET NULL,
    "canal_pagamento_rup" VARCHAR(20),
    "data_expiracao_rup" TIMESTAMP WITH TIME ZONE,
    "caminho_arquivo" VARCHAR(100),
    "uuid_documento" UUID,
    "data_solicitacao" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "data_aprovacao" TIMESTAMP WITH TIME ZONE
);
CREATE TABLE "categoria" (
    "id_categoria" SERIAL PRIMARY KEY,
    "nome_categoria" VARCHAR(100) UNIQUE NOT NULL
);
CREATE TABLE "livro" (
    "id_livro" SERIAL PRIMARY KEY,
    "titulo" VARCHAR(200) NOT NULL,
    "editora" VARCHAR(150),
    "id_responsavel_id" INTEGER REFERENCES "funcionario" ("id_funcionario") ON DELETE SET NULL,
    "caminho_arquivo" VARCHAR(100) NOT NULL,
    "id_categoria_id" INTEGER REFERENCES "categoria" ("id_categoria") ON DELETE SET NULL,
    "data_upload" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "img_path" VARCHAR(100),
    "recomendado" BOOLEAN DEFAULT FALSE
);