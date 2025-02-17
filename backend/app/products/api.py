from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db_helper import db_helper
from app.database.models import Products
from app.products.schemas import ProductCreate

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/{product_name}")
async def get_product(product_name: str, session: AsyncSession = Depends(db_helper.session_dependency)):
    query = Products.get_product_by_name(product_name)
    return await Products.execute(query, session)


@router.get("/")
async def get_products(session: AsyncSession = Depends(db_helper.session_dependency)):
    query = Products.get_products()
    return await Products.execute(query, session)


@router.get("/data/")
async def get_data_for_creation(session: AsyncSession = Depends(db_helper.session_dependency)):
    query = Products.get_data_for_creation()
    return await Products.execute(query, session)


@router.post("/")
async def create_product(product_data: ProductCreate, session: AsyncSession = Depends(db_helper.session_dependency)):
    query = Products.create_query(product_data)
    await Products.execute(query, session)
    await Products.commit(session)
    return {"message": "Product created successfully"}


@router.delete("/{product_name}")
async def delete_product(product_name: str, session: AsyncSession = Depends(db_helper.session_dependency)):
    query = Products.delete_query(product_name)
    await Products.execute(query, session)
    await Products.commit(session)
    return {"message": "Product deleted successfully"}


@router.get("/{product_name}/edit/data/")
async def get_data_for_edit(product_name: str, session: AsyncSession = Depends(db_helper.session_dependency)):
    query = Products.data_for_edit_query(product_name)
    return await Products.execute(query, session)


@router.put("/{product_name}")
async def edit_product(product_name: str, product_data: ProductCreate,
                       session: AsyncSession = Depends(db_helper.session_dependency)):
    query = Products.edit_query(product_name, product_data)
    await Products.execute(query, session)
    await Products.commit(session)
    return {"message": "Product edited successfully"}
