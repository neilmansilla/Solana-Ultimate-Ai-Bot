from duckduckgo_search import DDGS

def search_web(query: str, max_results: int = 5) -> str:
    """
    Search the web for the given query.
    Returns a formatted string of results.
    """
    try:
        results = DDGS().text(query, max_results=max_results)
        if not results:
            return "No results found."
            
        formatted_results = ""
        for i, r in enumerate(results):
            formatted_results += f"{i+1}. [{r['title']}]({r['href']})\n{r['body']}\n\n"
            
        return formatted_results
    except Exception as e:
        return f"Error searching web: {e}"
