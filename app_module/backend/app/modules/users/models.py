from pydantic import BaseModel, EmailStr
from typing import Optional, Literal
from datetime import datetime


Role = Literal[
    "admin",
    "superadmin",
    "technician",
    "engineer",
    "viewer",
    "reporter"
]


# ------------------------------------------------
# Base model (campos comunes)
# ------------------------------------------------

class UserBase(BaseModel):

    full_name: str
    email: EmailStr
    clock_id: str

    clock_id_supervisor: Optional[str] = None

    area: Optional[str] = None
    sub_area: Optional[str] = None

    position: Optional[str] = None
    shift: Optional[str] = None

    level: Role = "viewer"

    is_active: bool = False

    date_of_hiring: Optional[str] = None


# ------------------------------------------------
# Modelo usado cuando se sincroniza desde IT
# ------------------------------------------------

class UserSync(UserBase):
    pass


# ------------------------------------------------
# Modelo cuando se crea usuario manualmente
# ------------------------------------------------

class UserCreate(UserBase):

    password: Optional[str] = None


# ------------------------------------------------
# Modelo almacenado en MongoDB
# ------------------------------------------------

class UserDB(UserBase):

    id: str

    password: Optional[str] = None

    email_set_pass: bool = False

    set_pass_token: Optional[str] = None
    set_pass_token_exp: Optional[datetime] = None

    created_at: datetime
    updated_at: Optional[datetime] = None

    last_activity: Optional[datetime] = None


# ------------------------------------------------
# Modelo para login
# ------------------------------------------------

class LoginRequest(BaseModel):

    email: EmailStr
    password: str
    
class SetPasswordRequest(BaseModel):
    token: str
    password: str
    
class UserManualCreate(BaseModel):

    full_name: str
    email: EmailStr
    clock_id: str

    clock_id_supervisor: Optional[str] = None

    area: Optional[str] = None
    sub_area: Optional[str] = None

    position: Optional[str] = None
    shift: Optional[str] = None

    level: Role = "viewer"

    date_of_hiring: Optional[str] = None