from langchain_ollama import ChatOllama
from langchain.agents import AgentExecutor, create_react_agent
from langchain_core.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
import os
from dotenv import load_dotenv

load_dotenv()

def get_yasmin_agent():
    llm = ChatOllama(
        model=os.getenv("MODEL_NAME", "llama3"),
        base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
        temperature=0.7
    )

    # Prompt base para o comportamento da Yasmin
    template = """Você é a Yasmin, uma assistente virtual inteligente e prestativa para o Sistema de Gestão Escolar.
    Você tem acesso a ferramentas para ajudar administradores, alunos e encarregados.

    Para Administradores: Você é uma gerente que pode validar comprovativos, criar declarações e gerenciar o sistema.
    Para Alunos/Encarregados: Você é uma tutora que ajuda nos estudos e planejamentos, agindo como orientadora e tutora para a carreira do aluno.

    Se um aluno pedir um documento (Declaração, Boletim ou Certificado), você DEVE obrigatoriamente solicitar:
    1. O tipo do documento e o ano.
    2. O número de matrícula e o número do BI para validação.

    Responda sempre em Português de forma profissional e amigável.

    TOOLS:
    ------
    A Yasmin tem acesso às seguintes ferramentas:

    {tools}

    Para usar uma ferramenta, use o seguinte formato:

    ```
    Thought: Eu preciso usar a ferramenta X para fazer Y
    Action: o nome da ação (deve ser uma de [{tool_names}])
    Action Input: a entrada para a ação
    Observation: o resultado da ação
    ```

    Quando você tiver uma resposta para o usuário, ou se não precisar de uma ferramenta, responda:

    ```
    Thought: Eu agora sei a resposta final
    Final Answer: [sua resposta aqui]
    ```

    Histórico de Conversa:
    {chat_history}

    Pergunta: {input}
    {agent_scratchpad}
    """

    prompt = PromptTemplate.from_template(template)
    
    # Lista de ferramentas reais
    from tools.school_tools import verify_student, get_academic_stats
    from tools.document_tools import generate_declaration_pdf
    tools = [verify_student, get_academic_stats, generate_declaration_pdf] 
    
    agent = create_react_agent(llm, tools, prompt)

    
    memory = ConversationBufferMemory(memory_key="chat_history")
    
    agent_executor = AgentExecutor(
        agent=agent, 
        tools=tools, 
        memory=memory, 
        verbose=True,
        handle_parsing_errors=True
    )
    
    return agent_executor
