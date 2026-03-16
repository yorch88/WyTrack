from app.core.db import get_db
from app.core.config import settings
from datetime import datetime, timezone
import bcrypt


async def create_superadmin():

    db = await get_db()

    existing = await db.users.find_one({
        "email": settings.SUPERADMIN_EMAIL})

    if existing:
        return

    password_hash = bcrypt.hashpw(
        settings.SUPERADMIN_PASSWORD.encode(),
        bcrypt.gensalt()
    ).decode()

    user = {
        "full_name": settings.SUPERADMIN_NAME,
        "email": settings.SUPERADMIN_EMAIL,
        "clock_id": "00000",
        "area": "System",
        "sub_area": "Admin",
        "position": "SuperAdmin",
        "shift": "NA",
        "level": "superadmin",
        "is_active": True,
        "password": password_hash,
        "created_at": datetime.now(timezone.utc),
        "date_of_hiring": datetime.now(timezone.utc)
    }

    await db.users.insert_one(user)

    print("✅ SuperAdmin created")