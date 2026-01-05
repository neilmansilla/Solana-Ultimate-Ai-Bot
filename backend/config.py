import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
    MODEL_NAME = os.getenv("MODEL_NAME", "gpt-4-turbo")

SETTINGS = Settings()
