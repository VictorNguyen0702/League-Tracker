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


def get_match_history(riot_id: str, route: str, start = 0, count = 15) -> list[str]:
    """
    Returns a list of matchids based on riot id
    """
    riot_account = get_riot_account(riot_id)
    if riot_account is None:
        return
    puu_id = riot_account['puuid']
    url = f"https://{route}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puu_id}/ids?start={start}&count={count}"
    response = requests.get(url, headers = {"X-Riot-Token": API_key})
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error getting summoner ID: {response.status_code}")
        return None
    
def get_match_data(matchid: str, route: str):
    """
    Returns data about a match based on match id
    """
    url = f"https://{route}.api.riotgames.com/lol/match/v5/matches/{matchid}"
    response = requests.get(url, headers = {"X-Riot-Token": API_key})
    if response.status_code == 200:
        response = response.json()
    else:
        print(f"Error getting summoner ID: {response.status_code}")
        return None
    
    match_info = response["info"]

    queue_id = match_info["queueId"]
    game_duration = match_info["gameDuration"]
    teams = match_info["teams"]
    players = match_info["participants"]
    
    for team in teams:
        if team.get("teamId") == 100:
            blue_side_bans = [ban.get("championId", []) for ban in team.get("bans")]
        else:
            red_side_bans = [ban.get("championId", []) for ban in team.get("bans")]

    return_dict = {
        "queue_id": queue_id,
        "game_duration": game_duration,
        "teams": teams,
        "blue_side_bans": blue_side_bans,
        "red_side_bans": red_side_bans,
        "players": players
    }
    
    return return_dict

print(get_match_history("Vickles#OCE", "SEA"))
#print(get_match_data("OC1_651684364", "SEA")