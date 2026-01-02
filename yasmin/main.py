from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
from dotenv import load_dotenv
import os
from agent import get_yasmin_agent # Ajustei o nome para corresponder ao arquivo agente.py

load_dotenv()

app = FastAPI(title="Yasmin IA - School Assistant")
agent_executor = get_yasmin_agent()

class ChatMessage(BaseModel):
    message: str
    user_id: Optional[str] = None
    role: Optional[str] = "student" # student or admin

@app.get("/")
async def root():
    return {"status": "Yasmin Online", "engine": "Ollama"}

@app.post("/chat")
async def chat(msg: ChatMessage):
    try:
        # Passando a mensagem e o contexto para o agente
        response = agent_executor.invoke({
            "input": msg.message,
            "role": msg.role
        })
        
        return {
            "response": response["output"],
            "chat_history": response.get("chat_history", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
