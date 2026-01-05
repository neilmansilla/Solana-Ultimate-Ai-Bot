from litellm import image_generation
import os

async def generate_image(prompt: str, size: str = "1024x1024") -> str:
    """
    Generate an image using LiteLLM (DALL-E, etc.).
    Returns the URL of the generated image.
    """
    try:
        if not os.getenv("OPENAI_API_KEY") and not os.getenv("OPENROUTER_API_KEY"):
             return "Error: No API key found for image generation. Please set OPENAI_API_KEY."

        response = image_generation(
            prompt=prompt,
            model="dall-e-3", # Default to dall-e-3, can be configured
            size=size
        )
        
        # LiteLLM standardizes response, usually in data[0].url
        return response.data[0].url
        
    except Exception as e:
        return f"Error generating image: {e}"
