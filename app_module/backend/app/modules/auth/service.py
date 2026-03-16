from datetime import datetime, timedelta, timezone
from jose import jwt
from fastapi import HTTPException
from passlib.context import CryptContext

from app.core.config import settings
from app.core.db import get_db


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


async def login_user(email: str, password: str):

    db = await get_db()

    user = await db.users.find_one({"email": email})

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.get("is_active", False):
        raise HTTPException(status_code=403, detail="User inactive")

    if not user.get("password"):
        raise HTTPException(status_code=401, detail="Password not set")

    if not pwd_context.verify(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    payload = {
        "sub": str(user["_id"]),
        "email": user["email"],
        "level": user["level"],
        "exp": datetime.now(timezone.utc)
        + timedelta(minutes=settings.JWT_EXPIRE_MINUTES),
    }

    token = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )

    return {"access_token": token}


async def set_password(token: str, password: str):

    db = await get_db()

    user = await db.users.find_one({
        "set_pass_token": token
    })

    if not user:
        raise HTTPException(status_code=400, detail="Invalid token")

    if user.get("set_pass_token_exp") and user["set_pass_token_exp"] < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token expired")

    password_hash = pwd_context.hash(password)

    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "password": password_hash,
                "is_active": True,
                "email_set_pass": True
            },
            "$unset": {
                "set_pass_token": "",
                "set_pass_token_exp": ""
            }
        }
    )

    return {"message": "Password created successfully"}