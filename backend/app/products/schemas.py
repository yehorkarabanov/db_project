from typing import List
from pydantic import BaseModel


class ProductBase(BaseModel):
    name: str
    price: float
    place_taken: int
    warehouse_id: int
    manufacturer_id: int


class ProductCreate(ProductBase):
    types: List[int]
