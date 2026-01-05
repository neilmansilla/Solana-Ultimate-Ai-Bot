import random

class StrategyEngine:
    def __init__(self):
        self.strategies = {
            "conservative": {"risk_level": "low", "allocation": {"USDC": 60, "SOL": 40}},
            "balanced": {"risk_level": "medium", "allocation": {"SOL": 50, "JUP": 30, "Meme": 20}},
            "degen": {"risk_level": "high", "allocation": {"Meme": 80, "SOL": 20}}
        }
        
    def get_strategy_details(self, strategy_type: str):
        return self.strategies.get(strategy_type, {})
        
    def analyze_market_sentiment(self, token: str):
        # Mock sentiment analysis
        sentiments = ["Bullish", "Bearish", "Neutral"]
        return random.choice(sentiments)
        
    def execute_mock_trade(self, token: str, amount: float, side: str):
        return {
            "status": "success",
            "tx_hash": f"mock_tx_{random.randint(1000,9999)}",
            "message": f"{side} {amount} {token} executed successfully at market price."
        }

engine = StrategyEngine()
