
from pydantic import BaseModel
from sqlalchemy import text


class Base(BaseModel):
    id: int

    @classmethod
    def select_query(cls, data="*"):
        if isinstance(data, list):
            data = ", ".join(data)
        return f"SELECT {data} FROM {cls.__name__}"

    @classmethod
    async def execute(cls, query, db):
        res = await db.execute(text(query))
        if not res.returns_rows:
            return []

        rows = res.fetchall()
        columns = res.keys()
        data = [dict(zip(columns, row)) for row in rows]
        return data

    @classmethod
    async def commit(cls, db):
        await db.commit()

    @classmethod
    def add_query(cls, data):
        keys = ", ".join(data.keys())
        values = ", ".join([f"'{value}'" for value in data.values()])
        return f"INSERT INTO {cls.__name__} ({keys}) VALUES ({values})"

    @classmethod
    def delete_query(cls, id):
        return f"DELETE FROM {cls.__name__} WHERE id = {id}"

    @classmethod
    def update_query(cls, id, data):
        values = ", ".join([f"{key} = '{value}'" for key, value in data.items()])
        return f"UPDATE {cls.__name__} SET {values} WHERE id = {id}"


class Manufacturers(Base):
    name: str
    country: str


class Warehouses(Base):
    location: str
    capacity: int


class Clients(Base):
    name: str
    money: float


class Worker(Base):
    name: str
    salary: int
    warehouse_id: int
    supervisor_id: int | None


class Orders(Base):
    client_id: int
    data_arival: str
    worker_id: int

    @classmethod
    def get_orders_by_mail(cls, email):
        return f"""WITH OrderProducts AS (
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
                    c.email = '{email}'
                LIMIT 1;
                """


class Products(Base):
    name: str
    price: float
    place_taken: int
    warehouse_id: int
    manufacturer_id: int


class Types(Base):
    name: str


class Product_Types(Base):
    name: str
    product_id: int
    type_id: int


class Product_Orders(Base):
    amount: int
    product_id: int
    order_id: int


class Warehouse_Types(Base):
    warehouse_id: int
    type_id: int
