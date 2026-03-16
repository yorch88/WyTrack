from passlib.hash import bcrypt
from fastapi import HTTPException
from datetime import datetime
from app.core.db import get_db

async def set_password(token: str, password: str):

    db = await get_db()

    user = await db.users.find_one({
        "set_pass_token": token
    })

    if not user:
        raise HTTPException(400, "Invalid token")

    if user["set_pass_token_exp"] < datetime.utcnow():
        raise HTTPException(400, "Token expired")

    hashed = bcrypt.hash(password)

    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "password": hashed,
                "email_set_pass": True,
                "is_active": True
            },
            "$unset": {
                "set_pass_token": "",
                "set_pass_token_exp": ""
            }
        }
    )

    return {"message": "Password set successfully"}