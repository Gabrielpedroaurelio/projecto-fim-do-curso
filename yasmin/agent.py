import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_core.tools import tool
from contextvars import ContextVar

load_dotenv()

# Context variable para armazenar o token do usuário para as ferramentas
user_token_context: ContextVar[str] = ContextVar('user_token', default=None)

# Versão simplificada do Agente (sem AgentExecutor, usando tool calling nativo)
class YasminAgent:
    def __init__(self):
        # 1. Configuração do Modelo (Google Gemini)
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key or api_key == "SUA_CHAVE_AQUI":
            print("AVISO: GOOGLE_API_KEY não configurada ou inválida no arquivo .env")
            
        self.llm = ChatGoogleGenerativeAI(
            model=os.getenv("MODEL_NAME", "gemini-2.5-flash"),
            google_api_key=api_key,
            temperature=0.1
        )

        # 2. Importação das Ferramentas da Escola
        try:
            from tools.school_tools import verify_student, get_academic_stats
            from tools.document_tools import generate_declaration_pdf
            self.tools = [verify_student, get_academic_stats, generate_declaration_pdf]
            
            # Bind tools to the model for native function calling
            self.llm_with_tools = self.llm.bind_tools(self.tools)
        except ImportError as e:
            print(f"Aviso: Algumas ferramentas não foram carregadas: {e}")
            self.tools = []
            self.llm_with_tools = self.llm

        # 3. Instruções de Comportamento (System Prompt)
        self.system_message = """Você é a Yasmin, a assistente virtual oficial do Sistema de Gestão de Declarações Escolares.
        
        SEU PAPEL:
        - Se o usuário for um Administrador/Funcionário: Ajude na gestão acadêmica e financeira.
        - Se o usuário for um Aluno ou Encarregado: Seja uma tutora pedagógica e orientadora.
        
        REGRAS PARA DOCUMENTOS:
        Ao solicitar Declarações, Boletins ou Certificados, peça sempre:
        1. O tipo de documento e o ano letivo.
        2. O número do BI.
        
        Responda sempre em Português de forma profissional, clara e amigável.
        ajude os alunos com o plano de aula e carreira para cada curso.
        Já Agora foste Desenvolvida Por Gabriel Pedro Aurélio em colaboração com o Google
        """

    def invoke(self, inputs: dict) -> dict:
        """
        Processa uma mensagem do usuário e retorna a resposta da IA.
        """
        try:
            # Definir o token do usuário no contexto para as ferramentas
            token = user_token_context.set(inputs.get("user_token"))
            
            try:
                user_message = inputs.get("input", "")
                role = inputs.get("role", "student")
                
                # Injetamos o papel do usuário na mensagem para contexto
                contextual_input = f"[Contexto: Usuário é {role}]\\n{user_message}"
                
                messages = [
                    SystemMessage(content=self.system_message),
                    HumanMessage(content=contextual_input)
                ]
                
                response = self.llm_with_tools.invoke(messages)
                
                # Se o modelo chamou ferramentas, executamos elas
                if hasattr(response, 'tool_calls') and response.tool_calls:
                    tool_messages = []
                    for tool_call in response.tool_calls:
                        tool_name = tool_call.get('name') or tool_call.get('function', {}).get('name')
                        tool_args = tool_call.get('args') or tool_call.get('function', {}).get('arguments', {})
                        
                        for tool_func in self.tools:
                            if tool_func.name == tool_name:
                                result = tool_func.invoke(tool_args)
                                tool_messages.append({
                                    "role": "tool",
                                    "content": str(result),
                                    "tool_call_id": tool_call.get('id', '')
                                })
                                break
                    
                    if tool_messages:
                        messages.append(response)
                        for tm in tool_messages:
                            messages.append(HumanMessage(content=f"Resultado da ferramenta: {tm['content']}"))
                        
                        final_response = self.llm.invoke(messages)
                        return {
                            "output": final_response.content,
                            "chat_history": []
                        }
                
                final_output = response.content if hasattr(response, 'content') else str(response)
                
                return {
                    "output": final_output,
                    "chat_history": []
                }
            finally:
                # Resetar o contexto do token
                user_token_context.reset(token)
                
        except Exception as e:
            print(f"Erro ao processar mensagem na Yasmin: {e}")
            import traceback
            traceback.print_exc()
            return {
                "output": "Olá! Estou a ter dificuldades em ligar-me ao meu motor de processamento (Gemini). Por favor, verifica se a chave de API é válida.",
                "error": str(e)
            }

def get_yasmin_agent():
    return YasminAgent()
