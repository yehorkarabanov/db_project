from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db_helper import db_helper
from app.database.models import Workers

router = APIRouter(prefix="/workers", tags=["workers"])


@router.get("/")
async def get_workers(session: AsyncSession = Depends(db_helper.session_dependency)):
    query = Workers.get_workers()
    return await Workers.execute(query, session)
