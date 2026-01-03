from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel

class LogEntry(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    level: str  # INFO, WARN, ERROR
    service: str # e.g., "auth-service", "db-worker"
    message: str
    metadata_json: Optional[str] = None # Store extra dict as JSON string if needed
