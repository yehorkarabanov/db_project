-- Manufacturers Table
CREATE TABLE IF NOT EXISTS Manufacturers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    country VARCHAR(100) NOT NULL
);

-- Warehouses Table
CREATE TABLE IF NOT EXISTS Warehouses (
    id SERIAL PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0)
);

-- Clients Table
CREATE TABLE IF NOT EXISTS Clients (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    money DECIMAL(10, 2) NOT NULL CHECK (money >= 0)
);

-- Workers Table
CREATE TABLE IF NOT EXISTS Workers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL CHECK (salary > 0),
    warehouse_id INT REFERENCES Warehouses(id) ON DELETE SET NULL,
    supervisor_id INT REFERENCES Workers(id) ON DELETE SET NULL
        CHECK (id <> supervisor_id),
    CONSTRAINT unique_worker_name_warehouse UNIQUE (name, warehouse_id)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS Orders (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES Clients(id) ON DELETE CASCADE,
    data_arival DATE NOT NULL,
    worker_id INT REFERENCES Workers(id) ON DELETE SET NULL
);

-- Products Table
CREATE TABLE IF NOT EXISTS Products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    place_taken INT NOT NULL CHECK (place_taken > 0),
    warehouse_id INT NOT NULL REFERENCES Warehouses(id) ON DELETE CASCADE,
    manufacturer_id INT NOT NULL REFERENCES Manufacturers(id) ON DELETE CASCADE
);

-- Types Table
CREATE TABLE IF NOT EXISTS Types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Product_Types Table
CREATE TABLE IF NOT EXISTS Product_Types (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES Products(id) ON DELETE CASCADE,
    type_id INT NOT NULL REFERENCES Types(id) ON DELETE CASCADE,
    CONSTRAINT unique_product_type UNIQUE (product_id, type_id)
);

-- Product_Orders Table
CREATE TABLE IF NOT EXISTS Product_Orders (
    id SERIAL PRIMARY KEY,
    amount INT NOT NULL CHECK (amount > 0),
    product_id INT NOT NULL REFERENCES Products(id) ON DELETE CASCADE,
    order_id INT NOT NULL REFERENCES Orders(id) ON DELETE CASCADE,
    CONSTRAINT unique_product_order UNIQUE (product_id, order_id)
);

-- Warehouse_Types Table
CREATE TABLE IF NOT EXISTS Warehouse_Types (
    id SERIAL PRIMARY KEY,
    warehouse_id INT NOT NULL REFERENCES Warehouses(id) ON DELETE CASCADE,
    type_id INT NOT NULL REFERENCES Types(id) ON DELETE CASCADE,
    CONSTRAINT unique_warehouse_type UNIQUE (warehouse_id, type_id)
);

-- Indexes for Optimized Queries
CREATE INDEX idx_clients_email ON Clients (email);
CREATE INDEX idx_products_name ON Products (name);
CREATE INDEX idx_orders_client_id ON Orders (client_id);
CREATE INDEX idx_workers_warehouse_id ON Workers (warehouse_id);
CREATE INDEX idx_product_orders_order_id ON Product_Orders (order_id);
