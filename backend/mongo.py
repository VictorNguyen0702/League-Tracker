import api_calls
from pymongo import MongoClient
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()
mongoURL = os.getenv("MONGO_URL")
client = MongoClient(mongoURL)



# ------------------------ Functions for Leaderboard ------------------------ #


def get_division_leaderboard(region: str, queue: str, tier: str, division: str) -> dict:
    leaderboard = client["ranks"]["leaderboard"]

    result = leaderboard.find_one(
        {"region": region,
         f"queues.{queue}.tiers.{tier.lower()}.divisions.{division}": {"$exists": True}})
    
    if result:
        division_dict = result.get("queues").get(queue).get("tiers").get(tier.lower()).get("divisions").get(division)
        return division_dict
    else:
        return {}


def download_division_leaderboard(region: str, queue: str, tier: str, division: str) -> dict:
    leaderboard = client["ranks"]["leaderboard"]

    new_users = api_calls.get_league_by_queue(region, queue, tier, division)
    download_time = datetime.now()
    leaderboard.update_one(
        {"region": region},
        {"$set": {
            f"queues.{queue}.tiers.{tier.lower()}.divisions.{division}.users": new_users,
            f"queues.{queue}.tiers.{tier.lower()}.divisions.{division}.last_updated": download_time
            }
        },
        upsert = True
    )

    return {"users": new_users, "last_updated": download_time}

def get_match_history(riot_id: str, route: str, start = 0, count = 20) -> list[str]:
    match_history = client["ranks"]["match_history"]

    result = match_history.find_one(
    {"route": route,
     f"{riot_id}": {"$exists": True}})
    
    if result:
        match_history = {"match_history": result.get(f"{riot_id}").get("match_history")[start:start + count], "last_updated": result.get(f"{riot_id}").get("last_updated")}
        return match_history
    else:
        return {}

def download_match_history(riot_id: str, route: str, start = 0, count = 20) -> list[str]:
    match_history = client["ranks"]["match_history"]

    match_id_list = api_calls.get_match_history(riot_id, route, start, count)
    download_time = datetime.now()
    match_history.update_one(
    {"route": route},
        {"$set": {
            f"{riot_id}.match_history": match_id_list,
            f"{riot_id}.last_updated": download_time
            }
        },
        upsert = True
    )

    return {"match_history": match_id_list, "last_updated": download_time}

print(get_match_history("Vickles#OCE", "SEA"))