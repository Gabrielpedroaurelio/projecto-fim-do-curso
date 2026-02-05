from langchain.tools import tool
import requests
import os
from dotenv import load_dotenv
from contextvars import ContextVar

load_dotenv()

DJANGO_API_URL = os.getenv("DJANGO_BACKEND_URL", "http://localhost:8000")

# Importar o contexto do token do usuário
try:
    from agent import user_token_context
except ImportError:
    # Fallback se houver problema de importação circular
    user_token_context: ContextVar[str] = ContextVar('user_token', default=None)

# Nota: Em um sistema real, precisamos de um token para acessar a API protegida
# DJANGO_API_TOKEN = os.getenv("DJANGO_API_TOKEN", "") # Removed fixed token

def get_headers():
    token = user_token_context.get()
    headers = {
        "Accept": "application/json",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers

@tool
def verify_student(query: str) -> str:
    """
    Pesquisa um aluno no sistema usando nome, matrícula ou BI.
    Retorna os detalhes do aluno se encontrado.
    """
    try:
        # Obter o token do usuário do contexto
        user_token = user_token_context.get()
        
        # Construir headers com token dinâmico
        headers = {
            "Accept": "application/json",
            "Authorization": f"Bearer {user_token}" if user_token else ""
        }
        
        # Usando o endpoint de listagem com busca
        url = f"{DJANGO_API_URL}/api/v1/alunos/?search={query}"
        response = requests.get(url, headers=headers, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            if data['count'] > 0:
                aluno = data['results'][0]
                return f"Aluno encontrado: Nome: {aluno['nome_completo']}, Matrícula: {aluno['numero_matricula']}, Curso: {aluno.get('id_turma_codigo', 'N/A')}, Status: {aluno['status_aluno']}"
            return "Nenhum aluno encontrado com esses dados."
        elif response.status_code == 401:
            return "Erro de autorização. Por favor, faça login novamente no sistema."
        elif response.status_code == 403:
            return "Você não tem permissão para aceder a essa informação."
        return f"Erro na comunicação com o sistema (Status: {response.status_code})"
    except requests.exceptions.Timeout:
        return "Desculpe, o sistema de gestão escolar não está respondendo no momento. Por favor, tente novamente mais tarde ou contacte o suporte técnico."
    except requests.exceptions.ConnectionError:
        return "Não consigo conectar ao sistema de gestão escolar. Verifique se o servidor backend está ativo."
    except Exception as e:
        return f"Erro ao verificar aluno: Ocorreu um problema técnico. Por favor, contacte o suporte."

@tool
def get_academic_stats() -> str:
    """
    Retorna estatísticas gerais do sistema (apenas para Admin).
    Inclui total de alunos, solicitações e receita.
    """
    try:
        # Obter o token do usuário do contexto
        user_token = user_token_context.get()
        
        # Construir headers com token dinâmico
        headers = {
            "Accept": "application/json",
            "Authorization": f"Bearer {user_token}" if user_token else ""
        }
        
        url = f"{DJANGO_API_URL}/api/v1/dashboard/stats/"
        response = requests.get(url, headers=headers, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            kpis = data.get('kpis', {})
            total_alunos = kpis.get('novos_alunos', {}).get('total', 0)
            total_solicitacoes = kpis.get('total_solicitacoes', {}).get('total', 0)
            receita = kpis.get('receita_total', {}).get('total', 0)
            
            return f"Estatísticas Gerais: Total de Alunos: {total_alunos}, Solicitações: {total_solicitacoes}, Receita Total: {receita} Kz"
        elif response.status_code == 401:
            return "Erro de autorização. Por favor, faça login novamente no sistema."
        elif response.status_code == 403:
            return "Você não tem permissão para aceder a essas estatísticas. Apenas administradores podem ver essas informações."
        return f"Erro ao obter estatísticas (Status: {response.status_code})"
    except requests.exceptions.Timeout:
        return "Desculpe, o sistema não está respondendo. Por favor, tente novamente mais tarde."
    except requests.exceptions.ConnectionError:
        return "Não consigo conectar ao sistema de gestão. Verifique se o servidor está ativo."
    except Exception as e:
        return f"Erro ao obter estatísticas: Ocorreu um problema técnico."
