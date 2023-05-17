import requests

def get_player_stats(id, is_skater):
    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/people/{id}/stats?stats=yearByYear")
    data = r.json()["stats"][0]["splits"]

    years = ["19971998", "19981999", "19992000", "20002001", "20012002", "20022003", "20032004", "20042005", "20052006", "20062007", "20072008",
             "20082009", "20092010", "20102011", "20112012", "20122013", "20132014", "20142015", "20152016", "20162017", "20172018", "20182019",
             "20192020", "20202021", "20212022", "20222023"]

    def check_dict(data, key):
        return key in data

    stats = []
    for season in data:
        if season["league"]["name"] == "National Hockey League" and season["season"] in years:
            if is_skater:
                stats.append({
                    "year": season["season"],
                    "teamId": season["team"]["id"],
                    "goals": season["stat"]["goals"],
                    "assists": season["stat"]["assists"],
                    "points": season["stat"]["points"],
                    "gamesPlayed": season["stat"]["games"],
                    "shots": season["stat"]["shots"],
                    "hits": season["stat"]["hits"] if "hits" in season["stat"] else 0,
                    "blocks": season["stat"]["blocked"] if "blocked" in season["stat"] else 0,
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
