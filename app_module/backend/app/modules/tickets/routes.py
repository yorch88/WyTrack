from fastapi import APIRouter, Depends
from app.core.security import get_current_user

from .models import TicketCreate
from .service import (
    create_ticket_service,
    get_tickets_service
)

router = APIRouter(prefix="/tickets", tags=["tickets"])


@router.post("/")
async def create_ticket(
    data: TicketCreate,
    current_user = Depends(get_current_user)
):
    return await create_ticket_service(data, current_user)


@router.get("/")
async def get_tickets(
    status: str = None,
    priority: str = None,
    page: int = 1,
    limit: int = 10,
    current_user = Depends(get_current_user)
):
    filters = {}

    if status:
        filters["status"] = status

    if priority:
        filters["priority"] = priority

    return await get_tickets_service(filters, page, limit)