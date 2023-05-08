import requests

def get_team_roster(id, year):
    try:
        r = requests.get(f"https://statsapi.web.nhl.com/api/v1/teams/{id}?expand=team.roster&season={year}")
        r.raise_for_status()
        data = r.json()
        roster = data["teams"][0]["roster"]["roster"]
        players = []
        for person in roster:
            players.append(person["person"]["id"])
        return players
    except:
        print(f"year {year} doesn't exist for {id}")

    