from typing import List

from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    REDIS_PORT: int = os.getenv("REDIS_PORT", 6379)
    REDIS_URL: str = f"redis://redis:{REDIS_PORT}/0"
    BACKEND_CORS_ORIGINS: List[str] = os.getenv(
        "BACKEND_CORS_ORIGINS",
        ["*"],
    )
    DOMAIN: str = os.getenv("DOMAIN", "https://localhost")

    POSTGRES_PORT: int = os.getenv("POSTGRES_PORT", 5432)
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "db_project")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "admin")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "admin")
    DATABASE_URL: str = f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@postgres:{POSTGRES_PORT}/{POSTGRES_DB}"

    DEBUG: bool = os.getenv("DEBUG", False)


settings = Settings()
