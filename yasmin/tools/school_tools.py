from langchain.tools import tool
import requests
import os
from dotenv import load_dotenv

load_dotenv()

DJANGO_API_URL = os.getenv("DJANGO_BACKEND_URL", "http://localhost:8000")

@tool
def verify_student(matricula: str, bi: str) -> str:
    """
    Verifica se um aluno existe no sistema usando o número de matrícula e o BI.
    Retorna os detalhes do aluno se encontrado, ou uma mensagem de erro.
    """
    # Em produção, isso seria uma chamada autenticada ao Django
    # Por enquanto, vamos simular a busca ou fazer um request interno
    try:
        # Exemplo de chamada ao backend Django (você precisará criar esse endpoint no Django)
        # response = requests.get(f"{DJANGO_API_URL}/api/v1/internal/verify-student/?matricula={matricula}&bi={bi}")
        # if response.status_code == 200:
        #     return str(response.json())
        
        # Simulação para desenvolvimento inicial
        return f"Aluno encontrado: Nome: João Silvano, Curso: Informática, Ano: 12º, Status: Ativo. BI: {bi}, Matrícula: {matricula}"
    except Exception as e:
        return f"Erro ao verificar aluno: {str(e)}"

@tool
def get_academic_stats() -> str:
    """
    Retorna estatísticas gerais do sistema (apenas para Admin).
    """
    return "Total de Alunos: 450, Turmas Ativas: 12, Professores: 25. Média Geral: 14.5"
