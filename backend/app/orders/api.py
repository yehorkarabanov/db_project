from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db_helper import db_helper
from app.database.models import Orders

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/{email}")
async def orders_by_mail(email: str, session: AsyncSession = Depends(db_helper.session_dependency)):
    query = Orders.get_orders_by_mail(email)
    return await Orders.execute(query, session)


@router.get("/")
async def get_orders(session: AsyncSession = Depends(db_helper.session_dependency)):
    query = Orders.get_orders()
    return await Orders.execute(query, session)
