from app.database.models import Base


class Workers(Base):
    name: str
    salary: int
    warehouse_id: int
    supervisor_id: int | None

    @classmethod
    def get_workers(cls):
        return """
            SELECT 
                w.id,
                w.name,
                w.salary,
                w.warehouse_id,
                COALESCE(s.name, NULL) AS supervisor,
                (SELECT COUNT(*) FROM Orders o WHERE o.worker_id = w.id) AS orders_count
            FROM Workers w
            LEFT JOIN Workers s ON w.supervisor_id = s.id;
        """
