from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime


Priority = Literal["low", "medium", "high", "urgent"]

Status = Literal[
    "open",
    "in_progress",
    "waiting",
    "resolved",
    "closed"
]


class TicketCreate(BaseModel):
    title: str
    description: str
    reason: str

    assigned_to: Optional[str] = None
    priority: Priority = "medium"

    email_subject: Optional[str] = None
    parent_ticket_id: Optional[str] = None

    estimated_close_at: Optional[datetime] = None


class TicketDB(BaseModel):
    id: str

    title: str
    description: str
    reason: str

    created_by: str
    assigned_to: Optional[str]

    priority: Priority
    status: Status = "open"

    email_subject: Optional[str]
    parent_ticket_id: Optional[str]

    created_at: datetime
    updated_at: Optional[datetime]

    estimated_close_at: Optional[datetime]
    closed_at: Optional[datetime]