from fastapi import HTTPException
import httpx
from datetime import datetime, timedelta, timezone
from app.core.db import get_db
import secrets 
from app.core.mail import send_email
from datetime import datetime, timedelta


TOKEN_EXP_HOURS = 24


IT_API_URL = "http://backend:8000/mock/it/users"


async def sync_users_from_it():

    db = await get_db()

    async with httpx.AsyncClient() as client:
        response = await client.get(IT_API_URL)
        response.raise_for_status()

    users = response.json()

    now = datetime.now(timezone.utc)

    inserted = 0
    updated = 0

    for user in users:

        existing = await db.users.find_one({
            "clock_id": user["clock_id"]
        })

        if existing:

            await db.users.update_one(
                {"_id": existing["_id"]},
                {
                    "$set": {
                        **user,
                        "updated_at": now
                    }
                }
            )

            updated += 1

        else:

            doc = {
                **user,
                "created_at": now
            }

            await db.users.insert_one(doc)

            inserted += 1

    return {
        "inserted": inserted,
        "updated": updated,
        "total_from_it": len(users)
    }


TOKEN_EXP_HOURS = 24


async def send_setpass_emails_service():

    db = await get_db()

    users = await db.users.find({
        "email_set_pass": False
    }).to_list(length=None)

    sent = 0

    for user in users:

        token = secrets.token_urlsafe(32)

        exp = datetime.utcnow() + timedelta(hours=TOKEN_EXP_HOURS)

        await db.users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "set_pass_token": token,
                    "set_pass_token_exp": exp
                }
            }
        )

        link = f"https://wytrack.com/set-password?token={token}"

        await send_email(user["email"], link)

        sent += 1

    return {
        "emails_sent": sent
    }


async def create_user_service(user):

    db = await get_db()

    existing = await db.users.find_one({
        "email": user.email
    })

    if existing:
        raise HTTPException(400, "User already exists")

    token = secrets.token_urlsafe(32)

    exp = datetime.utcnow() + timedelta(hours=TOKEN_EXP_HOURS)

    doc = {
        **user.model_dump(),

        "is_active": False,
        "email_set_pass": False,

        "set_pass_token": token,
        "set_pass_token_exp": exp,

        "created_at": datetime.utcnow(),
    }

    await db.users.insert_one(doc)

    link = f"https://wytrack.com/set-password?token={token}"

    await send_email(user.email, link)

    return {
        "message": "User created and email sent"
    }