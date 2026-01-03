from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, create_engine, select
from typing import List, Optional
from datetime import datetime
import os
from dotenv import load_dotenv

from models import LogEntry
from ai_service import AIService

load_dotenv()

app = FastAPI(title="AI Cloud Log Monitor")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Setup
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
engine = create_engine(sqlite_url)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Services
ai_service = AIService()

# Routes
@app.get("/")
def read_root():
    return {"status": "ok", "message": "Log Monitor API is running"}

@app.post("/logs", response_model=LogEntry)
def ingest_log(log: LogEntry):
    with Session(engine) as session:
        log.timestamp = log.timestamp or datetime.utcnow()
        session.add(log)
        session.commit()
        session.refresh(log)
        return log

@app.get("/logs", response_model=List[LogEntry])
def get_logs(limit: int = 50, level: Optional[str] = None):
    with Session(engine) as session:
        query = select(LogEntry).order_by(LogEntry.timestamp.desc()).limit(limit)
        if level:
            query = query.where(LogEntry.level == level)
        logs = session.exec(query).all()
        return logs

class ChatRequest(SQLModel):
    message: str

@app.post("/chat")
def chat_with_logs(request: ChatRequest):
    # Fetch recent context (e.g., last 50 logs)
    # in a real app, we might do semantic search, but for MVP, recent logs are best context
    with Session(engine) as session:
        logs = session.exec(select(LogEntry).order_by(LogEntry.timestamp.desc()).limit(20)).all()
        # We process logs in chronological order for the AI
        logs_chronological = list(reversed(logs))
        
        answer = ai_service.analyze_logs(request.message, logs_chronological)
from fastapi.responses import StreamingResponse

@app.post("/chat/stream")
def chat_with_logs_stream(request: ChatRequest):
    def event_stream():
        with Session(engine) as session:
            # Need to re-fetch inside generator or pass data? 
            # Better to fetch once:
            logs = session.exec(select(LogEntry).order_by(LogEntry.timestamp.desc()).limit(10)).all()
            logs_chronological = list(reversed(logs))
            
            for chunk in ai_service.analyze_logs_stream(request.message, logs_chronological):
                yield chunk

    return StreamingResponse(event_stream(), media_type="text/plain")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
