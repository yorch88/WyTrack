from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings


client: AsyncIOMotorClient | None = None
db = None


async def connect():
    global client, db

    client = AsyncIOMotorClient(
        settings.MONGO_URL,
        serverSelectionTimeoutMS=5000,
    )

    # Force real connection
    await client.admin.command("ping")

    # Select database depending on environment
    db = client[settings.database_name]

    print(f"✅ MongoDB connected successfully")
    print(f"📦 Database: {settings.database_name}")


async def get_db():
    if db is None:
        raise RuntimeError("Database not initialized. Call connect() first.")
    return db


async def close():
    global client

    if client:
        client.close()
        print("MongoDB connection closed")