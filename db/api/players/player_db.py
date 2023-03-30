import time, requests
from Player import Player
from playerDetails import get_player_details
from playerStats import get_player_stats
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

class PlayerDatabase:
    def __init__(self, service_account_key_path):
        if not firebase_admin._apps:
            # Initialize the app if it is not already initialized
            cred = credentials.Certificate(service_account_key_path)
            firebase_admin.initialize_app(cred)
        self.db = firestore.client()
        self.players_collection = self.db.collection('players')

    def get_player_ids(self):
        r = requests.get(f"https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster")
        data = r.json()
        player_ids = []
        for team in data["teams"]:
            player_ids.append([player["person"]["id"] for player in team["roster"]["roster"]])
        return sum(player_ids, [])

    def get_all_players_data(self):
        ids = self.get_player_ids()
        players = [Player(id) for id in ids]

        for player in players:
            print(player.get_id())
            player.set_details(get_player_details(player.get_id()))
            player.set_stats(get_player_stats(player.get_id(), player.get_position() != "G"))

        return players

    def store_players_data(self, players):
        for player in players:
            data = {"player_details": player.get_details(), "player_stats": player.get_stats()}
            self.players_collection.document(str(player.get_id())).set(data)

if __name__ == "__main__":
    database = PlayerDatabase("../serviceAccountKey.json")
    start_time = time.time()
    players = database.get_all_players_data()
    database.store_players_data(players)
    print("Player data takes this many seconds: " + str(time.time() - start_time))
