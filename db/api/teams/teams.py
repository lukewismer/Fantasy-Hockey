import requests
from Team import Team
from teamDetails import get_team_details
from teamRoster import get_team_roster
from teamSchedule import get_team_schedule
from teamStats import get_team_stats

import time

def get_teams_data():
    r = requests.get("https://statsapi.web.nhl.com/api/v1/teams")
    return r.json()["teams"]



def get_team_ids(data = get_teams_data()):
    teamIds = []
    for team in data:
        teamIds.append(team["id"])
    return teamIds



def get_all_team_data():
    
    data = get_teams_data()
    ids = get_team_ids(data)
    teams = [Team(id) for id in ids]
    for team in teams:
        team.setDetails(get_team_details(team.getId()))
        team.setStats(get_team_stats(team.getId()))
        team.setRoster(get_team_roster(team.getId()))
        team.setSchedule(get_team_schedule(team.getId()))

    return teams
    
   


if __name__ == "__main__":
    # Team Data takes about 30 seconds
    start_time = time.time()
    get_all_team_data()
    print("Team data takes this many seconds: " + str(time.time() - start_time))
