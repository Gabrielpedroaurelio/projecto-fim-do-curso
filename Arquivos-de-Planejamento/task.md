# DOCUMENTO DE ANÁLISE E MODELAGEM DO SISTEMA

## Sistema de Gestão Académica e Emissão de Documentos

**Instituto Politécnico do Maiombe**

---

## 1. Introdução

Este documento tem como objetivo organizar, normalizar e apresentar de forma profissional a análise e a modelagem do **Sistema de Gestão Académica e Gestão de Declarações**, servindo como base para:

* Levantamento de requisitos
* Modelagem do sistema
* Planejamento técnico
* Comunicação com stakeholders (direção, desenvolvedores, analistas)

O sistema será uma **plataforma web integrada**, com múltiplos tipos de usuários, foco em segurança, automação de processos administrativos e suporte por Inteligência Artificial (Yasmin).

---

## 2. Visão Geral do Sistema

O sistema permitirá:

* Gestão de usuários académicos e administrativos
* Solicitação, pagamento, validação e emissão de documentos oficiais
* Gestão académica básica (notas, faltas, relatórios)
* Biblioteca digital e comercial
* Monitoramento e auditoria de atividades
* Autenticação forte e rastreabilidade

Arquitetura base:

* **Backend**: Django
* **Frontend**: React
* **Base de Dados**: PostgreSQL
* **IA**: Módulo Yasmin

---

## 3. Tipos de Usuários (Normalização)

### 3.1 Super Administrador

**Perfil**: Desenvolvedores do sistema
**Permissões**:

* Acesso total ao sistema
* Gestão de administradores
* Auditoria completa
* Configurações globais

---

### 3.2 Administrador

**Perfil**: Diretores
**Permissões**:

* Aprovação/rejeição de documentos
* Assinatura digital e carimbo institucional
* Visualização de relatórios financeiros e académicos
* Gestão de usuários (exceto super admin)

---

### 3.3 Secretário

**Permissões**:

* Gestão e monitoramento de solicitações
* Geração de relatórios
* Definição de modelos de documentos e provas
* Venda e compra de folhas de provas



### 3.4 Professor

**Permissões**:

* Lançamento de notas e faltas
* Marcação de presença (Yasmin)
* Acesso à biblioteca
* Solicitação de documentos

---

### 3.5 Aluno

**Permissões**:

* Visualização de notas, faltas e histórico
* Solicitação de documentos
* Acesso à biblioteca
* Recebimento de notificações

---

### 3.6 Encarregado

**Permissões**:

* Visualização dos dados dos educandos
* Solicitação de documentos
* Acompanhamento académico

---

## 4. Módulos do Sistema

### 4.1 Módulos do Lado Administrativo

* Dashboard Geral
* Usuários
* Solicitações
* Documentos
* Históricos (imutáveis)
* Relatórios
* Definições
* Yasmin (IA)

---

### 4.2 Módulos do Lado do Cliente (Usuários Autenticados)

* Dashboard
* Perfil
* Biblioteca
* Documentos Solicitados
* Notas e Relatórios
* Notificações
* Yasmin

---

### 4.3 Módulos Públicos

* Página Institucional
* Biblioteca Pública (conteúdo restrito para alunos)
* Painel Informativo do Corpo Estudantil

---

## 5. Fluxo Geral de Autenticação

* Login único
* Verificação por:

  * Email
  * Biometria (FaceID / Fingerprint)
* Autenticação reforçada para transações financeiras

---

## 6. Fluxo de Solicitação de Documentos

### 6.1 Etapas do Processo

1. Usuário autenticado acessa o painel
2. Seleciona a opção **Solicitar Documento**
3. Sistema apresenta os tipos disponíveis
4. Usuário escolhe o documento
  4. O sistema pede para o usuario informar o tipo de documento, escolher a classe e o ano e o sistema vai gerar um formulario com todos os dados do aluno
5. Sistema gera RUPE
6. Pagamento:

   * Online (API bancária)
   * Manual (upload de comprovativo)
7. Sistema valida o pagamento
8. Solicitação enviada ao Diretor
9. Diretor aprova ou rejeita
10. Em caso de aprovação:

    * Assinatura digital
    * Código de verificação
11. Documento disponibilizado ao usuário

---

## 7. Biblioteca Digital

Funcionalidades:

* Compra de livros
* Empréstimos
* Leitura online
* Downloads
* Publicação de artigos institucionais

Objetivo secundário: geração de receita.

---

## 8. Dashboards

Cada perfil terá um dashboard específico:

* Indicadores académicos
* Estatísticas financeiras
* Histórico de atividades
* Alertas e notificações

---

## 9. Segurança e Auditoria

* Autenticação multifator
* Logs imutáveis
* Histórico de login
* Relatórios mensais enviados ao Gabinete Provincial da Educação

---

## 10. Fluxo de Telas (Visão Simplificada)

* Página Pública
  * Home
  * Biblioteca
  * Login

* Login

  * Aluno
  * Encarregado
  * Professor
  * Secretário
  * Administrador

* Painéis Internos

  * Dashboard
  * Perfil
  * Biblioteca
  * Documentos
  * Configurações

* Super Usuário

  * Painel Administrativo Django

---

## 11. Planejamento Frontend (Resumo)

* React + React Router
* Componentização por módulo
* UI rápida com TailwindCSS ou Material UI
* Axios / Fetch para integração
* React Hook Form para formulários

Divisão por abas e rotas internas para otimização de tempo.

---

## 12. Considerações Finais


Este documento fornece uma **visão clara, normalizada e profissional** do sistema, servindo como base sólida para:

* Modelagem UML (casos de uso, classes)
* Desenvolvimento incremental
* Apresentação institucional

O sistema é escalável, seguro e alinhado com práticas modernas de engenharia de software.




## COMO AS SOLICITAÇÕES DE DOCUEMNTOS IRÃO FUNCIONAR
>>Aluno
  *O aluno seleciona o tipo documento*
  *O sistema identifica o bilhete do aluno logado e e busca os dados ( dados que ficaram no formulario), e depois manda o formulario para o aluno confirmar os dados mais relevante: nome, bi, numero de matricula e outros*
  *Apos o aluno confirmar os dados o sistema vai mostrar as opções de pagamentos (usando o expresso, imprimir fomulario com rup mas com o status do pagamento como pentende)*
  *se o aluno selecionar a opção de multicaixa express o pagamento será realizado a partir do app, caso ele selecione a opção de imprimir o formulario, deve finalizar a operação com a mensagem de aviso que o rup expira em 24 horas*
  *O documento pdf e o fisico só estará disponivel apos a confirmação do pagamento do rup, o documento em pdf terá a assinatura digital do direitor, e o fisico será imprimido imediatamente assim que o pagamento for efetuado, e a impressora da instituicao que esta conectado a rede da escola vai imprimir o documento, e uma notificação será enviada para o aluno requisitante de que o seu documento foi impresso mas falta a assinatura do direitor, ao mesmo tempo será enviada uma notificação para o direitor com os dados do documento e um link para baixar ou visualizar o documento em questao, e o direitor deve validar o documento, e assinar, após o direitor assinar o ele deve aprovar a solicitacao do documento , e uma nova solicitacao sera enviada para o aluno dizendo que pode buscar o docuemnto*

>>Encarregado
  *O encarredado deve selecionar o educando  e selectionar o docuemnto desejado e  o sistema  vai pegar o Bilhete e pesquisar os dados do educando selecionado e mostrar dados ( dados que ficaram no formulario), e depois manda o formulario para o encarregado confirmar os dados mais relevante: nome, bi, numero de matricula e outros*
  *Apos o encarregado confirmar os dados o sistema vai mostrar as opções de pagamentos (usando o expresso, imprimir fomulario com rup mas com o status do pagamento como pentende)*
  *se o encarregado selecionar a opção de multicaixa express o pagamento será realizado a partir do app, caso ele selecione a opção de imprimir o formulario, deve finalizar a operação com a mensagem de aviso que o rup expira em 24 horas*
  *O documento pdf e o fisico só estará disponivel apos a confirmação do pagamento do rup, o documento em pdf terá a assinatura digital do direitor, e o fisico será imprimido imediatamente assim que o pagamento for efetuado, e a impressora da instituicao que esta conectado a rede da escola vai imprimir o documento, e uma notificação será enviada para o encarregado requisitante de que o seu documento foi impresso mas falta a assinatura do direitor, ao mesmo tempo será enviada uma notificação para o direitor com os dados do documento e um link para baixar ou visualizar o documento em questao, e o direitor deve validar o documento, e assinar, após o direitor assinar o ele deve aprovar a solicitacao do documento , e uma nova solicitacao sera enviada para o encarregado dizendo que pode buscar o docuemnto*

>>Funcionario
  *O funcionario deve pequisar o aluno pro bilehte de identidade e selctionar o documento desejado, o sistema vai fornecer um rup para o funcionario e imprimir um formulario para o funcionario dar a entidade requisitante para o mesmo realizar o pagamento ou pagar via tpa*
  *O documento pdf e o fisico só estará disponivel apos a confirmação do pagamento do rup, o documento em pdf terá a assinatura digital do direitor, e o fisico será imprimido imediatamente assim que o pagamento for efetuado, e a impressora da instituicao que esta conectado a rede da escola vai imprimir o documento, o funcionario deve levar o documento para o direitor assinar e entregar ao requisitante de emidiado*


