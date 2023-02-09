

import time, sys
import requests

sys.path.insert(0,"../teams")



def get_player_ids():
    # Gets all player ids for the league

    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster")
    data = r.json()
    player_ids = []
    for team in data["teams"]:
        player_ids.append([player["person"]["id"] for player in team["roster"]["roster"]])
    return player_ids
        


if __name__ == "__main__":
    # Team Data takes about 30 seconds
    start_time = time.time()
    print(get_player_ids())

    print("Player data takes this many seconds: " + str(time.time() - start_time))