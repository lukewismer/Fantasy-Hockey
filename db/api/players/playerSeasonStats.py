import requests

SEASON = "20222023"

def get_player_seasonStats(id, is_skater):
    stats = {
        "homeAway": get_homeAway(id, is_skater),
        "byMonth": get_byMonth(id, is_skater),
        "byDayOfWeek": get_byDayOfWeek(id, is_skater),
        "byGameSituation": get_byGameSituation(id, is_skater),
        "statRankings": get_statRankings(id, is_skater),
        "winLoss": get_winLoss(id, is_skater)
    }

    return stats

def get_homeAway(id, is_skater):
    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/people/{id}/stats?stats=homeAndAway")
    data = r.json()["stats"][0]["splits"]

    def check_dict(data, key):
        return key in data

    stats = []
    homeStats = []
    awayStats = []
    for season in data:
        if season['isHome']:
            if is_skater: 
                homeStats.append({
                    "games": season["stat"]["games"],
                    "goals": season["stat"]["goals"],
                    "assists": season["stat"]["assists"],
                    "points": season["stat"]["points"],
                    "gamesPlayed": season["stat"]["games"],
                    "pims": season["stat"]["pim"],
                    "shots": season["stat"]["shots"],
                    "hits": season["stat"]["hits"] if "hits" in season["stat"] else 0,
                    "blocks": season["stat"]["blocked"] if "blocked" in season["stat"] else 0,
                    "timeOnIce": season["stat"]["timeOnIce"],
                    "powerPlayPoints": season["stat"]["powerPlayPoints"],
                    "powerPlayTimeOnIce": season["stat"]["powerPlayTimeOnIce"],
                    "plusMinus": season["stat"]["plusMinus"],
                    "shotPct": season["stat"]["shotPct"] if "shotPct" in season["stat"] else 0
                })
            else:
                stats.append({
                    "games": season["stat"]["games"],
                    "wins": season["stat"]["wins"] if "wins" in season["stat"] else 0,
                    "saves": season["stat"]["saves"],
                    "shutouts": season["stat"]["shutouts"],
                    "losses": season["stat"]["losses"] if "losses" in season["stat"] else 0,
                    "otl": season["stat"]["ot"] if check_dict(season["stat"], "ot") else "",
                    "goalsAgainst": season["stat"]["goalsAgainst"],
                })
        else:
            if is_skater: 
                awayStats.append({
                    "games": season["stat"]["games"],
                    "goals": season["stat"]["goals"],
                    "assists": season["stat"]["assists"],
                    "points": season["stat"]["points"],
                    "gamesPlayed": season["stat"]["games"],
                    "pims": season["stat"]["pim"],
                    "shots": season["stat"]["shots"],
                    "hits": season["stat"]["hits"] if "hits" in season["stat"] else 0,
                    "blocks": season["stat"]["blocked"] if "blocked" in season["stat"] else 0,
                    "timeOnIce": season["stat"]["timeOnIce"],
                    "powerPlayPoints": season["stat"]["powerPlayPoints"],
                    "powerPlayTimeOnIce": season["stat"]["powerPlayTimeOnIce"],
                    "plusMinus": season["stat"]["plusMinus"],
                    "shotPct": season["stat"]["shotPct"] if "shotPct" in season["stat"] else 0
                })
            else:
                stats.append({
                    "games": season["stat"]["games"],
                    "wins": season["stat"]["wins"] if "wins" in season["stat"] else 0,
                    "saves": season["stat"]["saves"],
                    "shutouts": season["stat"]["shutouts"],
                    "losses": season["stat"]["losses"] if "losses" in season["stat"] else 0,
                    "otl": season["stat"]["ot"] if check_dict(season["stat"], "ot") else "",
                    "goalsAgainst": season["stat"]["goalsAgainst"],
                })
    
        stats.append({"home": homeStats, "away": awayStats})
    return stats


def get_byMonth(id, is_skater):
    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/people/{id}/stats?stats=byMonth")
    data = r.json()["stats"][0]["splits"]

    def check_dict(data, key):
        return key in data

    stats = []
    for season in data:
        if is_skater: 
            stats.append({
                "month": season["month"],
                "goals": season["stat"]["goals"],
                "assists": season["stat"]["assists"],
                "points": season["stat"]["points"],
                "gamesPlayed": season["stat"]["games"],
                "pims": season["stat"]["pim"],
                "shots": season["stat"]["shots"],
                "hits": season["stat"]["hits"] if "hits" in season["stat"] else 0,
                "blocks": season["stat"]["blocked"] if "blocked" in season["stat"] else 0,
                "timeOnIce": season["stat"]["timeOnIce"],
                "powerPlayPoints": season["stat"]["powerPlayPoints"],
                "powerPlayTimeOnIce": season["stat"]["powerPlayTimeOnIce"],
                "plusMinus": season["stat"]["plusMinus"],
                "shotPct": season["stat"]["shotPct"] if "shotPct" in season["stat"] else 0
            })
        else:
            stats.append({
                "month": season["month"],
                "games": season["stat"]["games"],
                "wins": season["stat"]["wins"] if "wins" in season["stat"] else 0,
                "saves": season["stat"]["saves"],
                "shutouts": season["stat"]["shutouts"],
                "losses": season["stat"]["losses"] if "losses" in season["stat"] else 0,
                "otl": season["stat"]["ot"] if check_dict(season["stat"], "ot") else "",
                "goalsAgainst": season["stat"]["goalsAgainst"],
            })

    return stats

def get_byDayOfWeek(id, is_skater):
    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/people/{id}/stats?stats=byDayOfWeek")
    data = r.json()["stats"][0]["splits"]

    def check_dict(data, key):
        return key in data

    stats = []
    for season in data:
        if is_skater: 
            stats.append({
                "dayOfWeek": season["dayOfWeek"],
                "goals": season["stat"]["goals"],
                "assists": season["stat"]["assists"],
                "points": season["stat"]["points"],
                "gamesPlayed": season["stat"]["games"],
                "pims": season["stat"]["pim"],
                "shots": season["stat"]["shots"],
                "hits": season["stat"]["hits"] if "hits" in season["stat"] else 0,
                "blocks": season["stat"]["blocked"] if "blocked" in season["stat"] else 0,
                "timeOnIce": season["stat"]["timeOnIce"],
                "powerPlayPoints": season["stat"]["powerPlayPoints"],
                "powerPlayTimeOnIce": season["stat"]["powerPlayTimeOnIce"],
                "plusMinus": season["stat"]["plusMinus"],
                "shotPct": season["stat"]["shotPct"] if "shotPct" in season["stat"] else 0
            })
        else:
            stats.append({
                "dayOfWeek": season["dayOfWeek"],
                "games": season["stat"]["games"],
                "wins": season["stat"]["wins"] if "wins" in season["stat"] else 0,
                "saves": season["stat"]["saves"],
                "shutouts": season["stat"]["shutouts"],
                "losses": season["stat"]["losses"] if "losses" in season["stat"] else 0,
                "otl": season["stat"]["ot"] if check_dict(season["stat"], "ot") else "",
                "goalsAgainst": season["stat"]["goalsAgainst"],
            })

    return stats

def get_byGameSituation(id, is_skater):
    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/people/{id}/stats?stats=goalsByGameSituation")
    data = r.json()["stats"][0]["splits"]

    stats = []
    for season in data:
        if is_skater: 
            stats.append(
                season["stat"]
            )
        else:
            stats.append(
                season["stat"]
            )
    return stats

def get_statRankings(id, is_skater):
    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/people/{id}/stats?stats=regularSeasonStatRankings")
    data = r.json()["stats"][0]["splits"]

    def check_dict(data, key):
        return key in data

    stats = []
    for season in data:
        if is_skater: 
            stats.append({
                "goals": season["stat"]["rankGoals"],
                "assists": season["stat"]["rankAssists"],
                "points": season["stat"]["rankPoints"],
                "gamesPlayed": season["stat"]["rankGamesPlayed"],
                "pims": season["stat"]["rankPenaltyMinutes"],
                "shots": season["stat"]["rankShots"],
                "hits": season["stat"]["rankHits"] if "rankHits" in season["stat"] else 0,
                "blocks": season["stat"]["rankBlockedShots"] if "rankBlockedShots" in season["stat"] else 0,
                "plusMinus": season["stat"]["rankPlusMinus"],
                "shotPct": season["stat"]["rankShotPct"] if "rankShotPct" in season["stat"] else 0
            })
        else:
            stats.append({
                "games": season["stat"]["games"],
                "wins": season["stat"]["wins"] if "wins" in season["stat"] else 0,
                "saves": season["stat"]["saves"],
                "shutouts": season["stat"]["shutOuts"],
                "losses": season["stat"]["losses"] if "losses" in season["stat"] else 0,
                "otl": season["stat"]["ot"] if check_dict(season["stat"], "ot") else "",
                "goalsAgainst": season["stat"]["goalsAgainst"],
            })
    return stats

def get_vsConference(id, is_skater):
    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/people/{id}/stats?stats=vsConference&season={SEASON}")
    data = r.json()["stats"][0]["splits"]

    def check_dict(data, key):
        return key in data

    stats = []
    for season in data:
        if is_skater: 
            stats.append({
                "Conference": season["opponentConference"]["name"],
                "goals": season["stat"]["goals"],
                "assists": season["stat"]["assists"],
                "points": season["stat"]["points"],
                "gamesPlayed": season["stat"]["games"],
                "pims": season["stat"]["pim"],
                "shots": season["stat"]["shots"],
                "hits": season["stat"]["hits"] if "hits" in season["stat"] else 0,
                "blocks": season["stat"]["blocked"] if "blocked" in season["stat"] else 0,
                "timeOnIce": season["stat"]["timeOnIce"],
                "powerPlayPoints": season["stat"]["powerPlayPoints"],
                "powerPlayTimeOnIce": season["stat"]["powerPlayTimeOnIce"],
                "plusMinus": season["stat"]["plusMinus"],
                "shotPct": season["stat"]["shotPct"] if "shotPct" in season["stat"] else 0
            })
        else:
            stats.append({
                "Conference": season["opponentConference"]["name"],
                "games": season["stat"]["games"],
                "wins": season["stat"]["wins"] if "wins" in season["stat"] else 0,
                "saves": season["stat"]["saves"],
                "shutouts": season["stat"]["shutouts"],
                "losses": season["stat"]["losses"] if "losses" in season["stat"] else 0,
                "otl": season["stat"]["ot"] if check_dict(season["stat"], "ot") else "",
                "goalsAgainst": season["stat"]["goalsAgainst"],
            })
    return stats

def get_vsDivision(id, is_skater):
    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/people/{id}/stats?stats=vsDivision&season={SEASON}")
    data = r.json()["stats"][0]["splits"]

    def check_dict(data, key):
        return key in data

    stats = []
    for season in data:
        if is_skater: 
            stats.append({
                "Division": season["opponentDivision"]["name"],
                "goals": season["stat"]["goals"],
                "assists": season["stat"]["assists"],
                "points": season["stat"]["points"],
                "gamesPlayed": season["stat"]["games"],
                "pims": season["stat"]["pim"],
                "shots": season["stat"]["shots"],
                "hits": season["stat"]["hits"] if "hits" in season["stat"] else 0,
                "blocks": season["stat"]["blocked"] if "blocked" in season["stat"] else 0,
                "timeOnIce": season["stat"]["timeOnIce"],
                "powerPlayPoints": season["stat"]["powerPlayPoints"],
                "powerPlayTimeOnIce": season["stat"]["powerPlayTimeOnIce"],
                "plusMinus": season["stat"]["plusMinus"],
                "shotPct": season["stat"]["shotPct"] if "shotPct" in season["stat"] else 0
            })
        else:
            stats.append({
                "Division": season["opponentDivision"]["name"],
                "games": season["stat"]["games"],
                "wins": season["stat"]["wins"] if "wins" in season["stat"] else 0,
                "saves": season["stat"]["saves"],
                "shutouts": season["stat"]["shutouts"],
                "losses": season["stat"]["losses"] if "losses" in season["stat"] else 0,
                "otl": season["stat"]["ot"] if check_dict(season["stat"], "ot") else "",
                "goalsAgainst": season["stat"]["goalsAgainst"],
            })
    return stats

def get_vsTeam(id, is_skater):
    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/people/{id}/stats?stats=vsTeam&season={SEASON}")
    data = r.json()["stats"][0]["splits"]

    def check_dict(data, key):
        return key in data

    stats = []
    for season in data:
        if is_skater: 
            stats.append({
                "opponent": season["opponent"]["id"],
                "goals": season["stat"]["goals"],
                "assists": season["stat"]["assists"],
                "points": season["stat"]["points"],
                "gamesPlayed": season["stat"]["games"],
                "pims": season["stat"]["pim"],
                "shots": season["stat"]["shots"],
                "hits": season["stat"]["hits"] if "hits" in season["stat"] else 0,
                "blocks": season["stat"]["blocked"] if "blocked" in season["stat"] else 0,
                "timeOnIce": season["stat"]["timeOnIce"],
                "powerPlayPoints": season["stat"]["powerPlayPoints"],
                "powerPlayTimeOnIce": season["stat"]["powerPlayTimeOnIce"],
                "plusMinus": season["stat"]["plusMinus"],
                "shotPct": season["stat"]["shotPct"] if "shotPct" in season["stat"] else 0
            })
        else:
            stats.append({
                "opponent": season["opponent"]["id"],
                "games": season["stat"]["games"],
                "wins": season["stat"]["wins"] if "wins" in season["stat"] else 0,
                "saves": season["stat"]["saves"],
                "shutouts": season["stat"]["shutouts"],
                "losses": season["stat"]["losses"] if "losses" in season["stat"] else 0,
                "otl": season["stat"]["ot"] if check_dict(season["stat"], "ot") else "",
                "goalsAgainst": season["stat"]["goalsAgainst"],
            })
    return stats

def get_winLoss(id, is_skater):
    r = requests.get(f"https://statsapi.web.nhl.com/api/v1/people/{id}/stats?stats=winLoss")
    data = r.json()["stats"][0]["splits"]

    def check_dict(data, key):
        return key in data

    stats = []
    for season in data:
        if is_skater: 
            stats.append({
                "isWin": season["isWin"],
                "isOt": season["isOT"],
                "goals": season["stat"]["goals"],
                "assists": season["stat"]["assists"],
                "points": season["stat"]["points"],
                "gamesPlayed": season["stat"]["games"],
                "pims": season["stat"]["pim"],
                "shots": season["stat"]["shots"],
                "hits": season["stat"]["hits"] if "hits" in season["stat"] else 0,
                "blocks": season["stat"]["blocked"] if "blocked" in season["stat"] else 0,
                "timeOnIce": season["stat"]["timeOnIce"],
                "powerPlayPoints": season["stat"]["powerPlayPoints"],
                "powerPlayTimeOnIce": season["stat"]["powerPlayTimeOnIce"],
                "plusMinus": season["stat"]["plusMinus"],
                "shotPct": season["stat"]["shotPct"] if "shotPct" in season["stat"] else 0
            })
        else:
            stats.append({
                "isWin": season["isWin"],
                "isOt": season["isOT"],
                "games": season["stat"]["games"],
                "wins": season["stat"]["wins"] if "wins" in season["stat"] else 0,
                "saves": season["stat"]["saves"],
                "shutouts": season["stat"]["shutouts"],
                "losses": season["stat"]["losses"] if "losses" in season["stat"] else 0,
                "otl": season["stat"]["ot"] if check_dict(season["stat"], "ot") else "",
                "goalsAgainst": season["stat"]["goalsAgainst"],
            })
        
    return stats
