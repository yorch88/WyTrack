import os
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseModel):

    # =========================
    # Environment
    # =========================

    APP_ENV: str = Field(default="development")

    # =========================
    # Security
    # =========================

    SECRET_KEY: str = Field(default="change-me")
    JWT_ALGORITHM: str = Field(default="HS256")
    JWT_EXPIRE_MINUTES: int = Field(default=60)

    API_KEY: str | None = None

    # =========================
    # Database
    # =========================

    MONGO_URL: str = Field(default="mongodb://mongo:27017")
    REDIS_URL: str = Field(default="redis://redis:6379/0")

    # =========================
    # WyTrack Database Name
    # =========================

    DATABASE_NAME_DEV: str = "devwytrackdb"
    DATABASE_NAME_PROD: str = "wytrackdb"

    # =========================
    # SuperAdmin bootstrap
    # =========================

    SUPERADMIN_EMAIL: str = "admin@wytrack.com"
    SUPERADMIN_PASSWORD: str = "admin123"
    SUPERADMIN_NAME: str = "WyTrack Admin"

    # =========================
    # Timezone
    # =========================

    TIMEZONE: str = Field(default="America/Mexico_City")
    
    # =========================
    # Mail
    # =========================
    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_USER: str
    SMTP_PASS: str
    EMAIL_FROM: str 
    
    # =========================
    # Helpers
    # =========================

    @property
    def is_dev(self) -> bool:
        return self.APP_ENV == "development"

    @property
    def is_prod(self) -> bool:
        return self.APP_ENV == "production"

    @property
    def database_name(self) -> str:
        """
        Automatically select database based on environment
        """
        if self.is_dev:
            return self.DATABASE_NAME_DEV
        return self.DATABASE_NAME_PROD

    # =========================
    # Startup Validation
    # =========================

    def validate_environment(self):
        """
        Prevent dangerous misconfiguration
        """

        if self.is_prod:

            if self.SECRET_KEY == "change-me":
                raise RuntimeError(
                    "SECRET_KEY must be set in production"
                )

            if self.DATABASE_NAME_DEV in self.MONGO_URL:
                raise RuntimeError(
                    "PRODUCTION is pointing to DEV database"
                )


settings = Settings(

    APP_ENV=os.getenv("APP_ENV", "development"),

    SECRET_KEY=os.getenv("SECRET_KEY", "change-me"),
    JWT_ALGORITHM=os.getenv("JWT_ALGORITHM", "HS256"),
    JWT_EXPIRE_MINUTES=int(os.getenv("JWT_EXPIRE_MINUTES", 60)),
    API_KEY=os.getenv("API_KEY"),

    MONGO_URL=os.getenv("MONGO_URL", "mongodb://mongo:27017"),
    REDIS_URL=os.getenv("REDIS_URL", "redis://redis:6379/0"),

    SUPERADMIN_EMAIL=os.getenv("SUPERADMIN_EMAIL", "admin@wytrack.com"),
    SUPERADMIN_PASSWORD=os.getenv("SUPERADMIN_PASSWORD", "admin123"),
    SUPERADMIN_NAME=os.getenv("SUPERADMIN_NAME", "WyTrack Admin"),

    TIMEZONE=os.getenv("TZ", "America/Mexico_City"),
    
    SMTP_HOST=os.getenv("SMTP_HOST"),
    SMTP_PORT=int(os.getenv("SMTP_PORT", 587)),
    SMTP_USER=os.getenv("SMTP_USER"),
    SMTP_PASS=os.getenv("SMTP_PASS"),
    EMAIL_FROM=os.getenv("EMAIL_FROM"),
)

# Run validation once on import
settings.validate_environment()