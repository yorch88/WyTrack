from fastapi import APIRouter, Depends, HTTPException

from app.core.security import get_current_user

from .service import sync_users_from_it, create_user_service
from app.modules.users.service import send_setpass_emails_service
from .models import UserManualCreate

router = APIRouter()


@router.post("/sync")
async def sync_users(current_user = Depends(get_current_user)):

    """
    Synchronize users from IT system
    Only admin or superadmin should run this
    """

    if current_user["level"] not in ["admin", "superadmin"]:
        raise HTTPException(403, "Not authorized")

    result = await sync_users_from_it()

    return result


@router.post("/users/send-setpass-emails")
async def send_setpass_emails(current_user = Depends(get_current_user)):

    """
    Send password setup emails
    Only admin or superadmin
    """

    if current_user["level"] not in ["admin", "superadmin"]:
        raise HTTPException(403, "Not authorized")

    return await send_setpass_emails_service()


@router.post("/users")
async def create_user(
    user: UserManualCreate,
    current_user = Depends(get_current_user)
):

    """
    Create user manually
    Only admin or superadmin
    """

    if current_user["level"] not in ["admin", "superadmin"]:
        raise HTTPException(403, "Not authorized")

    return await create_user_service(user)