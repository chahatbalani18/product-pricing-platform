from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import product

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Product Pricing & Catalog Intake Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(product.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}