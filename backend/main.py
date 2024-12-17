from fastapi import FastAPI
import mongo
import api_calls
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Replace "*" with your React app's domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------- Dictionaries for regions/queues --------------------- #


region_dict = {
    "NA": "na1",
    "EUW": "euw1",
    "EUNE": "eun1",
    "OCE": "oc1",
    "RU": "ru",
    "TR": "tr1",
    "BR": "br1",
    "LAN": "la1",
    "LAS": "la2",
    "JP": "jp1",
    "TW": "tw1",
    "SG": "sg2",
    "TH": "th2",
    "PH": "ph2",
    "ME": "mea1"
}

queue_dict = {
    "SOLO": "RANKED_SOLO_5x5",
    "FLEX": "RANKED_FLEX_SR"
}

# ---------------------- API Endpoints for Leaderboard ---------------------- #


@app.get("/leaderboard/{region}/{queue}/{tier}/{division}")
def get_division_leaderboard(region: str, queue: str, tier: str, division: str):
    region_param, queue_param = region_dict[region.upper()], queue_dict[queue.upper()]

    division_dict = mongo.get_division_leaderboard(region_param, queue_param, tier, division)
    
    return division_dict
    
@app.post("/leaderboard/{region}/{queue}/{tier}/{division}")
def download_division_leaderboard(region: str, queue: str, tier: str, division: str):
    region_param, queue_param = region_dict[region.upper()], queue_dict[queue.upper()]

    division_dict = mongo.download_division_leaderboard(region_param, queue_param, tier, division)
    