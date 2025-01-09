from app.database.models import Base


class Products(Base):
    name: str
    price: float
    place_taken: int
    warehouse_id: int
    manufacturer_id: int

    @classmethod
    def get_product_by_name(cls, name: str):
        return f"""
            WITH OrderSummary AS (
                SELECT
                    po.product_id,
                    json_agg(
                        json_build_object(
                            'order_id', o.id,
                            'amount', po.amount,
                            'arrival_date', o.data_arival
                        )
                    ) as orders,
                    SUM(po.amount) as total_ordered
                FROM Product_Orders po
                JOIN Orders o ON o.id = po.order_id
                GROUP BY po.product_id
            ),
            TypesList AS (
                SELECT
                    pt.product_id,
                    json_agg(t.name) as types
                FROM Product_Types pt
                JOIN Types t ON t.id = pt.type_id
                GROUP BY pt.product_id
            )
            SELECT
                json_build_object(
                    'product', json_build_object(
                        'id', p.id,
                        'name', p.name,
                        'price', p.price,
                        'place_taken', p.place_taken
                    ),
                    'manufacturer', json_build_object(
                        'id', m.id,
                        'name', m.name,
                        'country', m.country
                    ),
                    'warehouse', json_build_object(
                        'id', w.id,
                        'location', w.location,
                        'capacity', w.capacity
                    ),
                    'types', COALESCE(t.types, '[]'::json),
                    'orders', COALESCE(os.orders, '[]'::json),
                    'total_ordered', COALESCE(os.total_ordered, 0)
                ) as product_details
            FROM Products p
            JOIN Manufacturers m ON m.id = p.manufacturer_id
            JOIN Warehouses w ON w.id = p.warehouse_id
            LEFT JOIN TypesList t ON t.product_id = p.id
            LEFT JOIN OrderSummary os ON os.product_id = p.id
            WHERE p.name = '{name}';
        """

    @classmethod
    def get_products(cls):
        return """
            SELECT 
                p.name AS product_name,
                p.price AS product_price,
                p.place_taken AS product_place_taken,
                m.name AS manufacturer_name,
                m.country AS manufacturer_country,
                COALESCE(
                    ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL),
                    '{}'
                ) AS product_types
            FROM 
                Products p
            LEFT JOIN Manufacturers m ON p.manufacturer_id = m.id
            LEFT JOIN Product_Types pt ON p.id = pt.product_id
            LEFT JOIN Types t ON pt.type_id = t.id
            GROUP BY 
                p.id, m.name, m.country;
        """

    @classmethod
    def get_data_for_creation(cls):
        return """
                SELECT json_build_object(
                    'manufacturers', (
                        SELECT json_agg(
                            json_build_object(
                                'id', m.id,
                                'name', m.name,
                                'country', m.country
                            )
                        )
                        FROM Manufacturers m
                    ),
                    'warehouses', (
                        SELECT json_agg(
                            json_build_object(
                                'id', w.id,
                                'location', w.location,
                                'capacity', w.capacity
                            )
                        )
                        FROM Warehouses w
                    ),
                    'types', (
                        SELECT json_agg(
                            json_build_object(
                                'id', t.id,
                                'name', t.name
                            )
                        )
                        FROM Types t
                    )
                ) AS result;
        """

    @classmethod
    def create_query(cls, product_data):
        return f"""
                WITH new_product AS (
                    INSERT INTO Products (name, price, place_taken, warehouse_id, manufacturer_id)
                    VALUES ('{product_data.name}', {product_data.price}, {product_data.place_taken}, {product_data.warehouse_id}, {product_data.manufacturer_id})
                    RETURNING id
                )
                INSERT INTO Product_Types (product_id, type_id)
                SELECT new_product.id, unnest(ARRAY[{', '.join(str(x) for x in product_data.types)}])
                FROM new_product;
        """

    @classmethod
    def delete_query(cls, name):
        return f"""
            DELETE FROM Products
            WHERE name = '{name}';
        """

    @classmethod
    def data_for_edit_query(cls, name):
        return f"""
                WITH TypesList AS (
                    SELECT
                        pt.product_id,
                        json_agg(
                            json_build_object(
                                'type_id', t.id,
                                'type_name', t.name
                            )
                        ) as types
                    FROM Product_Types pt
                    JOIN Types t ON t.id = pt.type_id
                    GROUP BY pt.product_id
                )
                SELECT json_build_object(
                    'product_details', json_build_object(
                        'product', json_build_object(
                            'id', p.id,
                            'name', p.name,
                            'price', p.price,
                            'place_taken', p.place_taken
                        ),
                        'manufacturer', json_build_object(
                            'id', m.id,
                            'name', m.name,
                            'country', m.country
                        ),
                        'warehouse', json_build_object(
                            'id', w.id,
                            'location', w.location,
                            'capacity', w.capacity
                        ),
                        'types', COALESCE(t.types, '[]'::json)
                    ),
                    'manufacturers', (
                        SELECT json_agg(
                            json_build_object(
                                'id', m.id,
                                'name', m.name,
                                'country', m.country
                            )
                        )
                        FROM Manufacturers m
                    ),
                    'warehouses', (
                        SELECT json_agg(
                            json_build_object(
                                'id', w.id,
                                'location', w.location,
                                'capacity', w.capacity
                            )
                        )
                        FROM Warehouses w
                    ),
                    'types_list', (
                        SELECT json_agg(
                            json_build_object(
                                'id', t.id,
                                'name', t.name
                            )
                        )
                        FROM Types t
                    )
                ) AS result
                FROM Products p
                JOIN Manufacturers m ON m.id = p.manufacturer_id
                JOIN Warehouses w ON w.id = p.warehouse_id
                LEFT JOIN TypesList t ON t.product_id = p.id
                WHERE p.name = '{name}';
        """

    @classmethod
    def edit_query(cls, name, product_data):
        return f"""
        DO $$
        DECLARE
            updated_product_id INT;
        BEGIN
            -- Update the product and retrieve the updated product ID
            UPDATE Products
            SET name = '{product_data.name}', 
                price = {product_data.price}, 
                place_taken = {product_data.place_taken}, 
                warehouse_id = {product_data.warehouse_id}, 
                manufacturer_id = {product_data.manufacturer_id}
            WHERE name = '{name}'
            RETURNING id INTO updated_product_id;

            -- Delete existing product types for the updated product
            DELETE FROM Product_Types
            WHERE product_id = updated_product_id;

            -- Insert new product types
            INSERT INTO Product_Types (product_id, type_id)
            SELECT updated_product_id, unnest(ARRAY[{', '.join(str(x) for x in product_data.types)}]);
        END $$;
                """
