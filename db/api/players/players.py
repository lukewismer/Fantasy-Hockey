

import time, sys
import requests

from Player import Player
from playerStats import get_player_stats
from playerDetails import get_player_details

sys.path.insert(0,"../teams")



def get_player_ids():
    # Gets all player ids for the league

    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster")
    data = r.json()
    player_ids = []
    for team in data["teams"]:
        player_ids.append([player["person"]["id"] for player in team["roster"]["roster"]])
    return sum(player_ids, []) # Flatten 2d list https://www.geeksforgeeks.org/python-ways-to-flatten-a-2d-list/
        


if __name__ == "__main__":
    # Team Data takes about 30 seconds
    start_time = time.time()
    ids = get_player_ids()
    players = [Player(id) for id in ids]

    for player in players:
        print(player.getId())
        player.setDetails(get_player_details(player.getId()))
        if (player.getPosition() != "G"):
            player.setStats(get_player_stats(player.getId()))

    print("Player data takes this many seconds: " + str(time.time() - start_time))