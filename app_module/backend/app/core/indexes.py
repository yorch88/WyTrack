from app.core.db import get_db


async def create_indexes():

    db = await get_db()

    # =========================
    # Users
    # =========================
    await db.users.create_index("email", unique=True)
    await db.users.create_index("clock_id", unique=True)

    # =========================
    # Tickets
    # =========================
    await db.tickets.create_index("id", unique=True)
    await db.tickets.create_index("created_by")
    await db.tickets.create_index("assigned_to")
    await db.tickets.create_index("status")
    await db.tickets.create_index("priority")
    await db.tickets.create_index("created_at")
    await db.tickets.create_index("parent_ticket_id")

    # 🔥 index compuesto (muy importante para dashboards)
    await db.tickets.create_index([
        ("assigned_to", 1),
        ("status", 1)
    ])

    # =========================
    # Ticket Events
    # =========================
    await db.ticket_events.create_index("id", unique=True)
    await db.ticket_events.create_index("ticket_id")
    await db.ticket_events.create_index("created_at")

    # 🔥 timeline eficiente
    await db.ticket_events.create_index([
        ("ticket_id", 1),
        ("created_at", -1)
    ])

    await db.tickets.create_index([
    ("priority_order", 1),
    ("created_at", -1)
    ])
    
    # filtros + orden
    await db.tickets.create_index([
        ("status", 1),
        ("priority_order", 1),
        ("created_at", -1)
    ])

    # assigned dashboards
    await db.tickets.create_index([
        ("assigned_to", 1),
        ("priority_order", 1),
        ("created_at", -1)
    ])
    await db.tickets.create_index([
        ("created_by", 1),
        ("priority_order", 1),
        ("created_at", -1)
    ])
    print("✅ MongoDB indexes ensured (users + tickets + events)")