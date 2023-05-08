import requests

def get_team_stats(id, year):

    try:
        r = requests.get(f"https://statsapi.web.nhl.com/api/v1/teams/{id}?expand=team.stats&season={year}")
        r.raise_for_status()
        data = r.json()
        if (data):
            temp_data = data["teams"][0]["teamStats"][0]["splits"][0]["stat"]
            temp_data["season"] = year
            return temp_data
    except:
        print(f"year {year} doesn't exist for {id}")

    