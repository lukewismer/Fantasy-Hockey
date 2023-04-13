import requests

def get_team_stats(id):

    years = ["20002001", "20012002", "20022003", "20032004", "20042005", "20052006", "20062007", "20072008", "20082009", "20092010", "20102011",
             "20112012", "20122013", "20132014", "20142015", "20152016", "20162017", "20172018", "20182019", "20192020", "20202021", "20212022", "20222023"]
    stats = []
    for year in years:
        try:
            r = requests.get(f"https://statsapi.web.nhl.com/api/v1/teams/{id}?expand=team.stats&season={year}")
            r.raise_for_status()
            data = r.json()
            if (data):
                temp_data = data["teams"][0]["teamStats"][0]["splits"][0]["stat"]
                temp_data["season"] = year
                stats.append(temp_data)
                
        except:
            print(f"year {year} doesn't exist for {id}")

    return stats