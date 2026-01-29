Calendário de Execução de 10 Dias: Backend & Gestão (Foco Django Admin)
Regras Estritas:

Foco no Backend: Não alterar a pasta frontend por enquanto.
Sempre Planejar: Apresentar plano antes de codar.
Escopo Financeiro: Simplificado para validar emissão de documentos.
Dia 1: Configuração e Permissões no Django Admin
Objetivo: Preparar o Admin para Diretores e Professores.

 Grupos de Usuário: Configurar grupos Diretores (Superuser) e Professores.
 Permissões de Professor: Restringir acesso do Professor no Admin para ver apenas Notas e Faltas.
 Permissões de Secretaria: Criar usuário de API para a Secretaria (apenas leitura/solicitação).
 Cadastro Manual: Iniciar cadastro manual de dados base (Diretores, Professores) no Admin.
Dia 2: Estrutura Acadêmica (Via Django Admin)
Objetivo: Diretor configura a escola no Django Admin.

 Infraestrutura e Cursos: Cadastrar Salas, Departamentos, Cursos e Disciplinas.
 Classes e Matrizes: Configurar 
Classe
 e 
MatrizCurricular
 (quais disciplinas em cada classe).
 Configuração de Turmas: Criar Turmas e definir o Ano Letivo.
Dia 3: Cadastro de Alunos e Matrículas (Via Django Admin)
Objetivo: Popular o banco de dados.

 Importação/Cadastro: Cadastrar Alunos e Encarregados diretamente no Admin.
 Matrícula: Vincular Alunos às Turmas (
Matricula
).
 Validação: Garantir integridade dos dados para uso futuro.
Dia 4: Alocação de Professores e Restrições (Backend)
Objetivo: Garantir que professores só mexam no que é deles.

 Vínculo Professor-Disciplina: Usar 
ProfessorDisciplina
 para ligar o professor à turma.
 Customização do Admin (Professor): Alterar o admin.py para que, ao logar, o professor só veja as turmas/disciplinas onde ele está alocado.
 Filtros de Queryset: Garantir que o get_queryset no Admin filtre pelos vínculos do usuário logado.
Dia 5: Lançamento de Notas e Faltas (Django Admin)
Objetivo: Professores lançam notas no Admin.

 Inline de Notas: Melhorar a interface do Admin (TabularInline ou similar) para lançar notas de vários alunos de uma vez.
 Validação de Notas: Implementar clean() nos Models/Forms para impedir notas fora do intervalo (0-20) ou fora da data permitida.
 Faltas: Interface no Admin para lançamento de faltas por dia/aula.
Dia 6: Dashboard Analítico (Backend API)
Objetivo: Criar endpoints para gráficos estatísticos.

 Arquivo dashboard.py: Implementar lógica para agregar dados.
 Gráficos: Criar endpoints que retornem dados para:
Gráfico de Barras: Médias por turma/disciplina.
Gráfico de Linha: Evolução de notas ao longo dos trimestres.
Gráfico de Colunas: Comparativos (ex: Aprovados vs Reprovados).
 Serializers: Expor esses dados para consumo futuro.
Dia 7: Backend da Secretaria (Gestão de Solicitações)
Objetivo: API para Secretaria gerenciar pedidos.

 Endpoints de Solicitação: Listar e atualizar status de 
SolicitacaoDocumento
.
 Lógica de Status: Implementar transições de estado (Pendente -> Em Processamento -> Pronto).
Dia 8: Backend para Aluno e Encarregado
Objetivo: APIs de consulta.

 Endpoints de Notas: API para retornar boletim ou pauta trimestral.
 Endpoints de Documentos: API para solicitar declarações.
 Endpoints de Faltas: API para consultar histórico de ausências.
Dia 9: Geração de Documentos com Validação de Pagamento
Objetivo: Gerar PDFs apenas se autorizado.

 Lógica de Pagamento: Verificar se SolicitacaoDocumento.status == 'pago' (mesmo que o pagamento seja marcado manualmente no Admin).
 Bloqueio: Se status != 'pago', impedir geração/download do PDF.
 Engine de PDF: Gerar o arquivo (Boletim/Declaração) usando os dados do banco e salvar em caminho_arquivo.
Dia 10: Testes Finais e Validação de Fluxos
Objetivo: Garantir estabilidade do Backend.

 Teste de Permissões: Tentar acessar admin de professor com usuário comum (deve falhar).
 Teste de Documentos: Tentar gerar documento pendente (deve falhar) vs pago (deve gerar).
 Simulação de Carga: Popular banco com dados de exemplo para apresentação.