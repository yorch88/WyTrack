from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from app.core.config import settings
from app.core.db import get_db
from bson import ObjectId


security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload.get("sub")

    db = await get_db()

    user = await db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user