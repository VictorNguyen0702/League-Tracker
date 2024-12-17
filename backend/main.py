from fastapi import FastAPI


app = FastAPI()


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
    "solo": "RANKED_SOLO_5x5",
    "flex": "RANKED_FLEX_SR"
}