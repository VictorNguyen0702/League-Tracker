import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()
API_key = os.getenv("RIOT_API_KEY")

regions_dict = {
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

def get_league_by_queue(tier: str, queue: str, region: str, division: str = "I"):
    """
    Returns a list of players in a certain rank of a queue type for one region

    Parameters:
    league (str): The rank to be filtered by (master, grandmaster or challenger)
    queue (str): The type of queue (ranked solo or flex)
    region (str): The region in which the search is done
    division (str): The division of the rank (only applies for lower than master)

    Returns:
    Dictionary: The data of summoners in the league and queue type
    """

    queue_param = ""
    if queue == "solo":
        queue_param = "RANKED_SOLO_5x5"
    elif queue == "flex":
        queue_param = "RANKED_FLEX_SR"

    region_param = regions_dict[region]
    
    if tier in ["master", "grandmaster", "challenger"]:
        url = f"https://{region_param}.api.riotgames.com/lol/league/v4/{tier}leagues/by-queue/{queue_param}"
    else:
        url = f"https://{region_param}.api.riotgames.com/lol/league/v4/entries/{queue_param}/{tier.upper()}/{division}"
    
    response = requests.get(url, headers = {"X-Riot-Token": API_key})

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error {response.status_code}: {response.json()}")
        return None

