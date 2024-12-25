from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
    "BR": "br1",
    "EUNE": "eun1",
    "EUW": "euw1",
    "JP": "jp1",
    "KR": "kr",
    "LAN": "la1",
    "LAS": "la2",
    "ME": "me1",
    "NA": "na1",
    "OCE": "oc1",
    "PH": "ph2",
    "RU": "ru",
    "SG": "sg2",
    "TH": "th2",
    "TR": "tr1",
    "TW": "tw1",
    "VN": "vn2"
}

queue_dict = {
    "SOLO": "RANKED_SOLO_5x5",
    "FLEX": "RANKED_FLEX_SR"
}

routing_dict = {
    "americas": ["NA", "BR", "LAN", "LAS"],
    "asia": ["KR", "JP"],
    "europe": ["EUNE", "EUW", "ME", "TR", "RU"],
    "sea": ["OCE", "PH", "SG", "TH", "TW", "VN"]
}

queue_ids = {
    65: "ARAM",
    450: "ARAM",
    1000: "ARAM",
    400: "Draft Normals",
    420: "Ranked Solo/Duo",
    440: "Ranked Flex",
    430: "Quickplay (Blind Pick)",
    76: "URF (Ultra Rapid Fire)",
    900: "URF (Ultra Rapid Fire)",
    1010: "URF (Ultra Rapid Fire)",
    1900: "URF (Ultra Rapid Fire)",
    1300: "Ultimate Spellbook"
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
    
    return division_dict
    