import os
from dotenv import load_dotenv
from langchain_ollama import ChatOllama
from langchain.agents import create_agent
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

load_dotenv()

# Versão do Agente adaptada para Ollama (Local IA)
class YasminAgent:
    def __init__(self):
        # 1. Configuração do Modelo (Ollama)
        # Usamos temperature baixa para evitar alucinações nas ferramentas
        self.llm = ChatOllama(
            model=os.getenv("MODEL_NAME", "llama3"),
            base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
            temperature=0.1 
        )

        # 2. Importação das Ferramentas da Escola
        try:
            from tools.school_tools import verify_student, get_academic_stats
            from tools.document_tools import generate_declaration_pdf
            self.tools = [verify_student, get_academic_stats, generate_declaration_pdf]
        except ImportError as e:
            print(f"Aviso: Algumas ferramentas não foram carregadas: {e}")
            self.tools = []

        # 3. Instruções de Comportamento (System Prompt)
        self.system_instructions = """Você é a Yasmin, a assistente virtual oficial do Sistema de Gestão Escolar (SIGE).
        
        SEU PAPEL:
        - Se o usuário for um Administrador/Funcionário: Ajude na gestão acadêmica e financeira.
        - Se o usuário for um Aluno ou Encarregado: Seja uma tutora pedagógica e orientadora.
        
        REGRAS PARA DOCUMENTOS:
        Ao solicitar Declarações, Boletins ou Certificados, peça sempre:
        1. O tipo de documento e o ano letivo.
        2. O número de matrícula e o número do BI.
        
        Responda sempre em Português de forma profissional, clara e amigável."""

        # 4. Criar o Agente (Grafo de Estado)
        # No LangChain 1.x, create_agent cria um grafo otimizado
        self.graph = create_agent(
            model=self.llm,
            tools=self.tools,
            system_prompt=self.system_instructions
        )

    def invoke(self, inputs):
        """
        Método de compatibilidade para simular o antigo AgentExecutor.invoke()
        Esperado por main.py
        """
        user_input = inputs.get("input", "")
        role = inputs.get("role", "student")
        
        # Injetamos o papel do usuário na mensagem para contexto
        contextual_input = f"[Contexto: Usuário é {role}] {user_input}"
        
        try:
            # No novo LangChain, o estado inicial recebe uma lista de mensagens
            # O grafo retorna o estado final contendo todo o histórico
            result = self.graph.invoke({
                "messages": [HumanMessage(content=contextual_input)]
            })
            
            # Recuperamos a última mensagem (que é a resposta da IA)
            messages = result.get("messages", [])
            if messages:
                # O create_agent garante que a última mensagem seja o resultado final
                last_msg = messages[-1]
                return {
                    "output": last_msg.content,
                    "chat_history": messages
                }
        except Exception as e:
            print(f"Erro ao processar mensagem na Yasmin: {e}")
            return {
                "output": "Olá! Estou a ter dificuldades em ligar-me ao meu motor de processamento. Por favor, garante que o Ollama está ativo.",
                "chat_history": []
            }
            
        return {"output": "Desculpe, não consegui processar essa solicitação.", "chat_history": []}

def get_yasmin_agent():
    """Ponto de entrada usado pelo main.py"""
    return YasminAgent()
