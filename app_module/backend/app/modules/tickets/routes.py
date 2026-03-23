from fastapi import APIRouter, Depends
from app.core.security import get_current_user

from .models import TicketCreate
from .service import (
    create_ticket_service,
    reassign_ticket_service,
    add_comment_service,
    change_status_service
)

router = APIRouter(prefix="/tickets", tags=["tickets"])


@router.post("/")
async def create_ticket(
    data: TicketCreate,
    current_user = Depends(get_current_user)  # 🔥 validación sesión
):
    return await create_ticket_service(data, current_user)


@router.post("/{ticket_id}/reassign")
async def reassign_ticket(
    ticket_id: str,
    new_user_id: str,
    current_user = Depends(get_current_user)
):
    return await reassign_ticket_service(ticket_id, new_user_id, current_user)


@router.post("/{ticket_id}/comment")
async def add_comment(
    ticket_id: str,
    message: str,
    current_user = Depends(get_current_user)
):
    return await add_comment_service(ticket_id, message, current_user)


@router.post("/{ticket_id}/status")
async def change_status(
    ticket_id: str,
    new_status: str,
    current_user = Depends(get_current_user)
):
    return await change_status_service(ticket_id, new_status, current_user)