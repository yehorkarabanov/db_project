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

-- Function to reassign orders and update worker hierarchy when a worker is deleted
CREATE OR REPLACE FUNCTION trigger_on_worker_deletion()
RETURNS TRIGGER AS $$
DECLARE
    supervisor_exists BOOLEAN;
    new_worker_id INT;
BEGIN
    -- First handle subordinates
    IF EXISTS (SELECT 1 FROM Workers WHERE supervisor_id = OLD.id) THEN
        IF OLD.supervisor_id IS NOT NULL THEN
            -- Transfer subordinates to the deleted worker's supervisor
            UPDATE Workers
            SET supervisor_id = OLD.supervisor_id
            WHERE supervisor_id = OLD.id;
        ELSE
            -- If no supervisor exists, remove supervisor reference
            UPDATE Workers
            SET supervisor_id = NULL
            WHERE supervisor_id = OLD.id;
        END IF;
    END IF;

    -- Then handle orders reassignment
    IF EXISTS (SELECT 1 FROM Orders WHERE worker_id = OLD.id) THEN
        -- Check if supervisor exists
        SELECT EXISTS (
            SELECT 1 FROM Workers WHERE id = OLD.supervisor_id
        ) INTO supervisor_exists;

        IF supervisor_exists THEN
            -- Assign to supervisor
            UPDATE Orders
            SET worker_id = OLD.supervisor_id
            WHERE worker_id = OLD.id;
        ELSE
            -- Try to find another worker in the same warehouse
            SELECT id INTO new_worker_id
            FROM Workers
            WHERE warehouse_id = OLD.warehouse_id
                AND id != OLD.id
                AND id != OLD.supervisor_id
            LIMIT 1;

            -- If no worker in same warehouse, find any worker without supervisor
            IF new_worker_id IS NULL THEN
                SELECT id INTO new_worker_id
                FROM Workers
                WHERE supervisor_id IS NULL
                    AND id != OLD.id
                LIMIT 1;
            END IF;

            -- Update orders with new worker if found
            IF new_worker_id IS NOT NULL THEN
                UPDATE Orders
                SET worker_id = new_worker_id
                WHERE worker_id = OLD.id;
            END IF;
        END IF;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that fires before worker deletion
CREATE OR REPLACE TRIGGER before_worker_deletion
BEFORE DELETE ON Workers
FOR EACH ROW
EXECUTE FUNCTION trigger_on_worker_deletion();
