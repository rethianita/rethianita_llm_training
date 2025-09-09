from contextlib import asynccontextmanager
from typing import List

from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from config import settings
from database import Product, CartItem, create_tables, get_db

from fastapi.middleware.cors import CORSMiddleware

class ProductCreate(BaseModel):
    name: str
    price: float
    description: str | None = None
    stock: int

class ProductUpdate(BaseModel):
    name: str | None = None
    price: float | None = None
    description: str | None = None
    stock: int | None = None


class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    description: str | None = None
    stock: int

    class Config:
        from_attributes = True  


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    product: ProductResponse

    class Config:
        from_attributes = True


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI Template"}


@app.post("/products/", response_model=ProductResponse)
async def create_product(product: ProductCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).filter(Product.name == product.name))
    db_product = result.first()

    if db_product:
        raise HTTPException(status_code=400, detail="Product already exists")

    db_product = Product(name=product.name, price=product.price, description=product.description, stock=product.stock)
    db.add(db_product)
    await db.commit()
    await db.refresh(db_product)
    return db_product


@app.get("/products/", response_model=List[ProductResponse])
async def get_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product))
    products = result.scalars().all()
    return products


@app.get("/products/{product_id}", response_model=ProductResponse)
async def get_product_by_id(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).filter(Product.id == product_id))
    db_product = result.scalar_one_or_none()

    if db_product is None:
        raise HTTPException(status_code=404, detail=f'Product with id {product_id} not found')
    return db_product


@app.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(product_id: int, product: ProductUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).filter(Product.id == product_id))
    db_product = result.scalar_one_or_none()

    if db_product is None:
        raise HTTPException(status_code=404, detail=f'Product with id {product_id} not found')
    
    if product is None:
        return db_product
    
    if product.name:
        db_product.name = product.name
    
    if product.price:
        db_product.price = product.price
    
    if product.description:
        db_product.description = product.description
    
    if product.stock:
        db_product.stock = product.stock
    
    db.commit()
    db.refresh(db_product)

    return db_product


@app.delete("/products/{product_id}")
async def delete_product_by_id(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).filter(Product.id == product_id))
    db_product = result.scalar_one_or_none()

    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    await db.delete(db_product)
    await db.commit()
    return {"detail": f"Product {product_id} deleted successfully"}


# Cart endpoints
@app.post("/cart/add", response_model=CartItemResponse)
async def add_to_cart(cart_item: CartItemCreate, db: AsyncSession = Depends(get_db)):
    # Check if product exists and has sufficient stock
    result = await db.execute(select(Product).filter(Product.id == cart_item.product_id))
    product = result.scalar_one_or_none()
    
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product.stock < cart_item.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    
    # Check if item already exists in cart
    result = await db.execute(select(CartItem).filter(CartItem.product_id == cart_item.product_id))
    existing_cart_item = result.scalar_one_or_none()
    
    if existing_cart_item:
        # Update quantity
        if product.stock < existing_cart_item.quantity + cart_item.quantity:
            raise HTTPException(status_code=400, detail="Insufficient stock")
        existing_cart_item.quantity += cart_item.quantity
        db_cart_item = existing_cart_item
    else:
        # Create new cart item
        db_cart_item = CartItem(product_id=cart_item.product_id, quantity=cart_item.quantity)
        db.add(db_cart_item)
    
    # Update product stock
    product.stock -= cart_item.quantity
    
    await db.commit()
    await db.refresh(db_cart_item)
    
    # Fetch the cart item with product details
    result = await db.execute(
        select(CartItem).options(selectinload(CartItem.product)).filter(CartItem.id == db_cart_item.id)
    )
    cart_item_with_product = result.scalar_one()
    
    return cart_item_with_product


@app.get("/cart/", response_model=List[CartItemResponse])
async def get_cart_items(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CartItem).options(selectinload(CartItem.product)))
    cart_items = result.scalars().all()
    return cart_items


@app.delete("/cart/{item_id}")
async def remove_from_cart(item_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CartItem).filter(CartItem.id == item_id))
    cart_item = result.scalar_one_or_none()
    
    if cart_item is None:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    # Restore product stock
    result = await db.execute(select(Product).filter(Product.id == cart_item.product_id))
    product = result.scalar_one_or_none()
    if product:
        product.stock += cart_item.quantity
    
    await db.delete(cart_item)
    await db.commit()
    return {"detail": "Item removed from cart"}


@app.delete("/cart/")
async def clear_cart(db: AsyncSession = Depends(get_db)):
    # Restore stock for all cart items
    result = await db.execute(select(CartItem))
    cart_items = result.scalars().all()
    
    for cart_item in cart_items:
        result = await db.execute(select(Product).filter(Product.id == cart_item.product_id))
        product = result.scalar_one_or_none()
        if product:
            product.stock += cart_item.quantity
        await db.delete(cart_item)
    
    await db.commit()
    return {"detail": "Cart cleared"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
