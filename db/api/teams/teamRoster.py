import requests

def get_team_roster(id):
    if (id == 11):
        return []
    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/teams/{id}?expand=team.roster")
    data = r.json()
    roster = data["teams"][0]["roster"]["roster"]
    players = []
    for person in roster:
        players.append(person["person"]["id"])

    return players