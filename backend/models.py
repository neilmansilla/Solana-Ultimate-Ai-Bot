from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = []
    model: Optional[str] = None

class ChatResponse(BaseModel):
    content: str
