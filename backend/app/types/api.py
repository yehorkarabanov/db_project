from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db_helper import db_helper
from app.database.models import Types
from app.types.schemas import TypeCreate

router = APIRouter(prefix="/types", tags=["types"])


@router.post("/")
async def create_product(type_data: TypeCreate, session: AsyncSession = Depends(db_helper.session_dependency)):
    query = Types.create_query(type_data)
    res = await Types.execute(query, session)
    await Types.commit(session)
    return res