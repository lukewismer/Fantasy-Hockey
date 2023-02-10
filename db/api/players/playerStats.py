import requests

def get_player_stats(id):
    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/people/{id}/stats?stats=yearByYear")
    data = r.json()["stats"][0]["splits"]
    stats = []
    for season in data:
        if season["league"]["name"] == "National Hockey League":
            stats.append({
                "year": season["season"],
                "teamId": season["team"]["id"],
                "goals": season["stat"]["goals"],
                "assists": season["stat"]["assists"],
                "points": season["stat"]["points"],
                "gamesPlayed": season["stat"]["games"],
                "shots": season["stat"]["shots"],
                "hits": season["stat"]["hits"],
                "blocks": season["stat"]["blocked"] 
            })

            