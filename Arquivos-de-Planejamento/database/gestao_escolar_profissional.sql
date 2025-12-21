-- ===================================================================
-- SCRIPT DE MIGRAÇÃO - EXPANSÃO DO BANCO DE DADOS
-- Sistema de Gestão Académica - Instituto Politécnico do Maiombe
-- ===================================================================
-- Este script EXPANDE o banco existente sem quebrar dados
-- Execução: psql -U postgres -d gestao_escolar -f migracao_expansao.sql
-- ===================================================================
\c gestao_escolar;
-- ===================================================================
-- PARTE 1: SCHEMA DE AUTENTICAÇÃO E PERMISSÕES
-- ===================================================================
-- Criar schema auth
CREATE SCHEMA IF NOT EXISTS auth;
-- Tabela de Roles (papéis do sistema)
CREATE TABLE IF NOT EXISTS auth.roles (
    id_role SERIAL PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Tabela de Permissions (permissões granulares)
CREATE TABLE IF NOT EXISTS auth.permissions (
    id_permission SERIAL PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL,
    descricao TEXT,
    modulo VARCHAR(50), -- ex: 'documentos', 'academico', 'biblioteca'
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Relacionamento Roles <-> Permissions
CREATE TABLE IF NOT EXISTS auth.role_permissions (
    id_role INT REFERENCES auth.roles(id_role) ON DELETE CASCADE,
    id_permission INT REFERENCES auth.permissions(id_permission) ON DELETE CASCADE,
    PRIMARY KEY (id_role, id_permission),
    concedido_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Relacionamento Usuários <-> Roles (genérico para funcionário, aluno, encarregado)
CREATE TABLE IF NOT EXISTS auth.user_roles (
    id_usuario INT NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('funcionario', 'aluno', 'encarregado')),
    id_role INT REFERENCES auth.roles(id_role) ON DELETE CASCADE,
    PRIMARY KEY (id_usuario, tipo_usuario, id_role),
    atribuido_por INT, -- ID do funcionário que atribuiu
    atribuido_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Refresh Tokens para JWT
CREATE TABLE IF NOT EXISTS auth.refresh_tokens (
    id_token SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('funcionario', 'aluno', 'encarregado')),
    token_hash TEXT NOT NULL,
    emitido_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expira_em TIMESTAMP WITH TIME ZONE,
    revogado_em TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    user_agent TEXT
);
-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_roles_usuario ON auth.user_roles(id_usuario, tipo_usuario);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_usuario ON auth.refresh_tokens(id_usuario, tipo_usuario);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expira ON auth.refresh_tokens(expira_em);
-- ===================================================================
-- PARTE 2: EXPANSÃO DO MÓDULO DE DOCUMENTOS
-- ===================================================================
-- Tabela RUPE (Recibo Único de Pagamento Escolar)
CREATE TABLE IF NOT EXISTS rupe (
    id_rupe SERIAL PRIMARY KEY,
    numero_rupe VARCHAR(50) UNIQUE NOT NULL,
    id_solicitacao INT REFERENCES solicitacao_documento(id_solicitacao) ON DELETE CASCADE,
    valor NUMERIC(12,2) NOT NULL,
    data_geracao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_validade TIMESTAMP WITH TIME ZONE,
    utilizado BOOLEAN DEFAULT FALSE,
    data_utilizacao TIMESTAMP WITH TIME ZONE
);
-- Adicionar campos em solicitacao_documento (se não existirem)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='solicitacao_documento' AND column_name='id_rupe') THEN
        ALTER TABLE solicitacao_documento ADD COLUMN id_rupe INT REFERENCES rupe(id_rupe);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='solicitacao_documento' AND column_name='id_aprovador') THEN
        ALTER TABLE solicitacao_documento ADD COLUMN id_aprovador INT REFERENCES funcionario(id_funcionario);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='solicitacao_documento' AND column_name='comentario_aprovacao') THEN
        ALTER TABLE solicitacao_documento ADD COLUMN comentario_aprovacao TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='solicitacao_documento' AND column_name='comentario_rejeicao') THEN
        ALTER TABLE solicitacao_documento ADD COLUMN comentario_rejeicao TEXT;
    END IF;
END $$;
-- Tabela de Aprovações de Documentos (histórico completo)
CREATE TABLE IF NOT EXISTS aprovacao_documento (
    id_aprovacao SERIAL PRIMARY KEY,
    id_solicitacao INT REFERENCES solicitacao_documento(id_solicitacao) ON DELETE CASCADE,
    id_aprovador INT REFERENCES funcionario(id_funcionario),
    acao VARCHAR(20) CHECK (acao IN ('aprovar', 'rejeitar', 'solicitar_revisao')),
    comentario TEXT,
    data_acao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET
);
-- Adicionar campos em pagamento para validação
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pagamento' AND column_name='status_validacao') THEN
        ALTER TABLE pagamento ADD COLUMN status_validacao VARCHAR(30) DEFAULT 'pendente';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pagamento' AND column_name='validado_por') THEN
        ALTER TABLE pagamento ADD COLUMN validado_por INT REFERENCES funcionario(id_funcionario);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pagamento' AND column_name='data_validacao') THEN
        ALTER TABLE pagamento ADD COLUMN data_validacao TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pagamento' AND column_name='observacoes_validacao') THEN
        ALTER TABLE pagamento ADD COLUMN observacoes_validacao TEXT;
    END IF;
END $$;
-- Tabela de Assinaturas Digitais
CREATE TABLE IF NOT EXISTS assinatura_digital (
    id_assinatura SERIAL PRIMARY KEY,
    id_documento INT REFERENCES documento(id_documento) ON DELETE CASCADE,
    id_assinante INT REFERENCES funcionario(id_funcionario),
    assinatura_hash TEXT NOT NULL,
    algoritmo VARCHAR(50) DEFAULT 'SHA256',
    certificado_digital TEXT,
    chave_publica TEXT,
    data_assinatura TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status_verificacao VARCHAR(30) DEFAULT 'pendente',
    relatorio_verificacao JSONB
);
-- Índices
CREATE INDEX IF NOT EXISTS idx_rupe_numero ON rupe(numero_rupe);
CREATE INDEX IF NOT EXISTS idx_rupe_solicitacao ON rupe(id_solicitacao);
CREATE INDEX IF NOT EXISTS idx_aprovacao_solicitacao ON aprovacao_documento(id_solicitacao);
CREATE INDEX IF NOT EXISTS idx_assinatura_documento ON assinatura_digital(id_documento);
-- ===================================================================
-- PARTE 3: EXPANSÃO DO MÓDULO BIBLIOTECA
-- ===================================================================
-- Adicionar campos em livro
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='livro' AND column_name='preco_venda') THEN
        ALTER TABLE livro ADD COLUMN preco_venda NUMERIC(10,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='livro' AND column_name='preco_aluguel') THEN
        ALTER TABLE livro ADD COLUMN preco_aluguel NUMERIC(10,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='livro' AND column_name='quantidade_disponivel') THEN
        ALTER TABLE livro ADD COLUMN quantidade_disponivel INT DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='livro' AND column_name='disponivel_venda') THEN
        ALTER TABLE livro ADD COLUMN disponivel_venda BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='livro' AND column_name='disponivel_emprestimo') THEN
        ALTER TABLE livro ADD COLUMN disponivel_emprestimo BOOLEAN DEFAULT TRUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='livro' AND column_name='acesso_publico') THEN
        ALTER TABLE livro ADD COLUMN acesso_publico BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='livro' AND column_name='visualizacoes') THEN
        ALTER TABLE livro ADD COLUMN visualizacoes INT DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='livro' AND column_name='isbn') THEN
        ALTER TABLE livro ADD COLUMN isbn VARCHAR(20) UNIQUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='livro' AND column_name='autor') THEN
        ALTER TABLE livro ADD COLUMN autor VARCHAR(200);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='livro' AND column_name='ano_publicacao') THEN
        ALTER TABLE livro ADD COLUMN ano_publicacao INT;
    END IF;
END $$;
-- Tabela de Empréstimos
CREATE TABLE IF NOT EXISTS emprestimo_livro (
    id_emprestimo SERIAL PRIMARY KEY,
    id_livro INT REFERENCES livro(id_livro) ON DELETE CASCADE,
    id_aluno INT REFERENCES aluno(id_aluno) ON DELETE CASCADE,
    data_emprestimo TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_devolucao_prevista TIMESTAMP WITH TIME ZONE NOT NULL,
    data_devolucao_real TIMESTAMP WITH TIME ZONE,
    status VARCHAR(30) DEFAULT 'ativo' CHECK (status IN ('ativo', 'devolvido', 'atrasado', 'cancelado')),
    multa NUMERIC(10,2) DEFAULT 0,
    observacoes TEXT
);
-- Tabela de Compras de Livros
CREATE TABLE IF NOT EXISTS compra_livro (
    id_compra SERIAL PRIMARY KEY,
    id_livro INT REFERENCES livro(id_livro) ON DELETE CASCADE,
    id_aluno INT REFERENCES aluno(id_aluno) ON DELETE CASCADE,
    valor_pago NUMERIC(10,2) NOT NULL,
    metodo_pagamento VARCHAR(50),
    data_compra TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    comprovante_path TEXT,
    validado BOOLEAN DEFAULT FALSE,
    validado_por INT REFERENCES funcionario(id_funcionario),
    data_validacao TIMESTAMP WITH TIME ZONE
);
-- Tabela de Artigos Institucionais
CREATE TABLE IF NOT EXISTS artigo_institucional (
    id_artigo SERIAL PRIMARY KEY,
    id_autor INT REFERENCES funcionario(id_funcionario),
    titulo VARCHAR(200) NOT NULL,
    resumo TEXT,
    conteudo TEXT,
    arquivo_path TEXT,
    data_publicacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    visualizacoes INT DEFAULT 0,
    publicado BOOLEAN DEFAULT FALSE
);
-- Índices
CREATE INDEX IF NOT EXISTS idx_emprestimo_aluno ON emprestimo_livro(id_aluno);
CREATE INDEX IF NOT EXISTS idx_emprestimo_status ON emprestimo_livro(status);
CREATE INDEX IF NOT EXISTS idx_compra_aluno ON compra_livro(id_aluno);
-- ===================================================================
-- PARTE 4: SISTEMA DE NOTIFICAÇÕES
-- ===================================================================
CREATE TABLE IF NOT EXISTS notificacao (
    id_notificacao SERIAL PRIMARY KEY,
    id_destinatario INT NOT NULL,
    tipo_destinatario VARCHAR(20) NOT NULL CHECK (tipo_destinatario IN ('aluno', 'funcionario', 'encarregado')),
    titulo VARCHAR(200) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo_notificacao VARCHAR(50), -- 'documento_aprovado', 'pagamento_pendente', 'nota_lancada', etc.
    lida BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_leitura TIMESTAMP WITH TIME ZONE,
    link_acao TEXT, -- URL para ação relacionada
    prioridade VARCHAR(20) DEFAULT 'normal' CHECK (prioridade IN ('baixa', 'normal', 'alta', 'urgente'))
);
CREATE INDEX IF NOT EXISTS idx_notificacao_destinatario ON notificacao(id_destinatario, tipo_destinatario);
CREATE INDEX IF NOT EXISTS idx_notificacao_lida ON notificacao(lida);
CREATE INDEX IF NOT EXISTS idx_notificacao_tipo ON notificacao(tipo_notificacao);
-- ===================================================================
-- PARTE 5: MÓDULO YASMIN (IA)
-- ===================================================================
-- Tabela de Interações com Yasmin
CREATE TABLE IF NOT EXISTS yasmin_interacao (
    id_interacao SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('aluno', 'funcionario', 'encarregado')),
    tipo_interacao VARCHAR(50), -- 'marcacao_presenca', 'chat', 'reconhecimento_facial', 'assistencia'
    dados_entrada JSONB,
    dados_saida JSONB,
    sucesso BOOLEAN,
    tempo_resposta_ms INT,
    data_interacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Tabela de Reconhecimento Facial (Yasmin)
CREATE TABLE IF NOT EXISTS yasmin_reconhecimento_facial (
    id_reconhecimento SERIAL PRIMARY KEY,
    id_aluno INT REFERENCES aluno(id_aluno) ON DELETE CASCADE,
    dados_biometricos_hash TEXT NOT NULL, -- NUNCA armazenar dados brutos
    algoritmo_hash VARCHAR(50) DEFAULT 'SHA256',
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ultimo_uso TIMESTAMP WITH TIME ZONE,
    ativo BOOLEAN DEFAULT TRUE
);
-- Tabela de Marcação de Presença por IA
CREATE TABLE IF NOT EXISTS yasmin_presenca (
    id_presenca SERIAL PRIMARY KEY,
    id_aluno INT REFERENCES aluno(id_aluno) ON DELETE CASCADE,
    id_disciplina INT REFERENCES disciplina(id_disciplina),
    id_turma INT REFERENCES turma(id_turma),
    data_hora TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metodo VARCHAR(30) DEFAULT 'reconhecimento_facial', -- 'reconhecimento_facial', 'manual'
    confianca_percentual NUMERIC(5,2), -- 0-100%
    validado_por INT REFERENCES funcionario(id_funcionario),
    observacoes TEXT
);
CREATE INDEX IF NOT EXISTS idx_yasmin_interacao_usuario ON yasmin_interacao(id_usuario, tipo_usuario);
CREATE INDEX IF NOT EXISTS idx_yasmin_presenca_aluno ON yasmin_presenca(id_aluno);
-- ===================================================================
-- PARTE 6: RELATÓRIOS PROVINCIAIS
-- ===================================================================
CREATE TABLE IF NOT EXISTS relatorio_provincial (
    id_relatorio SERIAL PRIMARY KEY,
    mes INT NOT NULL CHECK (mes BETWEEN 1 AND 12),
    ano INT NOT NULL,
    dados_estatisticos JSONB NOT NULL,
    arquivo_path TEXT,
    gerado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    gerado_por INT REFERENCES funcionario(id_funcionario),
    enviado BOOLEAN DEFAULT FALSE,
    data_envio TIMESTAMP WITH TIME ZONE,
    destinatario_email VARCHAR(254),
    UNIQUE(mes, ano)
);
-- ===================================================================
-- PARTE 7: ÍNDICES ADICIONAIS DE PERFORMANCE
-- ===================================================================
-- Índices em tabelas existentes
CREATE INDEX IF NOT EXISTS idx_aluno_status ON aluno(status_aluno);
CREATE INDEX IF NOT EXISTS idx_aluno_turma ON aluno(id_turma);
CREATE INDEX IF NOT EXISTS idx_aluno_email ON aluno(email);
CREATE INDEX IF NOT EXISTS idx_funcionario_cargo ON funcionario(id_cargo);
CREATE INDEX IF NOT EXISTS idx_funcionario_email ON funcionario(email);
CREATE INDEX IF NOT EXISTS idx_encarregado_email ON encarregado(email);
CREATE INDEX IF NOT EXISTS idx_solicitacao_status ON solicitacao_documento(status_solicitacao);
CREATE INDEX IF NOT EXISTS idx_solicitacao_aluno ON solicitacao_documento(id_aluno);
CREATE INDEX IF NOT EXISTS idx_fatura_status ON fatura(status);
CREATE INDEX IF NOT EXISTS idx_fatura_aluno ON fatura(id_aluno);
CREATE INDEX IF NOT EXISTS idx_nota_aluno_disciplina ON nota(id_aluno, id_disciplina);
CREATE INDEX IF NOT EXISTS idx_falta_aluno_data ON falta_aluno(id_aluno, data_falta);
CREATE INDEX IF NOT EXISTS idx_historico_data ON historico(data_hora DESC);
CREATE INDEX IF NOT EXISTS idx_documento_aluno ON documento(id_aluno);
CREATE INDEX IF NOT EXISTS idx_documento_uuid ON documento(uuid_documento);
-- ===================================================================
-- PARTE 8: DADOS INICIAIS (SEED)
-- ===================================================================
-- Inserir Roles padrão
INSERT INTO auth.roles (nome, descricao) VALUES
('super_admin', 'Super Administrador - Acesso total ao sistema'),
('administrador', 'Administrador/Diretor - Aprovação de documentos e gestão'),
('secretario', 'Secretário - Gestão de solicitações e validação de pagamentos'),
('professor', 'Professor - Lançamento de notas e faltas'),
('aluno', 'Aluno - Acesso a notas, documentos e biblioteca'),
('encarregado', 'Encarregado - Acompanhamento de educandos')
ON CONFLICT (nome) DO NOTHING;
-- Inserir Permissions padrão
INSERT INTO auth.permissions (nome, descricao, modulo) VALUES
-- Documentos
('documentos.solicitar', 'Solicitar documentos', 'documentos'),
('documentos.aprovar', 'Aprovar solicitações de documentos', 'documentos'),
('documentos.rejeitar', 'Rejeitar solicitações de documentos', 'documentos'),
('documentos.assinar', 'Assinar documentos digitalmente', 'documentos'),
('documentos.visualizar_todos', 'Visualizar todas as solicitações', 'documentos'),
-- Pagamentos
('pagamentos.validar', 'Validar pagamentos', 'financeiro'),
('pagamentos.visualizar_todos', 'Visualizar todos os pagamentos', 'financeiro'),
-- Académico
('notas.lancar', 'Lançar notas', 'academico'),
('notas.visualizar_proprias', 'Visualizar próprias notas', 'academico'),
('notas.visualizar_todas', 'Visualizar todas as notas', 'academico'),
('faltas.registrar', 'Registrar faltas', 'academico'),
('faltas.visualizar_proprias', 'Visualizar próprias faltas', 'academico'),
-- Biblioteca
('biblioteca.emprestar', 'Emprestar livros', 'biblioteca'),
('biblioteca.comprar', 'Comprar livros', 'biblioteca'),
('biblioteca.gerenciar', 'Gerenciar catálogo de livros', 'biblioteca'),
-- Usuários
('usuarios.gerenciar', 'Gerenciar usuários', 'sistema'),
('usuarios.visualizar', 'Visualizar usuários', 'sistema'),
-- Relatórios
('relatorios.gerar', 'Gerar relatórios', 'sistema'),
('relatorios.provinciais', 'Gerar relatórios provinciais', 'sistema')
ON CONFLICT (nome) DO NOTHING;
-- Mapear permissões aos roles
INSERT INTO auth.role_permissions (id_role, id_permission)
SELECT r.id_role, p.id_permission 
FROM auth.roles r, auth.permissions p
WHERE r.nome = 'super_admin'
ON CONFLICT DO NOTHING;
INSERT INTO auth.role_permissions (id_role, id_permission)
SELECT r.id_role, p.id_permission 
FROM auth.roles r, auth.permissions p
WHERE r.nome = 'administrador' 
AND p.nome IN ('documentos.aprovar', 'documentos.rejeitar', 'documentos.assinar', 'documentos.visualizar_todos', 
               'pagamentos.visualizar_todos', 'notas.visualizar_todas', 'relatorios.gerar', 'relatorios.provinciais')
ON CONFLICT DO NOTHING;
INSERT INTO auth.role_permissions (id_role, id_permission)
SELECT r.id_role, p.id_permission 
FROM auth.roles r, auth.permissions p
WHERE r.nome = 'secretario' 
AND p.nome IN ('documentos.visualizar_todos', 'pagamentos.validar', 'pagamentos.visualizar_todos', 'biblioteca.gerenciar')
ON CONFLICT DO NOTHING;
INSERT INTO auth.role_permissions (id_role, id_permission)
SELECT r.id_role, p.id_permission 
FROM auth.roles r, auth.permissions p
WHERE r.nome = 'professor' 
AND p.nome IN ('notas.lancar', 'faltas.registrar', 'biblioteca.emprestar', 'documentos.solicitar')
ON CONFLICT DO NOTHING;
INSERT INTO auth.role_permissions (id_role, id_permission)
SELECT r.id_role, p.id_permission 
FROM auth.roles r, auth.permissions p
WHERE r.nome = 'aluno' 
AND p.nome IN ('notas.visualizar_proprias', 'faltas.visualizar_proprias', 'documentos.solicitar', 
               'biblioteca.emprestar', 'biblioteca.comprar')
ON CONFLICT DO NOTHING;
INSERT INTO auth.role_permissions (id_role, id_permission)
SELECT r.id_role, p.id_permission 
FROM auth.roles r, auth.permissions p
WHERE r.nome = 'encarregado' 
AND p.nome IN ('notas.visualizar_proprias', 'faltas.visualizar_proprias', 'documentos.solicitar')
ON CONFLICT DO NOTHING;
-- ===================================================================
-- PARTE 9: VIEWS ADICIONAIS PARA DASHBOARDS
-- ===================================================================
-- Dashboard Administrador
CREATE OR REPLACE VIEW view_dashboard_admin AS
SELECT 
    (SELECT COUNT(*) FROM aluno WHERE status_aluno = 'Activo') AS total_alunos_ativos,
    (SELECT COUNT(*) FROM funcionario WHERE status_funcionario = 'Activo') AS total_funcionarios_ativos,
    (SELECT COUNT(*) FROM solicitacao_documento WHERE status_solicitacao = 'pendente') AS solicitacoes_pendentes,
    (SELECT COUNT(*) FROM fatura WHERE status = 'pendente') AS faturas_pendentes,
    (SELECT COALESCE(SUM(total), 0) FROM fatura WHERE status = 'paga' 
     AND EXTRACT(MONTH FROM data_pagamento) = EXTRACT(MONTH FROM CURRENT_DATE)) AS receita_mes_atual,
    (SELECT COUNT(*) FROM turma) AS total_turmas,
    (SELECT COUNT(*) FROM curso) AS total_cursos;
-- Dashboard Aluno
CREATE OR REPLACE VIEW view_dashboard_aluno AS
SELECT 
    a.id_aluno,
    a.nome_completo,
    t.codigo_turma,
    c.nome_curso,
    COUNT(DISTINCT n.id_disciplina) AS total_disciplinas,
    COALESCE(AVG(n.valor), 0) AS media_geral,
    COUNT(f.id_falta) AS total_faltas,
    (SELECT COUNT(*) FROM solicitacao_documento sd 
     WHERE sd.id_aluno = a.id_aluno AND sd.status_solicitacao = 'pendente') AS documentos_pendentes,
    (SELECT COUNT(*) FROM fatura ft 
     WHERE ft.id_aluno = a.id_aluno AND ft.status = 'pendente') AS faturas_pendentes
FROM aluno a
LEFT JOIN turma t ON a.id_turma = t.id_turma
LEFT JOIN curso c ON t.id_curso = c.id_curso
LEFT JOIN nota n ON a.id_aluno = n.id_aluno
LEFT JOIN falta_aluno f ON a.id_aluno = f.id_aluno
GROUP BY a.id_aluno, a.nome_completo, t.codigo_turma, c.nome_curso;
-- Estatísticas de Biblioteca
CREATE OR REPLACE VIEW view_estatisticas_biblioteca AS
SELECT 
    (SELECT COUNT(*) FROM livro) AS total_livros,
    (SELECT COUNT(*) FROM livro WHERE disponivel_venda = TRUE) AS livros_venda,
    (SELECT COUNT(*) FROM livro WHERE disponivel_emprestimo = TRUE) AS livros_emprestimo,
    (SELECT COUNT(*) FROM emprestimo_livro WHERE status = 'ativo') AS emprestimos_ativos,
    (SELECT COUNT(*) FROM emprestimo_livro WHERE status = 'atrasado') AS emprestimos_atrasados,
    (SELECT COALESCE(SUM(valor_pago), 0) FROM compra_livro 
     WHERE EXTRACT(MONTH FROM data_compra) = EXTRACT(MONTH FROM CURRENT_DATE)) AS vendas_mes_atual;
-- ===================================================================
-- PARTE 10: TRIGGERS ADICIONAIS
-- ===================================================================
-- Trigger para atualizar quantidade de livros ao emprestar
CREATE OR REPLACE FUNCTION fn_atualizar_quantidade_livro()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE livro SET quantidade_disponivel = quantidade_disponivel - 1
        WHERE id_livro = NEW.id_livro AND quantidade_disponivel > 0;
    ELSIF (TG_OP = 'UPDATE' AND NEW.status = 'devolvido' AND OLD.status != 'devolvido') THEN
        UPDATE livro SET quantidade_disponivel = quantidade_disponivel + 1
        WHERE id_livro = NEW.id_livro;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_atualizar_quantidade_livro
AFTER INSERT OR UPDATE ON emprestimo_livro
FOR EACH ROW EXECUTE FUNCTION fn_atualizar_quantidade_livro();
-- Trigger para criar notificação ao aprovar documento
CREATE OR REPLACE FUNCTION fn_notificar_aprovacao_documento()
RETURNS TRIGGER AS $$
DECLARE
    v_id_aluno INT;
    v_tipo_doc VARCHAR(100);
BEGIN
    SELECT id_aluno, tipo_documento INTO v_id_aluno, v_tipo_doc
    FROM solicitacao_documento WHERE id_solicitacao = NEW.id_solicitacao;
    
    IF NEW.acao = 'aprovar' THEN
        INSERT INTO notificacao (id_destinatario, tipo_destinatario, titulo, mensagem, tipo_notificacao, prioridade)
        VALUES (v_id_aluno, 'aluno', 'Documento Aprovado', 
                'Sua solicitação de ' || v_tipo_doc || ' foi aprovada!', 
                'documento_aprovado', 'alta');
    ELSIF NEW.acao = 'rejeitar' THEN
        INSERT INTO notificacao (id_destinatario, tipo_destinatario, titulo, mensagem, tipo_notificacao, prioridade)
        VALUES (v_id_aluno, 'aluno', 'Documento Rejeitado', 
                'Sua solicitação de ' || v_tipo_doc || ' foi rejeitada. Motivo: ' || COALESCE(NEW.comentario, 'Não especificado'), 
                'documento_rejeitado', 'alta');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_notificar_aprovacao_documento
AFTER INSERT ON aprovacao_documento
FOR EACH ROW EXECUTE FUNCTION fn_notificar_aprovacao_documento();
-- ===================================================================
-- FIM DO SCRIPT DE MIGRAÇÃO
-- ===================================================================
-- Mensagem de sucesso
DO $$
BEGIN
    RAISE NOTICE '✅ Migração concluída com sucesso!';
    RAISE NOTICE '📊 Novos módulos adicionados:';
    RAISE NOTICE '   - Sistema de Autenticação e Permissões (auth schema)';
    RAISE NOTICE '   - Fluxo completo de Documentos (RUPE, Aprovações, Assinaturas)';
    RAISE NOTICE '   - Biblioteca expandida (Empréstimos, Compras, Artigos)';
    RAISE NOTICE '   - Sistema de Notificações';
    RAISE NOTICE '   - Módulo Yasmin (IA)';
    RAISE NOTICE '   - Relatórios Provinciais';
    RAISE NOTICE '';
    RAISE NOTICE '🔍 Próximos passos:';
    RAISE NOTICE '   1. Atribuir roles aos usuários existentes';
    RAISE NOTICE '   2. Configurar tipos de documentos';
    RAISE NOTICE '   3. Testar fluxo completo de solicitação';
END $$;