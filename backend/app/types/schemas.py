from pydantic import BaseModel


class TypeBase(BaseModel):
    name: str


class TypeCreate(TypeBase):
    pass
