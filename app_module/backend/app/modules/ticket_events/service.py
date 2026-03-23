from datetime import datetime, timezone
from app.core.db import get_db
import uuid


async def create_event(
    ticket_id: str,
    event_type: str,
    user_id: str,
    message: str = None,
    old_value: str = None,
    new_value: str = None
):
    db = await get_db()

    event = {
        "id": str(uuid.uuid4()),
        "ticket_id": ticket_id,
        "type": event_type,
        "user_id": user_id,
        "message": message,
        "old_value": old_value,
        "new_value": new_value,
        "created_at": datetime.now(timezone.utc)
    }

    await db.ticket_events.insert_one(event)