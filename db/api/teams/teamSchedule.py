import requests


## TO-DO make the schedule
def get_team_schedule(id):
    
    start_date = "2022-10-07" # Start date of NHL season 2022
    end_date = "2023-04-16" # End date of NHL season 2023
    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/schedule?teamId={id}&startDate={start_date}&endDate={end_date}")
    data = r.json()["dates"]
    return_data = {"dates": []}
    for date in data:
        game = date["games"][0]
        return_data["dates"].append({"date": date["date"], "id": game["gamePk"], "home": {"id": game["teams"]["home"]["team"]["id"], "score": game["teams"]["home"]["score"]}, "away": {"id": game["teams"]["away"]["team"]["id"], "score": game["teams"]["away"]["score"]} })
    
    return return_data


