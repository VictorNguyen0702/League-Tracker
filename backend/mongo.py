import api_calls
from pymongo import MongoClient
import os
import datetime
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()
mongoURL = os.getenv("MONGO_URL")
    
client = MongoClient(mongoURL)


def save_leaderboard(region: str, queue: str, tier: str, division: str = "I") -> None:
    leaderboard = client["ranks"]["leaderboard"]

    new_users = api_calls.get_league_by_queue(region, queue, tier, division)
    leaderboard.update_one(
        {"region": region},
        {"$set": {
            f"queues.{queue}.tiers.{tier}.divisions.{division}.users": new_users,
            f"queues.{queue}.tiers.{tier}.divisions.{division}.last_updated": datetime.datetime.now()
            }
        },
        upsert = True
    )