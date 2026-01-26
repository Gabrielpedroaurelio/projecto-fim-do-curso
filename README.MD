# 🎓 Sistema Integrado de Gestão Escolar (SIGE)

![Status do Projeto](https://img.shields.io/badge/Status-Em_Desenvolvimento-blue)
![Versão](https://img.shields.io/badge/Versão-2.0.0-green)
![Licença](https://img.shields.io/badge/Licença-Proprietária-red)

## 📋 Sobre o Projeto

O **Sistema Integrado de Gestão Escolar (SIGE)** é uma solução empresarial robusta e escalável desenvolvida para modernizar e automatizar a administração de instituições de ensino. Focado na eficiência operacional e na experiência do usuário, o sistema unifica processos académicos, financeiros e administrativos numa interface moderna e responsiva.

A plataforma serve múltiplos perfis de usuários — desde administradores e funcionários até professores, alunos e encarregados de educação — garantindo transparência e agilidade na troca de informações.

---

## 🚀 Principais Funcionalidades

### 🏛️ Módulo Administrativo
*   **Gestão de Recursos Humanos**: Cadastro completo de funcionários, atribuição de cargos e controlo de acessos.
*   **Gestão Académica**: Controlo de turmas, matrículas, pautas e histórico escolar.
*   **Fluxo de Documentos Digitais**: Solicitação, pagamento e emissão de documentos oficiais (Declarações, Certificados) com assinatura digital.
*   **Biblioteca Digital**: Gestão de acervo, empréstimos e catálogo online para estudantes.

### 💰 Módulo Financeiro
*   **Gestão de Pagamentos**: Processamento de propinas e emolumentos.
*   **Integração com Multicaixa Express**: Pagamentos automáticos e reconciliação bancária.
*   **Emissão de RUP**: Geração de Referência Única de Pagamento para depósitos e transferências.
*   **Relatórios Financeiros**: Dashboards de receitas e inadimplência.

### 🎓 Portal do Estudante & Encarregado
*   **Acompanhamento em Tempo Real**: Notas, faltas e ocorrências disciplinares.
*   **Secretaria Virtual**: Solicitação de documentos sem necessidade de deslocação física.
*   **Material Didático**: Acesso a recursos da biblioteca e conteúdos de apoio.

### 🤖 Assistente Virtual Inteligente - Yasmin
*   **Suporte 24/7**: Chatbot integrado para tirar dúvidas de alunos e pais.
*   **Automação**: Auxílio na navegação e execução de tarefas dentro do sistema.

---

## 🏗️ Arquitetura e Tecnologias

O sistema foi construído seguindo uma arquitetura moderna de **Microsserviços/Monolito Modular**, separando claramente o Frontend do Backend via API RESTful.

### 🎨 Frontend (Client-Side)
Desenvolvido para oferecer uma experiência de usuário (UX) fluida e "Premium".
*   **Core**: React.js (Component-Based Architecture).
*   **Estilização**: CSS Modules com Design System personalizado (Temas Dark/Light inspirados no Google Gemini).
*   **Gráficos**: Recharts para visualização de dados analíticos.
*   **Comunicação**: Axios para consumo de API.

### ⚙️ Backend (Server-Side)
Robustez e segurança no processamento de dados.
*   **Framework**: Django (Python) & Django REST Framework.
*   **Base de Dados**: PostgreSQL (Relacional).
*   **Autenticação**: JWT (JSON Web Tokens) & Custom Permission Logic.
*   **Segurança**: Hashing de senhas avançado (PBKDF2) e proteção CSRF/CORS.

---

## 📂 Estrutura do Projeto

```bash
gestao-escolar-fim-course/
├── backend/                # API e Lógica de Negócios (Django)
│   ├── apis/               # Aplicações do projeto (Models, Views, Serializers)
│   │   ├── models/         # Definição de Dados (ORM)
│   │   ├── views/          # Controladores (Logica de Endpoints)
│   │   └── services/       # Regras de Negócio Isoladas
│   ├── core/               # Configurações do Projeto (Settings, URLs)
│   └── manage.py           # CLI do Django
│
├── frontend/               # Interface do Usuário (React)
│   ├── src/
│   │   ├── Components/     # Componentes Reutilizáveis (UI Kit)
│   │   ├── Context/        # Gestão de Estado Global (Auth, Theme)
│   │   ├── Pages/          # Telas do Sistema (Admin, Student, Parent)
│   │   └── Services/       # Integração com API
│   └── package.json        # Dependências JS
│
└── Yasmin/                 # Módulo de Inteligência Artificial
```

---

## 🔧 Guia de Instalação (Desenvolvimento)

### Pré-requisitos
*   Node.js v18+
*   Python 3.10+
*   PostgreSQL

### 1. Configuração do Backend
```bash
# Navegue até a pasta do backend
cd backend

# Crie um ambiente virtual
python -m venv venv
# Ative o ambiente (Windows)
venv\Scripts\activate

# Instale as dependências
pip install -r requirements.txt

# Configure o .env (baseado no .env.example)

# Execute as migrações
python manage.py migrate

# Inicie o servidor
python manage.py runserver
```

### 2. Configuração do Frontend
```bash
# Navegue até a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

---

## 🔒 Segurança

*   Controle de acesso baseado em funções (RBAC) para Admin, Funcionários, Alunos e Encarregados.
*   Assinatura digital em documentos gerados.
*   Logs de auditoria para rastreabilidade de ações críticas.

---

## 📞 Suporte

Para suporte técnico ou dúvidas sobre a implementação, contacte a equipa de desenvolvimento.

---
*Desenvolvido por Gabriel Pedro Aurélio.*
## Ferramenta de IA usada
Antigravity Agent