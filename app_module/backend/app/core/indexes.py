from app.core.db import get_db


async def create_indexes():

    db = await get_db()

    # Users
    await db.users.create_index("email", unique=True)
    await db.users.create_index("clock_id", unique=True)

    print("✅ MongoDB indexes ensured")