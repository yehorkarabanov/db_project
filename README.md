# Warehouse Management System

A comprehensive warehouse management system built with FastAPI, React, and PostgreSQL.

## Features

* Product inventory management
* Order processing and tracking
* Client management
* Worker assignment and supervision
* Warehouse capacity tracking
* Multi-type product categorization

## Technology Stack

* **Backend**: FastAPI (Python)
* **Frontend**: React, Shadcn, Tailwind CSS
* **Database**: PostgreSQL
* **Containerization**: Docker

## Project Structure

```
├── backend/          # FastAPI application  
├── frontend/         # React application  
├── postgres/         # Database initialization scripts  
└── docker-compose.yaml # Docker configuration  
```

## Getting Started

### Prerequisites

* Docker and Docker Compose
* Node.js (for local frontend development)
* Python 3.12+ (for local backend development)

### Setup

1. Clone the repository:

```bash
git clone <your-repo-url>  
cd <your-repo-name>
```

2. Start the application using Docker Compose:

```bash
docker-compose up -d
```

3. Access the application:
   * Frontend: http://localhost:5173
   * Backend API: http://localhost:8080/api

## API Endpoints

The API includes endpoints for managing:
* Products
* Orders
* Clients
* Workers
* Types

## Database Schema

The system uses a relational database with tables for:
* Manufacturers
* Warehouses
* Clients
* Workers
* Orders
* Products
* Types and various relationship tables

## License

[MIT](LICENSE)

 
