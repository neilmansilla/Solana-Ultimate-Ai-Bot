from fastapi import FastAPI
from backend.config import SETTINGS
from backend.engine.agent import process_request
from backend.models import ChatRequest, ChatResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Ultimate AI Bot", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Ultimate AI Bot Backend"}

@app.get("/models")
def get_models():
    return {
        "models": [
            {"id": "gpt-4-turbo", "name": "GPT-4 Turbo (OpenAI)"},
            {"id": "gpt-3.5-turbo", "name": "GPT-3.5 Turbo (OpenAI)"},
            {"id": "claude-3-opus", "name": "Claude 3 Opus (Anthropic)"},
            {"id": "claude-3-sonnet", "name": "Claude 3 Sonnet (Anthropic)"},
            {"id": "google/gemini-pro", "name": "Gemini Pro (Google)"},
            {"id": "mistralai/mixtral-8x7b-instruct", "name": "Mixtral 8x7B (Open Source)"}
        ]
    }

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        response_content = await process_request(request)
        return ChatResponse(content=response_content)
    except Exception as e:
        # Graceful error handling
        return ChatResponse(content=f"Error processing request: {str(e)}")

from backend.engine.strategy import engine

@app.get("/strategy/{strategy_type}")
def get_strategy(strategy_type: str):
    return engine.get_strategy_details(strategy_type)

@app.get("/market/sentiment/{token}")
def get_sentiment(token: str):
    return {"token": token, "sentiment": engine.analyze_market_sentiment(token)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
