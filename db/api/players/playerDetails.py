import requests

def get_player_details(id):
    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/people/{id}")
    data = r.json()["people"][0]
    return {
        "id": id,
        "name": data["fullName"] if check_dict(data, "fullName") else "",
        "number": data["primaryNumber"] if check_dict(data, "primaryNumber") else "",
        "birthDate": data["birthDate"] if check_dict(data, "birthDate") else "",
        "age": data["currentAge"] if check_dict(data, "currentAge") else "",
        "nationality": data["nationality"] if check_dict(data, "nationality") else "",
        "height": data["height"] if check_dict(data, "height") else "",
        "weight": data["weight"] if check_dict(data, "weight") else "",
        "shootsCatches": data["shootsCatches"] if check_dict(data, "shootsCatches") else "",
        "positionCode": data["primaryPosition"]["code"] if check_dict(data, "primaryPosition") else "",
        "positionName": data["primaryPosition"]["name"] if check_dict(data, "primaryPosition") else "",
        "teamID": data["currentTeam"]["id"] if check_dict(data, "currentTeam") else ""
    }

def check_dict(data, key):
    if key in data:
        return True
    return False