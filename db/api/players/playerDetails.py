import requests

def get_player_details(id):
    def check_dict(data, key):
        return key in data

    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/people/{id}")
    data = r.json()["people"][0]
    return {
        "id": id,
        "name": data.get("fullName", ""),
        "number": data.get("primaryNumber", ""),
        "birthDate": data.get("birthDate", ""),
        "age": data.get("currentAge", ""),
        "nationality": data.get("nationality", ""),
        "height": data.get("height", ""),
        "weight": data.get("weight", ""),
        "shootsCatches": data.get("shootsCatches", ""),
        "positionCode": data["primaryPosition"]["code"] if check_dict(data, "primaryPosition") else "",
        "positionName": data["primaryPosition"]["name"] if check_dict(data, "primaryPosition") else "",
        "teamID": data["currentTeam"]["id"] if check_dict(data, "currentTeam") else "",
        "active": data["active"]
    }
