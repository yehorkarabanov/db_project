from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.settings import settings
from app.products.api import router as products_router
from app.orders.api import router as orders_router
from app.clients.api import router as clients_router
from app.workers.api import router as workers_router
from app.types.api import router as types_router

app = FastAPI(root_path='/api')
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(products_router)
app.include_router(orders_router)
app.include_router(clients_router)
app.include_router(workers_router)
app.include_router(types_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True, proxy_headers=True)
