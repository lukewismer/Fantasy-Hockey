import requests

def get_player_stats(id, is_skater):
    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/people/{id}/stats?stats=yearByYear")
    data = r.json()["stats"][0]["splits"]

    def check_dict(data, key):
        return key in data

    stats = []
    for season in data:
        if season["league"]["name"] == "National Hockey League":
            if is_skater:
                stats.append({
                    "year": season["season"],
                    "teamId": season["team"]["id"],
                    "goals": season["stat"]["goals"],
                    "assists": season["stat"]["assists"],
                    "points": season["stat"]["points"],
                    "gamesPlayed": season["stat"]["games"],
                    "shots": season["stat"]["shots"],
                    "hits": season["stat"]["hits"],
                    "blocks": season["stat"]["blocked"],
                    "timeOnIce": season["stat"]["timeOnIce"],
                    "powerPlayPoints": season["stat"]["powerPlayPoints"],
                    "powerPlayTimeOnIce": season["stat"]["powerPlayTimeOnIce"],
                    "plusMinus": season["stat"]["plusMinus"],
                    "shotPct": season["stat"]["shotPct"]
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

    return stats
