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
            self.model = genai.GenerativeModel('gemini-2.0-flash-lite')

    
    def analyze_logs_stream(self, query: str, context_logs: List[LogEntry]):
        if not hasattr(self, 'model'):
            yield "AI Service is not configured (missing API Key)."
            return

        # Format logs for context
        log_text = "\n".join([f"[{log.timestamp}] {log.level} ({log.service}): {log.message}" for log in context_logs])
        
        prompt = f"""
        You are an AI Site Reliability Engineer. Analyze the following logs and answer the user's question.
        
        Recent Logs:
        {log_text}
        
        User Question: {query}
        
        Answer concisely and highlight any patterns or specific errors found in the logs.
        """
        
        # Streaming with retry
        import time
        from google.api_core import exceptions
        
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = self.model.generate_content(prompt, stream=True)
                for chunk in response:
                    if chunk.text:
                        yield chunk.text
                return # Success, exit function
            except exceptions.ResourceExhausted:
                if attempt < max_retries - 1:
                    yield f" [busy, waiting 10s...] "
                    time.sleep(10)
                    continue
                else:
                    yield " [System: AI is currently overloaded. Please try again later.]"
            except Exception as e:
                yield f"Error: {str(e)}"
                return

