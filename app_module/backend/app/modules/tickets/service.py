from datetime import datetime, timezone
from fastapi import HTTPException
from app.core.db import get_db
import uuid

from app.modules.ticket_events.service import create_event


async def create_ticket_service(data, current_user):
    db = await get_db()

    ticket_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)

    payload = data.model_dump()

    # =========================
    # VALIDACIONES
    # =========================
    if not payload.get("title"):
        raise HTTPException(400, "Title is required")

    if not payload.get("description"):
        raise HTTPException(400, "Description is required")

    if not payload.get("reason"):
        raise HTTPException(400, "Reason is required")

    if payload.get("priority") not in ["low", "medium", "high", "urgent"]:
        raise HTTPException(400, "Invalid priority")

    # =========================
    # PRIORITY ORDER
    # =========================
    priority_map = {
        "urgent": 1,
        "high": 2,
        "medium": 3,
        "low": 4
    }

    priority = payload.get("priority", "medium")

    # =========================
    # DOCUMENTO
    # =========================
    doc = {
        "id": ticket_id,
        "title": payload["title"],
        "description": payload["description"],
        "reason": payload["reason"],

        # 🔥 TODO con clock_id
        "created_by": current_user["clock_id"],
        "assigned_to": payload.get("assigned_to"),

        "priority": priority,
        "priority_order": priority_map[priority],
        "status": "open",

        "email_subject": payload.get("email_subject"),
        "parent_ticket_id": payload.get("parent_ticket_id"),

        "created_at": now,
        "updated_at": None,

        "estimated_close_at": payload.get("estimated_close_at"),
        "closed_at": None
    }

    result = await db.tickets.insert_one(doc)

    if not result.inserted_id:
        raise HTTPException(500, "Ticket not saved")

    # =========================
    # EVENTOS
    # =========================
    await create_event(
        ticket_id,
        "created",
        current_user["clock_id"],
        message="Ticket created"
    )

    if doc["assigned_to"]:
        await create_event(
            ticket_id,
            "assigned",
            current_user["clock_id"],
            new_value=doc["assigned_to"]
        )

    # =========================
    # RESPONSE
    # =========================
    return {
        "id": doc["id"],
        "title": doc["title"],
        "description": doc["description"],
        "reason": doc["reason"],
        "created_by": doc["created_by"],
        "assigned_to": doc["assigned_to"],
        "priority": doc["priority"],
        "status": doc["status"],
        "created_at": doc["created_at"],
        "estimated_close_at": doc["estimated_close_at"]
    }


async def get_tickets_service(filters: dict = {}, page: int = 1, limit: int = 10):
    db = await get_db()

    match = {}

    if filters.get("status"):
        match["status"] = filters["status"]

    if filters.get("priority"):
        match["priority"] = filters["priority"]

    skip = (page - 1) * limit

    pipeline = [
        {"$match": match},

        {
            "$addFields": {
                "priority_order": {
                    "$switch": {
                        "branches": [
                            {"case": {"$eq": ["$priority", "urgent"]}, "then": 1},
                            {"case": {"$eq": ["$priority", "high"]}, "then": 2},
                            {"case": {"$eq": ["$priority", "medium"]}, "then": 3},
                            {"case": {"$eq": ["$priority", "low"]}, "then": 4},
                        ],
                        "default": 5
                    }
                }
            }
        },

        {
            "$sort": {
                "created_at": -1
            }
        },

        {"$skip": skip},
        {"$limit": limit},

        # =========================
        # CREATED USER (🔥 FIX clock_id)
        # =========================
        {
            "$lookup": {
                "from": "users",
                "let": { "creator": "$created_by" },
                "pipeline": [
                    {
                        "$match": {
                            "$expr": {
                                "$eq": [
                                    { "$toString": "$clock_id" },
                                    { "$toString": "$$creator" }
                                ]
                            }
                        }
                    }
                ],
                "as": "created_user"
            }
        },
        {
            "$unwind": {
                "path": "$created_user",
                "preserveNullAndEmptyArrays": True
            }
        },

        # =========================
        # ASSIGNED USER
        # =========================
        {
            "$lookup": {
                "from": "users",
                "localField": "assigned_to",
                "foreignField": "clock_id",
                "as": "assigned_user"
            }
        },
        {
            "$unwind": {
                "path": "$assigned_user",
                "preserveNullAndEmptyArrays": True
            }
        },

        # =========================
        # PROJECTION
        # =========================
        {
            "$project": {
                "_id": 0,
                "id": 1,
                "title": 1,
                "description": 1,
                "reason": 1,
                "priority": 1,
                "status": 1,
                "created_at": 1,
                "updated_at": 1,
                "estimated_close_at": 1,
                "closed_at": 1,
                "created_by": 1,
                "assigned_to": 1,

                "created_by_name": {
                    "$ifNull": ["$created_user.full_name", "Unknown"]
                },
                "created_by_clock": {
                    "$ifNull": ["$created_user.clock_id", "-"]
                },

                "assigned_to_name": {
                    "$ifNull": ["$assigned_user.full_name", "-"]
                },
                "assigned_to_clock": {
                    "$ifNull": ["$assigned_user.clock_id", "-"]
                },
            }
        }
    ]

    tickets = await db.tickets.aggregate(pipeline).to_list(length=None)
    total = await db.tickets.count_documents(match)

    return {
        "data": tickets,
        "pagination": {
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit
        }
    }
    
    # =========================
# REASSIGN
# =========================
async def reassign_ticket_service(ticket_id: str, new_user_id: str, current_user):
    db = await get_db()

    ticket = await db.tickets.find_one({"id": ticket_id})

    if not ticket:
        raise HTTPException(404, "Ticket not found")

    if (
        current_user["level"] not in ["admin", "superadmin"]
        and ticket["assigned_to"] != current_user["clock_id"]
    ):
        raise HTTPException(403, "Not authorized")

    old_user = ticket.get("assigned_to")

    await db.tickets.update_one(
        {"id": ticket_id},
        {
            "$set": {
                "assigned_to": new_user_id,
                "updated_at": datetime.now(timezone.utc)
            }
        }
    )

    await create_event(
        ticket_id,
        "reassigned",
        current_user["clock_id"],
        old_value=old_user,
        new_value=new_user_id
    )

    return {"message": "Ticket reassigned"}


# =========================
# COMMENT
# =========================
async def add_comment_service(ticket_id: str, message: str, current_user):
    db = await get_db()

    ticket = await db.tickets.find_one({"id": ticket_id})

    if not ticket:
        raise HTTPException(404, "Ticket not found")

    await create_event(
        ticket_id,
        "comment",
        current_user["clock_id"],
        message=message
    )

    return {"message": "Comment added"}


# =========================
# STATUS
# =========================
async def change_status_service(ticket_id: str, new_status: str, current_user):
    db = await get_db()

    ticket = await db.tickets.find_one({"id": ticket_id})

    if not ticket:
        raise HTTPException(404, "Ticket not found")

    old_status = ticket["status"]

    await db.tickets.update_one(
        {"id": ticket_id},
        {
            "$set": {
                "status": new_status,
                "updated_at": datetime.now(timezone.utc)
            }
        }
    )

    await create_event(
        ticket_id,
        "status_change",
        current_user["clock_id"],
        old_value=old_status,
        new_value=new_status
    )

    return {"message": "Status updated"}