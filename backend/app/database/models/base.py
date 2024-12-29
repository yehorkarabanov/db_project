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
        if len(data) == 1:
            return data[0]
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
