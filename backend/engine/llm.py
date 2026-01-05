from litellm import completion
from backend.config import SETTINGS
import os

async def get_llm_response(messages: list, model: str = None) -> str:
    """
    Get response from LLM using LiteLLM.
    Supports OpenAI, OpenRouter, and others via unified interface.
    """
    try:
        if not model:
            model = SETTINGS.MODEL_NAME
            
        # LiteLLM handles the specific API base and keys based on the model prefix or env vars
        # For OpenRouter, we might need to set specific headers or API base if not auto-detected,
        # but LiteLLM usually handles "openrouter/..." models well.
        
        response = completion(
            model=model,
            messages=messages,
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error calling LLM: {e}")
        return f"Error: {str(e)}"
