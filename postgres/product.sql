WITH RECURSIVE Subordinates AS (
    -- Get the worker and their immediate subordinates
    SELECT
        w.id,
        w.name,
        w.salary,
        w.warehouse_id,
        w.supervisor_id
    FROM Worker w
    WHERE w.supervisor_id IS NOT NULL

    UNION ALL

    -- Recursively get subordinates of subordinates
    SELECT
        w.id,
        w.name,
        w.salary,
        w.warehouse_id,
        w.supervisor_id
    FROM Worker w
    INNER JOIN Subordinates s ON w.supervisor_id = s.id
),
OrderCount AS (
    -- Get the count of orders for each worker
    SELECT
        worker_id,
        COUNT(*) AS order_count
    FROM Orders
    GROUP BY worker_id
)
SELECT
    w.id,
    w.name,
    w.salary,
    w.warehouse_id,
    w.supervisor_id,
    COALESCE(oc.order_count, 0) AS order_count,
    -- Use json_build_object to create a nested structure for subordinates
    COALESCE(
        json_agg(
            json_build_object(
                'id', s.id,
                'name', s.name,
                'salary', s.salary,
                'warehouse_id', s.warehouse_id,
                'order_count', oc_sub.order_count,
                'subordinates', (
                    SELECT json_agg(
                        json_build_object(
                            'id', ss.id,
                            'name', ss.name,
                            'salary', ss.salary,
                            'warehouse_id', ss.warehouse_id,
                            'order_count', oc_sub_sub.order_count
                        )
                    )
                    FROM Worker ss
                    LEFT JOIN OrderCount oc_sub_sub ON ss.id = oc_sub_sub.worker_id
                    WHERE ss.supervisor_id = s.id
                )
            )
        ) FILTER (WHERE s.supervisor_id = w.id), '[]'
    ) AS subordinates
FROM Worker w
LEFT JOIN OrderCount oc ON w.id = oc.worker_id
LEFT JOIN Subordinates s ON w.id = s.supervisor_id
LEFT JOIN OrderCount oc_sub ON s.id = oc_sub.worker_id
GROUP BY w.id, w.name, w.salary, w.warehouse_id, w.supervisor_id, oc.order_count
ORDER BY w.id;
