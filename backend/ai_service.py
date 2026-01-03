import os
import google.generativeai as genai
from typing import List
from models import LogEntry

class AIService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("Warning: GEMINI_API_KEY not set. AI features will not work.")
        else:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash')

    def analyze_logs(self, query: str, context_logs: List[LogEntry]) -> str:
        if not hasattr(self, 'model'):
            return "AI Service is not configured (missing API Key)."

        # Format logs for context
        log_text = "\n".join([f"[{log.timestamp}] {log.level} ({log.service}): {log.message}" for log in context_logs])
        
        prompt = f"""
        You are an AI Site Reliability Engineer. Analyze the following logs and answer the user's question.
        
        Recent Logs:
        {log_text}
        
        User Question: {query}
        
        Answer concisely and highlight any patterns or specific errors found in the logs.
        """
        
        try:
            # Simple retry mechanism for rate limits
            import time
            from google.api_core import exceptions
            
            max_retries = 5
            for attempt in range(max_retries):
                try:
                    response = self.model.generate_content(prompt)
                    return response.text
                except exceptions.ResourceExhausted:
                    if attempt < max_retries - 1:
                        wait_time = 5 * (2 ** attempt) # Exponential: 5s, 10s, 20s, 40s...
                        print(f"Rate limit hit. Waiting {wait_time}s...")
                        time.sleep(wait_time)
                        continue
                    else:
                        return "AI is currently overloaded (Rate Limit Exceeded). Please try again in a moment."
                except Exception as e:
                    return f"Error communicating with AI: {str(e)}"
            return "AI busy."
        except Exception as e:
            return f"Error communicating with AI: {str(e)}"
