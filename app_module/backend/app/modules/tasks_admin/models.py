from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Optional[str] = None
    eta_at: Optional[datetime] = None


class TaskComment(BaseModel):
    message: str


class TaskEventOut(BaseModel):
    type: str
    created_at: datetime

    # For comment event
    message: Optional[str] = None

    # For move / close events
    comment: Optional[str] = None

class TaskOut(BaseModel):

    id: str

    title: str
    description: Optional[str] = None

    status: str
    eta_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    is_delayed: Optional[bool] = False

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    events: List[TaskEventOut] = []


class TaskETAUpdate(BaseModel):
    eta_at: datetime

class MoveTaskPayload(BaseModel):
    comment: Optional[str] = None

class CloseTaskPayload(BaseModel):
    comment: Optional[str] = None
