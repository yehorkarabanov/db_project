from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db_helper import db_helper
from app.database.models import Manufacturers, Products

router = APIRouter(prefix="/data", tags=["data"])


@router.get("/")
async def root(session: AsyncSession = Depends(db_helper.session_dependency)):
    query = """WITH OrderProducts AS (
    -- First aggregate products with their manufacturers and types
    SELECT 
        po.order_id,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'product_name', p.name,
                'product_price', p.price,
                'product_amount', po.amount,
                'manufacturer', JSON_BUILD_OBJECT(
                    'name', m.name,
                    'country', m.country
                ),
                'warehouse', JSON_BUILD_OBJECT(
                    'location', w.location
                ),
                'types', (
                    SELECT JSON_AGG(t.name)
                    FROM Product_Types pt
                    JOIN Types t ON pt.type_id = t.id
                    WHERE pt.product_id = p.id
                )
            )
        ) AS products
    FROM 
        Product_Orders po
    JOIN 
        Products p ON po.product_id = p.id
    JOIN 
        Manufacturers m ON p.manufacturer_id = m.id
    JOIN 
        Warehouses w ON p.warehouse_id = w.id
    GROUP BY 
        po.order_id
),
OrderDetails AS (
    -- Then aggregate orders with their products and worker info
    SELECT 
        o.client_id,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'order_id', o.id,
                'order_date', o.data_arival,
                'worker', JSON_BUILD_OBJECT(
                    'name', w.name
                ),
                'products', op.products
            )
        ) AS orders
    FROM 
        Orders o
    JOIN 
        OrderProducts op ON o.id = op.order_id
    JOIN 
        Worker w ON o.worker_id = w.id
    GROUP BY 
        o.client_id
)
SELECT 
    JSON_BUILD_OBJECT(
        'client_info', JSON_BUILD_OBJECT(
            'email', c.email,
            'name', c.name,
            'money', c.money
        ),
        'orders', od.orders
    ) AS client_data
FROM 
    Clients c
JOIN 
    OrderDetails od ON c.id = od.client_id
WHERE 
    c.email = 'john.doe@example.com'
LIMIT 1;
        """
    return await Products.execute(query, session)
