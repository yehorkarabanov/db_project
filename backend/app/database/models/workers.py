from app.database.models import Base


class Workers(Base):
    name: str
    salary: int
    warehouse_id: int
    supervisor_id: int | None

    @classmethod
    def get_workers(cls):
        return """
            WITH RECURSIVE worker_hierarchy AS (
                -- Base case: select workers who are supervisors
                SELECT 
                    w.id,
                    w.name,
                    w.salary,
                    w.warehouse_id,
                    w.supervisor_id,
                    1 as level,
                    (SELECT COUNT(*) FROM Orders o WHERE o.worker_id = w.id) as orders_count
                FROM Worker w
                WHERE w.supervisor_id IS NULL  -- Start with top-level supervisors
            
                UNION ALL
                
                -- Recursive case: join with workers who have these supervisors
                SELECT 
                    w.id,
                    w.name,
                    w.salary,
                    w.warehouse_id,
                    w.supervisor_id,
                    wh.level + 1,
                    (SELECT COUNT(*) FROM Orders o WHERE o.worker_id = w.id) as orders_count
                FROM Worker w
                INNER JOIN worker_hierarchy wh ON w.supervisor_id = wh.id
            )
            SELECT json_build_object(
                'workers', (
                    SELECT jsonb_agg(to_jsonb(tree))
                    FROM (
                        WITH RECURSIVE json_tree AS (
                            -- Base case: top-level workers
                            SELECT 
                                w.id,
                                w.name,
                                w.salary,
                                w.warehouse_id,
                                w.orders_count,
                                (
                                    SELECT jsonb_agg(to_jsonb(sub) - 'supervisor_id')
                                    FROM (
                                        SELECT 
                                            id,
                                            name,
                                            salary,
                                            warehouse_id,
                                            orders_count,
                                            (
                                                SELECT COALESCE(jsonb_agg(to_jsonb(subsub) - 'supervisor_id'), '[]'::jsonb)
                                                FROM worker_hierarchy subsub
                                                WHERE subsub.supervisor_id = sub.id
                                            ) as subordinates
                                        FROM worker_hierarchy sub
                                        WHERE sub.supervisor_id = w.id
                                    ) sub
                                ) as subordinates
                            FROM worker_hierarchy w
                            WHERE w.supervisor_id IS NULL
                        )
                        SELECT * FROM json_tree
                    ) tree
                )
            );
        """
