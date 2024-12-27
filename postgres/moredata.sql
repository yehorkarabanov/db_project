-- Insert Manufacturers
INSERT INTO Manufacturers (name, country) VALUES
('Acme Corp', 'USA'),
('TechMakers', 'Germany'),
('BuildWorks', 'China'),
('Global Gadgets', 'Japan'),
('EcoHome', 'Sweden'),
('Innovative Solutions', 'Canada'),
('SmartTools', 'South Korea');

-- Insert Warehouses
INSERT INTO Warehouses (location, capacity) VALUES
('New York', 1000),
('Berlin', 1500),
('Shanghai', 2000),
('Tokyo', 1200),
('Stockholm', 900),
('Toronto', 1100),
('Seoul', 1300);

-- Insert Clients
INSERT INTO Clients (email, name, money) VALUES
('john.doe@example.com', 'John Doe', 5000.00),
('jane.smith@example.com', 'Jane Smith', 3000.00),
('alice.wonder@example.com', 'Alice Wonder', 8000.00),
('mark.brown@example.com', 'Mark Brown', 4500.00),
('lucy.lane@example.com', 'Lucy Lane', 7000.00),
('paul.adams@example.com', 'Paul Adams', 6500.00),
('susan.kim@example.com', 'Susan Kim', 7200.00);

-- Insert Workers
INSERT INTO Worker (name, salary, warehouse_id, supervisor_id) VALUES
('Tom Hardy', 4000, 1, NULL),
('Emily Blunt', 4500, 2, NULL),
('Chris Pratt', 3500, 3, NULL),
('Scarlett Johansson', 5000, 4, NULL),
('Hugh Jackman', 4200, 5, NULL),
('Zendaya Coleman', 3800, 1, 1),
('Robert Downey Jr.', 4700, 2, 2),
('Gal Gadot', 4100, 6, 4),
('Ryan Reynolds', 3900, 7, 5);

-- Insert Types
INSERT INTO Types (name) VALUES
('Electronics'),
('Furniture'),
('Toys'),
('Apparel'),
('Home Appliances'),
('Books'),
('Sports Equipment'),
('Tools');

-- Insert Products
INSERT INTO Products (name, price, place_taken, warehouse_id, manufacturer_id) VALUES
('Smartphone', 699.99, 1, 1, 1),
('Table', 299.99, 2, 2, 2),
('Action Figure', 19.99, 1, 3, 3),
('Jacket', 89.99, 3, 1, 1),
('Blender', 49.99, 2, 4, 4),
('Bookcase', 129.99, 3, 2, 2),
('Laptop', 999.99, 1, 1, 1),
('Novel', 14.99, 1, 5, 5),
('Tennis Racket', 199.99, 1, 6, 6),
('Power Drill', 149.99, 2, 7, 7);

-- Link Products to Types
INSERT INTO Product_Types (product_id, type_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 2),
(7, 1),
(8, 6),
(9, 7),
(10, 8),
(7, 5),
(3, 6),
(9, 1),
(10, 5);

-- Link Warehouses to Types
INSERT INTO Warehouse_Types (warehouse_id, type_id) VALUES
(1, 1),
(2, 2),
(3, 4),
(4, 5),
(5, 6),
(1, 5),
(2, 6),
(3, 1),
(4, 2),
(5, 3),
(6, 7),
(7, 8);

-- Insert Orders
INSERT INTO Orders (client_id, data_arival, worker_id) VALUES
(1, '2024-01-10', 1),
(1, '2024-02-15', 1),
(2, '2024-01-20', 2),
(3, '2024-03-05', 3),
(4, '2024-04-01', 4),
(5, '2024-05-15', 5),
(2, '2024-06-10', 6),
(3, '2024-07-25', 7),
(6, '2024-08-10', 8),
(7, '2024-09-15', 9);

-- Link Products to Orders
INSERT INTO Product_Orders (amount, product_id, order_id) VALUES
(2, 1, 1), -- John ordered 2 Smartphones
(1, 2, 1), -- John ordered 1 Table
(3, 3, 2), -- John ordered 3 Action Figures
(1, 4, 3), -- Jane ordered 1 Jacket
(2, 2, 4), -- Alice ordered 2 Tables
(1, 5, 5), -- Mark ordered 1 Blender
(4, 6, 6), -- Lucy ordered 4 Bookcases
(2, 7, 7), -- Jane ordered 2 Laptops
(3, 8, 8), -- Alice ordered 3 Novels
(1, 3, 8), -- Alice ordered 1 Action Figure in another order
(2, 9, 9), -- Paul ordered 2 Tennis Rackets
(1, 10, 10); -- Susan ordered 1 Power Drill
