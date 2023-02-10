import requests
from playerDetails import check_dict



def get_player_stats(id, isSkater):
    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/people/{id}/stats?stats=yearByYear")
    data = r.json()["stats"][0]["splits"]
    stats = []
    for season in data:
        if season["league"]["name"] == "National Hockey League":
            if (isSkater):
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
            else:
                stats.append({
                    "year": season["season"],
                    "teamId": season["team"]["id"],
                    "games": season["stat"]["games"],
                    "wins": season["stat"]["wins"],
                    "saves": season["stat"]["saves"],
                    "shutouts": season["stat"]["shutouts"],
                    "losses": season["stat"]["losses"],
                    "otl": season["stat"]["ot"] if check_dict(season["stat"], "ot") else "",
                    "goalsAgainst": season["stat"]["goalsAgainst"],
                })