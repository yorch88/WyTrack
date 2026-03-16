from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.db import connect, close
from app.core.bootstrap import create_superadmin
from app.core.indexes import create_indexes

# Modules
from app.modules.users.routes import router as users_router
from app.modules.users.mock_it_api import router as mock_it_router
from app.modules.auth.routes import router as auth_router

# =========================
# App Initialization
# =========================

app = FastAPI(
    title="WyTrack API",
    version="0.1.0"
)


# =========================
# CORS Configuration
# =========================

origins = [
    "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# Routers
# =========================

app.include_router(users_router, prefix="/users", tags=["Users"])

# Fake IT API (temporary during development)
app.include_router(mock_it_router, tags=["Mock IT API"])

# auth
app.include_router(auth_router, prefix="/auth", tags=["Auth"])

# =========================
# Health Check
# =========================

@app.get("/health")
async def health():
    return {"status": "ok", "service": "wytrack-api"}


# =========================
# Startup / Shutdown Events
# =========================

@app.on_event("startup")
async def startup():

    print("Starting WyTrack API...")

    await connect()

    await create_indexes()

    await create_superadmin()

    print("WyTrack API started successfully")


@app.on_event("shutdown")
async def shutdown():

    print("Shutting down WyTrack API...")

    await close()

    print("WyTrack API stopped")