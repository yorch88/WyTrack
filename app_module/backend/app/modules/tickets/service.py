from datetime import datetime, timezone
from fastapi import HTTPException
from app.core.db import get_db
import uuid

from app.modules.ticket_events.service import create_event



async def create_ticket_service(data, current_user):
    db = await get_db()

    ticket_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)

    # =========================
    # Validaciones básicas
    # =========================
    if not data.title:
        raise HTTPException(400, "Title is required")

    if data.priority not in ["low", "medium", "high", "urgent"]:
        raise HTTPException(400, "Invalid priority")

    # =========================
    # Documento ticket
    # =========================
    doc = {
        "id": ticket_id,
        "title": data.title,
        "description": data.description,
        "reason": data.reason,

        "created_by": current_user["id"],
        "assigned_to": data.assigned_to,

        "priority": data.priority,
        "status": "open",

        "email_subject": data.email_subject,
        "parent_ticket_id": data.parent_ticket_id,

        "created_at": now,
        "updated_at": None,

        "estimated_close_at": data.estimated_close_at,
        "closed_at": None
    }

    await db.tickets.insert_one(doc)

    # =========================
    # Eventos
    # =========================

    # Creación
    await create_event(
        ticket_id,
        "created",
        current_user["id"],
        message="Ticket created"
    )

    # Asignación inicial
    if data.assigned_to:
        await create_event(
            ticket_id,
            "assigned",
            current_user["id"],
            new_value=data.assigned_to
        )

    # Issue linkage
    if data.parent_ticket_id:
        await create_event(
            ticket_id,
            "issue_created",
            current_user["id"],
            new_value=data.parent_ticket_id
        )

    # =========================
    # RESPUESTA LIMPIA (SIN _id)
    # =========================
    return {
        "id": ticket_id,
        "title": data.title,
        "description": data.description,
        "reason": data.reason,
        "created_by": current_user["id"],
        "assigned_to": data.assigned_to,
        "priority": data.priority,
        "status": "open",
        "email_subject": data.email_subject,
        "parent_ticket_id": data.parent_ticket_id,
        "created_at": now,
        "estimated_close_at": data.estimated_close_at
    }

async def reassign_ticket_service(ticket_id: str, new_user_id: str, current_user):
    db = await get_db()

    ticket = await db.tickets.find_one({"id": ticket_id})

    if not ticket:
        raise HTTPException(404, "Ticket not found")

    # Validación: solo assigned user o admin
    if (
        current_user["level"] not in ["admin", "superadmin"]
        and ticket["assigned_to"] != current_user["id"]
    ):
        raise HTTPException(403, "Not authorized to reassign")

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
        current_user["id"],
        old_value=old_user,
        new_value=new_user_id
    )

    return {"message": "Ticket reassigned"}


async def add_comment_service(ticket_id: str, message: str, current_user):
    db = await get_db()

    ticket = await db.tickets.find_one({"id": ticket_id})

    if not ticket:
        raise HTTPException(404, "Ticket not found")

    await create_event(
        ticket_id,
        "comment",
        current_user["id"],
        message=message
    )

    return {"message": "Comment added"}


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
        current_user["id"],
        old_value=old_status,
        new_value=new_status
    )

    return {"message": "Status updated"}