from pydantic import BaseModel, Field
from decimal import Decimal
from datetime import datetime
from uuid import UUID
from enum import Enum

class ProductStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class ProductCreate(BaseModel):
    sku: str
    product_name: str
    category: str | None = None
    unit_price: Decimal = Field(gt=0)
    currency: str = "USD"
    submitted_by: str
    region: str | None = None

class ProductUpdate(BaseModel):
    product_name: str | None = None
    category: str | None = None
    unit_price: Decimal | None = Field(default=None, gt=0)
    status: ProductStatus | None = None
    region: str | None = None

class ProductOut(BaseModel):
    id: UUID
    sku: str
    product_name: str
    category: str | None
    unit_price: Decimal
    currency: str
    submitted_by: str
    region: str | None
    status: ProductStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True