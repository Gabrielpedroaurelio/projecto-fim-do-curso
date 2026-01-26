 pagamento por multicaixa expresse nao vai ser removido do frontend apenas ainda nao vamos mexer na logica no backend, olha os status dos pagamentos nao serao actualizados pelos usuario(funcionario que podem ser secretario ou direitor) isso cria incossitencia e podem quere realizar fraude, alterando o status, vamos no basear em verificar o aluno por numero de bi (bilhete de identidade ) de numero de matricula, agora, no models aluno vais adicionar os campos: ALUNO: 
1.	Adicionar os campos nome_pai,nome_mae, data_nascimento,naturalidade,provincia_naturalidade,data_emissao_bilhete(neste campo vai ser opçional mas o usuario aluno ou encarregado responsavel pelo aluno pode colocar esse data, se no momento da solicitação este campo estivel vazio deve pedir para preencher o campo), este é o plano de implemetacao que me passaste: Plano de Implementação: Sistema de Gestão de Declarações
IMPORTANT

Prazo: 15 de Fevereiro de 2026. Foco: Gestão de Declarações Escolares com Pagamento Manual (RUP gerado internamente).

1. Backend: Lógica e Dados
1.1 Atualizar Modelos (models.py)
SolicitacaoDocumento:
Adicionar campo 
rupe
 (CharField, pode ser o IBAN ou referência gerada).
Adicionar campo valor_rupe (DecimalField, armazenar o valor exato no momento da solicitação).
Adicionar campo classe_solicitada (ForeignKey para Classe, obrigatório para validação).
Remover dependência forte de integração bancária real (focar em fluxo manual).
1.2 Regras de Negócio e Validação (
DocumentService
)
Validação de Classe:
Declaração: Máximo permitida = Classe Atual - 1 (ex: aluno da 12ª só pede até 11ª).
Boletim: Permitida Classe Atual ou inferior.
Certificado: Apenas se aprovado na última classe do ciclo (12ª ou 13ª).
Geração de RUP:
Criar lógica simples para gerar número de RUP (ex: TIMESTAMP-ID-ALUNO).
Gerar PDF de "Nota de Pagamento" (RUP) com dados bancários da escola.
Assinatura e Validação:
Gerar "Código de Validação" alfanumérico único.
No momento da geração do PDF final (status pago), inserir imagem da assinatura do Diretor e Carimbo da Escola.
2. Frontend: Fluxo do Aluno
2.1 Atualizar 
AskStudent.jsx
Substituir Formulário Antigo: Integrar componente 
SolicitacaoFlow
.
Remover Pedido de BI: Backend/Frontend deve pegar ID do usuário logado automaticamente.
2.2 Componente 
SolicitacaoFlow.jsx
Seleção de Classe: Adicionar dropdown para escolher a classe do documento (filtrado pelas regras de validação).
Modo Leitura: Exibir dados do aluno (Nome, BI, Turma Atual) apenas para conferência.
Correção de Dados: Botão "Dados Incorretos" -> Cancela fluxo e avisa para procurar secretaria (ou editar perfil se permitido).
Pagamento:
Remover opção "Multicaixa Express" (API) por enquanto.
Focar em "Imprimir RUP / Dados para Transferência".
Gerar PDF do RUP imediatamente após confirmação.
3. Frontend: Fluxo Administrativo
3.1 Tabela de Solicitações (
Solicitacao.jsx
)
Botão "Aprovar/Assinar" (Diretor):
Modal com Visualização do Rascunho do PDF.
Botão "Assinar Digitalmente" (Injeta a imagem e muda status).
Botão "Confirmar Pagamento" (Secretaria):
Input para digitar o número do Comprovativo Bancário entregue pelo aluno.
Muda status de suporte para "Pago" -> Dispara geração do PDF assinado se já aprovado.
Visualização de Status: Clareza entre "Pendente de Pagamento", "Pago/Gerando Doc", "Aguardando Assinatura", "Pronto".
4. Templates de Documentos (PDF)
Criar arquivos HTML para o weasyprint (backend) processar:

 rup_comprovativo.html: Dados do aluno, valor, IBAN da escola, Referência RUP.
 declaracao_com_notas.html: Placeholder para lista de disciplinas/notas.
 declaracao_sem_notas.html: Texto padrão confirmando matrícula.
 certificado.html: Layout formal, moldura, placeholders de conclusão.
 boletim.html: Grelha de notas trimestrais.
5. Estimativa de Conclusão Atual
O projeto está aproximadamente em 45-50% da conclusão para o módulo de Declarações.

Frontend: 40% (Falta integrar fluxos).
Backend: 60% (Falta validação fina e templates).
Integração/Testes: 0%.