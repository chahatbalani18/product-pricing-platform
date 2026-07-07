from fastapi import FastAPI
from app.database import Base, engine
from app.routers import product

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Product Pricing & Catalog Intake Platform")

app.include_router(product.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}