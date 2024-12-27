WITH OrderProducts AS (
    -- First aggregate products with their manufacturers and types
    SELECT po.order_id,
           JSON_AGG(
                   JSON_BUILD_OBJECT(
                           'product_name', p.name,
                           'product_price', p.price,
                           'product_amount', po.amount,
                           'manufacturer', JSON_BUILD_OBJECT(
                                   'name', m.name,
                                   'country', m.country
                                           ),
                           'types', (SELECT JSON_AGG(t.name)
                                     FROM Product_Types pt
                                              JOIN Types t ON pt.type_id = t.id
                                     WHERE pt.product_id = p.id)
                   )
           ) AS products
    FROM Product_Orders po
             JOIN
         Products p ON po.product_id = p.id
             JOIN
         Manufacturers m ON p.manufacturer_id = m.id
    GROUP BY po.order_id),
     OrderDetails AS (
         -- Then aggregate orders with their products and worker info
         SELECT o.client_id,
                JSON_AGG(
                        JSON_BUILD_OBJECT(
                                'order_id', o.id,
                                'order_date', o.data_arival,
                                'worker', JSON_BUILD_OBJECT(
                                        'name', w.name,
                                        'salary', w.salary,
                                        'supervisor', (SELECT JSON_BUILD_OBJECT(
                                                                      'name', w2.name,
                                                                      'salary', w2.salary
                                                              )
                                                       FROM Worker w2
                                                       WHERE w2.id = w.supervisor_id)
                                          ),
                                'products', op.products
                        )
                ) AS orders
         FROM Orders o
                  JOIN
              OrderProducts op ON o.id = op.order_id
                  JOIN
              Worker w ON o.worker_id = w.id
         GROUP BY o.client_id),
     WarehouseTypes AS (
         -- Get warehouse types
         SELECT w.id             AS warehouse_id,
                JSON_AGG(t.name) AS types
         FROM Warehouses w
                  JOIN
              Warehouse_Types wt ON w.id = wt.warehouse_id
                  JOIN
              Types t ON wt.type_id = t.id
         GROUP BY w.id)
SELECT JSON_BUILD_OBJECT(
               'client_info', JSON_BUILD_OBJECT(
                'email', c.email,
                'name', c.name,
                'money', c.money
                              ),
               'warehouse_info', JSON_BUILD_OBJECT(
                       'location', wh.location,
                       'capacity', wh.capacity,
                       'types', COALESCE(wt.types, '[]'::json)
                                 ),
               'orders', od.orders
       ) AS client_data
FROM Clients c
         JOIN
     Orders o ON c.id = o.client_id
         JOIN
     Worker w ON o.worker_id = w.id
         JOIN
     Warehouses wh ON w.warehouse_id = wh.id
         LEFT JOIN
     WarehouseTypes wt ON wh.id = wt.warehouse_id
         JOIN
     OrderDetails od ON c.id = od.client_id
WHERE c.email = 'john.doe@example.com'
LIMIT 1;