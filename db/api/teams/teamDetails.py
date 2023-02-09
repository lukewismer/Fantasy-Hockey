import requests


def get_team_details(id):
    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/teams/{id}")
    data = r.json()["teams"][0]
    return {"id": id, "name": data["name"], "conference": data["conference"]["name"], "division": data["division"]["name"], "abbreviation": data["abbreviation"]}
    

