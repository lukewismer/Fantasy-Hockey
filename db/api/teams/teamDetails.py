import requests


def get_team_details(id):
    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/teams/{id}")
    data = r.json()["teams"][0]
    return {"id": id, "name": data["name"], "conference": check_if_exists("name", data["conference"]), "division": check_if_exists("name", data["division"]), "abbreviation": data["abbreviation"]}
    

def check_if_exists(string_to_check, value):
    if (string_to_check in value):
        return value[string_to_check]
    else:
        return ""