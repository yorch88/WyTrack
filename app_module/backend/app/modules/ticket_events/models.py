from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime


EventType = Literal[
    "created",
    "assigned",
    "reassigned",
    "comment",
    "status_change",
    "priority_change",
    "issue_created"
]


class TicketEvent(BaseModel):
    id: str
    ticket_id: str

    type: EventType

    user_id: str

    message: Optional[str] = None

    old_value: Optional[str] = None
    new_value: Optional[str] = None

    created_at: datetime