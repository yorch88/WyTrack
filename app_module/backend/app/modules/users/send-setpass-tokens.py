import secrets
from datetime import datetime, timedelta
from app.core.db import get_db

TOKEN_EXP_HOURS = 24


async def send_setpass_tokens():

    db = await get_db()

    users = await db.users.find({
        "email_set_pass": {"$ne": True}
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

        # aquí luego enviarás el correo
        print(f"TOKEN for {user['email']} -> {token}")

        sent += 1

    return {"tokens_generated": sent}