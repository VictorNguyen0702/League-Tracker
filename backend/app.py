from fastapi import FastAPI
from pydantic import BaseModel
import motor.motor_asyncio

# MongoDB connection
client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")
db = client["mydatabase"]

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str

@app.post("/items/")
async def create_item(item: Item):
    db_item = await db.items.insert_one(item.dict())
    return {"item_id": str(db_item.inserted_id)}

@app.get("/items/{item_id}")
async def get_item(item_id: str):
    item = await db.items.find_one({"_id": item_id})
    if item is None:
        return {"error": "Item not found"}
    return item
