

import time, sys
import requests

from Player import Player
from playerStats import get_player_stats
from playerDetails import get_player_details
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("../serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db=firestore.client()

players_collection = db.collection('players')


def get_player_ids():
    # Gets all player ids for the league
    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster")
    data = r.json()
    player_ids = []
    for team in data["teams"]:
        player_ids.append([player["person"]["id"] for player in team["roster"]["roster"]])
    return sum(player_ids, []) # Flatten 2d list https://www.geeksforgeeks.org/python-ways-to-flatten-a-2d-list/
        

def get_all_players_data():
    ids = get_player_ids()
    players = [Player(id) for id in ids]

    for player in players:
        print(player.get_id())
        player.setDetails(get_player_details(player.get_id()))
        player.setStats(get_player_stats(player.get_id(), player.getPosition() != "G"))

    return players

if __name__ == "__main__":
    # Player Data takes about 200 seconds
    start_time = time.time()
    ids = get_player_ids()
    players = [Player(id) for id in ids]

    for player in players:
        print(player.get_id())
        player.set_details(get_player_details(player.get_id()))
        player.set_stats(get_player_stats(player.get_id(), player.get_position() != "G"))

        data = {"player_details": player.get_details(), "player_stats": player.get_stats()}
        players_collection.document(str(player.get_id())).set(data)

    print("Player data takes this many seconds: " + str(time.time() - start_time))