from fastapi import APIRouter
import random

router = APIRouter()

SUB_AREAS = [
    "Infra",
    "Script Development",
    "Rack Testing"
]

POSITIONS = [
    "Engineer",
    "Technician"
]

LEVELS = [
    "admin",
    "technician",
    "reporter",
    "viewer",
    "engineer"
]

SHIFTS = [
    "1A",
    "2B"
]


@router.get("/mock/it/users")
async def mock_it_users():

    users = []

    for i in range(20):

        users.append({
            "full_name": f"User {i}",
            "email": f"user{i}@wywyn.com",
            "clock_id": f"01{i:03}",
            "clock_id_supervisor": "17364",
            "area": "Test Engineer",
            "sub_area": random.choice(SUB_AREAS),
            "position": random.choice(POSITIONS),
            "shift": random.choice(SHIFTS),
            "level": random.choice(LEVELS),
            "is_active": random.choice([True, False]),
            "date_of_hiring": "2020-12-12T10:10:10"
        })

    return users