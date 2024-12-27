-- Inserting sample data into Manufacturers table
INSERT INTO Manufacturers (name, country)
VALUES ('Acme Corp', 'USA'),
       ('Global Electronics', 'Germany'),
       ('Tech Solutions', 'India'),
       ('Home Goods Ltd.', 'Canada'),
       ('Fashion Wear', 'Italy');

-- Inserting sample data into Warehouses table
INSERT INTO Warehouses (location, capacity)
VALUES ('New York, USA', 1000),
       ('Berlin, Germany', 800),
       ('Mumbai, India', 1500),
       ('Toronto, Canada', 1200),
       ('Rome, Italy', 600);

-- Inserting sample data into Clients table
INSERT INTO Clients (name, money, email)
VALUES
    ('John Doe', 1500.75, 'john.doe@example.com'),
    ('Jane Smith', 1200.50, 'jane.smith@example.com'),
    ('Michael Brown', 5000.00, 'michael.brown@example.com'),
    ('Emily Davis', 2200.30, 'emily.davis@example.com'),
    ('William Harris', 350.25, 'william.harris@example.com');

-- Inserting sample data into Worker table
INSERT INTO Worker (name, salary, warehouse_id, supervisor_id)
VALUES ('Alice Johnson', 3000, 1, NULL),
       ('Bob Williams', 2800, 2, 1),
       ('Charlie Lee', 2500, 3, 1),
       ('David Clark', 2700, 4, 2),
       ('Eve Harris', 2300, 5, 3);

-- Inserting sample data into Types table
INSERT INTO Types (name)
VALUES ('Electronics'),
       ('Furniture'),
       ('Clothing'),
       ('Food'),
       ('Toys');

-- Inserting sample data into Product table
INSERT INTO Products (name, price, place_taken, warehouse_id, manufacturer_id)
VALUES ('Laptop', 800.00, 50, 1, 1),
       ('Smartphone', 500.00, 30, 2, 2),
       ('Sofa', 300.00, 20, 3, 3),
       ('Shirt', 25.00, 10, 4, 4),
       ('Toy Car', 15.00, 5, 5, 5);

-- Inserting sample data into Product_Types table
INSERT INTO Product_Types (name, product_id, type_id)
VALUES ('Laptop', 1, 1),
       ('Smartphone', 2, 1),
       ('Sofa', 3, 2),
       ('Shirt', 4, 3),
       ('Toy Car', 5, 5);

-- Inserting sample data into Orders table
INSERT INTO Orders (client_id, data_arival, worker_id)
VALUES (1, '2024-12-01', 1),
       (2, '2024-12-05', 2),
       (3, '2024-12-10', 3),
       (4, '2024-12-15', 4),
       (5, '2024-12-20', 5);

-- Inserting sample data into Product_Orders table
INSERT INTO Product_Orders (amount, product_id, order_id)
VALUES (2, 1, 1),
       (1, 2, 2),
       (5, 3, 3),
       (3, 4, 4),
       (10, 5, 5);

-- Inserting sample data into Warehouse_Types table
INSERT INTO Warehouse_Types (warehouse_id, type_id)
VALUES (1, 1),
       (2, 1),
       (3, 2),
       (4, 3),
       (5, 5);
