import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()
API_key = os.getenv("RIOT_API_KEY")

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
    "solo": "RANKED_SOLO_5x5",
    "flex": "RANKED_FLEX_SR"
}


def get_puuid(riot_id:str):
    """
    Returns the puuid of a riot account depending on riot id
    """
    gameName, tagLine = riot_id.split("#")
    url = f"https://americas.api.riotgames.com//riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}"

    response = requests.get(url, headers = {"X-Riot-Token": API_key})
    if response.status_code == 200:
        return response.json()['puuid']
    else:
        print(f"Error getting PUU ID: {response.status_code}")
        return None
    

def get_encrypted_summoner_id(riot_id: str, region: str) -> str:
    """
    Returns the summoner id of a summoner 
    """

    region_param = region_dict[region]
    puu_id = get_puuid(riot_id)

    url = f"https://{region_param}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puu_id}"

    response = requests.get(url, headers = {"X-Riot-Token": API_key})
    if response.status_code == 200:
        return response.json()["id"]
    else:
        print(f"Error getting summoner ID: {response.status_code}")
        return None


def get_league_by_queue(tier: str, queue: str, region: str, division: str = "I") -> dict | None:
    """
    Returns a list of players in a certain rank of a queue type for one region
    """

    queue_param, region_param = queue_dict[queue], region_dict[region]
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

def get_league_entries_by_name(riot_id: str, region: str):
    """
    Returns the league entries of a specific summoner
    """

    region_param = region_dict[region]
    encrypted_summoner_id = get_encrypted_summoner_id(riot_id, region)
    url = f"https://{region_param}.api.riotgames.com/lol/league/v4/entries/by-summoner/{encrypted_summoner_id}"

    response = requests.get(url, headers = {"X-Riot-Token": API_key})
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error getting summoner ID: {response.status_code}")
        return None

print(get_league_entries_by_name("Vickles#OCE", "OCE"))
