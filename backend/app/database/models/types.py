from app.database.models import Base


class Types(Base):
    name: str

    @classmethod
    def create_query(cls, type_data):
        return f"""
            INSERT INTO types (name)
            VALUES ('{type_data.name}')
            RETURNING id, name;
        """
