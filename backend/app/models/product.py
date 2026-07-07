import uuid
from sqlalchemy import Column, String, Numeric, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import enum
from app.database import Base

class ProductStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class Product(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sku = Column(String, unique=True, nullable=False, index=True)
    product_name = Column(String, nullable=False)
    category = Column(String, nullable=True)
    unit_price = Column(Numeric(10, 2), nullable=False)
    currency = Column(String, default="USD", nullable=False)
    submitted_by = Column(String, nullable=False)
    region = Column(String, nullable=True)
    status = Column(Enum(ProductStatus), default=ProductStatus.pending, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())