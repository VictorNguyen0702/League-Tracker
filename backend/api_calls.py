import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()
API_key = os.getenv("RIOT_API_KEY")


# --------------- Helper Functions for puu id and summoner id --------------- #


def get_riot_account(riot_id:str):
    """
    Returns the riot account depending on riot id
    """
    gameName, tagLine = riot_id.split("#")
    url = f"https://americas.api.riotgames.com//riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}"

    response = requests.get(url, headers = {"X-Riot-Token": API_key})
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error getting riot account {response.status_code}")
        return None
    

def get_encrypted_summoner_id(riot_id: str, region: str) -> str:
    """
    Returns the summoner id of a summoner 
    """

    riot_account = get_riot_account(riot_id)
    if riot_account is None:
        return
    puu_id = riot_account['puuid']

    url = f"https://{region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puu_id}"

    response = requests.get(url, headers = {"X-Riot-Token": API_key})
    if response.status_code == 200:
        return response.json()["id"]
    else:
        print(f"Error getting summoner ID: {response.status_code}")
        return None


# --------------------- Function to Return League Queue --------------------- #


def get_league_by_queue(region: str, queue: str, tier: str, division: str) -> dict | None:
    """
    Returns a list of players in a certain rank of a queue type for one region
    """

    if tier.upper() in ["MASTER", "GRANDMASTER", "CHALLENGER"]:
        url = f"https://{region}.api.riotgames.com/lol/league/v4/{tier.lower()}leagues/by-queue/{queue}"
    else:
        url = f"https://{region}.api.riotgames.com/lol/league/v4/entries/{queue}/{tier.upper()}/{division}"

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

    encrypted_summoner_id = get_encrypted_summoner_id(riot_id, region)
    url = f"https://{region}.api.riotgames.com/lol/league/v4/entries/by-summoner/{encrypted_summoner_id}"

    response = requests.get(url, headers = {"X-Riot-Token": API_key})
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error getting summoner ID: {response.status_code}")
        return None


def get_match_history(puiid: str) -> list[str]:
    """
    Returns a list of matchids based on puuid
    """
    pass