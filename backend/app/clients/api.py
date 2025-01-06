from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db_helper import db_helper
from app.database.models import Clients

router = APIRouter(prefix="/clients", tags=["clients"])


@router.get("/")
async def get_clients(session: AsyncSession = Depends(db_helper.session_dependency)):
    query = Clients.get_clients_info()
    return await Clients.execute(query, session)
