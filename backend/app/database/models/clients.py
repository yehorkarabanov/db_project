from app.database.models import Base


class Clients(Base):
    name: str
    money: float

    @classmethod
    def get_clients_info(cls):
        return """SELECT 
                    c.id AS client_id,
                    c.email,
                    c.name AS client_name,
                    c.money AS client_balance,
                    COALESCE(SUM(po.amount * p.price), 0) AS total_order_amount,
                    COUNT(DISTINCT o.id) AS number_of_orders
                FROM 
                    Clients c
                LEFT JOIN 
                    Orders o ON c.id = o.client_id
                LEFT JOIN 
                    Product_Orders po ON o.id = po.order_id
                LEFT JOIN 
                    Products p ON po.product_id = p.id
                GROUP BY 
                    c.id
                ORDER BY 
                    c.id;
                """

