from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Any
import uvicorn
from dotenv import load_dotenv
import os
from agent import get_yasmin_agent # Ajustei o nome para corresponder ao arquivo agente.py

load_dotenv()

app = FastAPI(title="Yasmin IA - School Assistant")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"Erro de validação: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )

# Configuração de CORS para permitir o Frontend
# IMPORTANTE: Quando allow_credentials=True, não podemos usar ["*"] em allow_origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent_executor = get_yasmin_agent()

class ChatMessage(BaseModel):
    message: str
    user_id: Optional[Any] = None
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
