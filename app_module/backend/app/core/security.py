from bson import ObjectId
from jose import jwt, JWTError
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.config import settings
from app.core.db import get_db

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )

    db = await get_db()

    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except:
        raise HTTPException(401, "Invalid user id")

    if not user:
        raise HTTPException(404, "User not found")

    if not user.get("is_active", False):
        raise HTTPException(403, "User inactive")

    # 🔥 FIX AQUÍ
    if "clock_id" not in user:
        raise HTTPException(500, "User missing clock_id")

    return {
        "id": str(user["_id"]),
        "clock_id": user["clock_id"],   # ✅ IMPORTANTE
        "email": user["email"],
        "level": user["level"],
        "full_name": user.get("full_name"),
    }