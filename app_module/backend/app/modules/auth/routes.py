from fastapi import APIRouter
from .models import LoginRequest, TokenResponse
from .service import login_user

from app.modules.auth.service import set_password
from app.modules.users.models import SetPasswordRequest

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest):

    token = await login_user(body.email, body.password)

    return token



@router.post("/auth/set-password")
async def set_user_password(data: SetPasswordRequest):
    return await set_password(data.token, data.password)