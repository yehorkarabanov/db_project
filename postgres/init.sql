CREATE TABLE IF NOT EXISTS Manufacturers (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    country VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS Warehouses (
    id SERIAL PRIMARY KEY,
    location VARCHAR NOT NULL,
    capacity INT NOT NULL
);

CREATE TABLE IF NOT EXISTS Clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    money FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS Orders (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES Clients(id),
    data_arival DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS Product (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    price FLOAT NOT NULL,
    place_taken INT NOT NULL,
    warehouse_id INT NOT NULL REFERENCES Warehouses(id),
    manufacturer_id INT NOT NULL REFERENCES Manufacturers(id)
);

CREATE TABLE IF NOT EXISTS Types (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS Worker (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    salary INT NOT NULL,
    warehouse_id INT NOT NULL REFERENCES Warehouses(id),
    supervisor_id INT REFERENCES Worker(id),
    order_id INT REFERENCES Orders(id)
);

CREATE TABLE IF NOT EXISTS Product_Types (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    product_id INT NOT NULL REFERENCES Product(id),
    type_id INT NOT NULL REFERENCES Types(id)
);

CREATE TABLE IF NOT EXISTS Product_Orders (
    id SERIAL PRIMARY KEY,
    amount INT NOT NULL,
    product_id INT NOT NULL REFERENCES Product(id),
    order_id INT NOT NULL REFERENCES Orders(id)
);

CREATE TABLE IF NOT EXISTS Warehouse_Types (
    id SERIAL PRIMARY KEY,
    warehouse_id INT NOT NULL REFERENCES Warehouses(id),
    type_id INT NOT NULL REFERENCES Types(id)
);
