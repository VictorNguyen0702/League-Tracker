from fastapi import FastAPI
from pymongo import MongoClient

import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()
mongoURL = os.getenv("MONGO_URL")
    
client = MongoClient(mongoURL)
db = client["mydatabase"] 

app = FastAPI()

