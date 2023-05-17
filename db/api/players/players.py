

import time, sys
import requests

from Player import Player
from playerStats import get_player_stats
from playerDetails import get_player_details
from playerSeasonStats import get_player_seasonStats
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("../serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db=firestore.client()

players_collection = db.collection("players")
active_players_collection = db.collection('active_players')
old_players_collection = db.collection('old_players')
teams_collection = db.collection('teams_v2')


def get_player_ids():
    players = [player.to_dict()["player_details"]["id"] for player in active_players_collection.get()]
    teams = teams_collection.get()
    ids = set()

    for team in teams:
        team = team.to_dict()
        for year_name, year_data in team["years"].items():
            
            if (year_data["Roster"] and year_data["Roster"] != None):
                for player in year_data["Roster"]:
                    if (player  in players):
                        ids.add(player)
    return ids

if __name__ == "__main__":
    # Player Data takes about 200 seconds
    start_time = time.time()
    ids = get_player_ids()
    print(len(ids))
    players = [Player(id) for id in ids]
    counter = 0

    for player in players:
        counter +=1
        print(str(player.get_id()) + " Count: " + str(counter))
        player.set_details(get_player_details(player.get_id()))
        player.set_seasonStats(get_player_seasonStats(player.get_id(), player.get_position() != "G"))
        

        data = {"player_details": player.get_details(), "player_seasonStats": player.get_seasonStats()}

        
        if player.get_details()["active"] == True:
            active_players_collection.document(str(player.get_id())).set(data, merge=True)
        #else:
        #    old_players_collection.document(str(player.get_id())).set(data, merge=True)

    print("Player data takes this many seconds: " + str(time.time() - start_time))