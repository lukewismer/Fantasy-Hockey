import requests

def get_team_stats(id):
    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/teams/{id}?expand=team.stats")
    data = r.json()
    return data["teams"][0]["teamStats"][0]["splits"][0]["stat"]