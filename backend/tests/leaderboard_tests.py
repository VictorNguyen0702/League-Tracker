import unittest
from unittest.mock import patch, MagicMock
from datetime import datetime
from pymongo import MongoClient
import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from mongo import get_leaderboard, download_leaderboard
import api_calls

class TestLeaderboardFunctions(unittest.TestCase):
    
    @patch("pymongo.collection.Collection.find_one")
    def test_get_leaderboard_found(self, mock_find_one):
        mock_find_one.return_value = {
            "region": "NA",
            "queues": {
                "RANKED_SOLO_5x5": {
                    "tiers": {
                        "Diamond": {
                            "divisions": {
                                "I": {
                                    "users": {"user1": {"rank": 1, "win_count": 10}}
                                }
                            }
                        }
                    }
                }
            }
        }

        users_dict = get_leaderboard("NA", "RANKED_SOLO_5x5", "Diamond", "I")
        self.assertEqual(users_dict, {"user1": {"rank": 1, "win_count": 10}})
        mock_find_one.assert_called_once_with(
            {"region": "NA", "queues.RANKED_SOLO_5x5.tiers.Diamond.divisions.I": {"$exists": True}}
        )
    
    @patch("pymongo.collection.Collection.find_one")
    def test_get_leaderboard_not_found(self, mock_find_one):
        mock_find_one.return_value = None
        users_dict = get_leaderboard("NA", "RANKED_SOLO_5x5", "Diamond", "I")
        self.assertEqual(users_dict, {})
        mock_find_one.assert_called_once_with(
            {"region": "NA", "queues.RANKED_SOLO_5x5.tiers.Diamond.divisions.I": {"$exists": True}}
        )

    @patch("api_calls.get_league_by_queue")
    @patch("pymongo.collection.Collection.update_one")
    def test_download_leaderboard(self, mock_update_one, mock_get_league_by_queue):
        mock_get_league_by_queue.return_value = {"user1": {"rank": 1, "win_count": 10}}
        
        download_leaderboard("NA", "RANKED_SOLO_5x5", "Diamond", "I")
        
        mock_update_one.assert_called_once_with(
            {"region": "NA"},
            {
                "$set": {
                    "queues.RANKED_SOLO_5x5.tiers.Diamond.divisions.I.users": {"user1": {"rank": 1, "win_count": 10}},
                    "queues.RANKED_SOLO_5x5.tiers.Diamond.divisions.I.last_updated": datetime.now()
                }
            },
            upsert=True
        )
        mock_get_league_by_queue.assert_called_once_with("NA", "RANKED_SOLO_5x5", "Diamond", "I")

    @patch("api_calls.get_league_by_queue")
    @patch("pymongo.collection.Collection.update_one")
    def test_download_leaderboard_empty_users(self, mock_update_one, mock_get_league_by_queue):
        mock_get_league_by_queue.return_value = {}

        download_leaderboard("NA", "RANKED_SOLO_5x5", "Diamond", "I")
        
        mock_update_one.assert_called_once_with(
            {"region": "NA"},
            {
                "$set": {
                    "queues.RANKED_SOLO_5x5.tiers.Diamond.divisions.I.users": {},
                    "queues.RANKED_SOLO_5x5.tiers.Diamond.divisions.I.last_updated": datetime.now()
                }
            },
            upsert=True
        )
        mock_get_league_by_queue.assert_called_once_with("NA", "RANKED_SOLO_5x5", "Diamond", "I")
    
    @patch("api_calls.get_league_by_queue")
    @patch("pymongo.collection.Collection.update_one")
    def test_download_leaderboard_multiple_users(self, mock_update_one, mock_get_league_by_queue):
        mock_get_league_by_queue.return_value = {
            "user1": {"rank": 1, "win_count": 10},
            "user2": {"rank": 2, "win_count": 15}
        }

        download_leaderboard("NA", "RANKED_SOLO_5x5", "Diamond", "I")
        
        mock_update_one.assert_called_once_with(
            {"region": "NA"},
            {
                "$set": {
                    "queues.RANKED_SOLO_5x5.tiers.Diamond.divisions.I.users": {
                        "user1": {"rank": 1, "win_count": 10},
                        "user2": {"rank": 2, "win_count": 15}
                    },
                    "queues.RANKED_SOLO_5x5.tiers.Diamond.divisions.I.last_updated": datetime.now()
                }
            },
            upsert=True
        )
        mock_get_league_by_queue.assert_called_once_with("NA", "RANKED_SOLO_5x5", "Diamond", "I")

    @patch("api_calls.get_league_by_queue")
    @patch("pymongo.collection.Collection.update_one")
    def test_download_leaderboard_no_update(self, mock_update_one, mock_get_league_by_queue):
        mock_get_league_by_queue.return_value = {"user1": {"rank": 1, "win_count": 10}}

        mock_update_one.return_value = MagicMock()

        download_leaderboard("NA", "RANKED_SOLO_5x5", "Diamond", "I")
        
        mock_update_one.assert_called_once_with(
            {"region": "NA"},
            {
                "$set": {
                    "queues.RANKED_SOLO_5x5.tiers.Diamond.divisions.I.users": {"user1": {"rank": 1, "win_count": 10}},
                    "queues.RANKED_SOLO_5x5.tiers.Diamond.divisions.I.last_updated": datetime.now()
                }
            },
            upsert=True
        )
        mock_get_league_by_queue.assert_called_once_with("NA", "RANKED_SOLO_5x5", "Diamond", "I")

    @patch("pymongo.collection.Collection.find_one")
    def test_get_leaderboard_invalid_tier(self, mock_find_one):
        mock_find_one.return_value = None
        users_dict = get_leaderboard("NA", "RANKED_SOLO_5x5", "InvalidTier", "I")
        self.assertEqual(users_dict, {})
        mock_find_one.assert_called_once_with(
            {"region": "NA", "queues.RANKED_SOLO_5x5.tiers.InvalidTier.divisions.I": {"$exists": True}}
        )

    @patch("pymongo.collection.Collection.find_one")
    def test_get_leaderboard_invalid_queue(self, mock_find_one):
        mock_find_one.return_value = None
        users_dict = get_leaderboard("NA", "InvalidQueue", "Diamond", "I")
        self.assertEqual(users_dict, {})
        mock_find_one.assert_called_once_with(
            {"region": "NA", "queues.InvalidQueue.tiers.Diamond.divisions.I": {"$exists": True}}
        )

if __name__ == "__main__":
    unittest.main()
