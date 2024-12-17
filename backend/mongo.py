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
         f"queues.{queue}.tiers.{tier}.divisions.{division}": {"$exists": True}})
    
    if result:
        division_dict = result.get("queues").get(queue).get("tiers").get(tier).get("divisions").get(division)
        return division_dict
    else:
        return {}


def download_division(region: str, queue: str, tier: str, division: str) -> None:
    leaderboard = client["ranks"]["leaderboard"]

    new_users = api_calls.get_league_by_queue(region, queue, tier, division)
    leaderboard.update_one(
        {"region": region},
        {"$set": {
            f"queues.{queue}.tiers.{tier}.divisions.{division}.users": new_users,
            f"queues.{queue}.tiers.{tier}.divisions.{division}.last_updated": datetime.now()
            }
        },
        upsert = True
    )

