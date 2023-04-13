import requests
from Team import Team
from teamDetails import get_team_details
from teamRoster import get_team_roster
from teamSchedule import get_team_schedule
from teamStats import get_team_stats

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("../serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db=firestore.client()

teams_collection = db.collection('teams')

def get_teams_data():
    r = requests.get("https://statsapi.web.nhl.com/api/v1/teams")
    return r.json()["teams"]



def get_team_ids(data = get_teams_data()):
    teamIds = [11]
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

        data = {"team_details": team.getDetails(), "team_stats": team.getStats(), "team_roster": team.getRoster(), "team_schedule": team.getSchedule()}
        teams_collection.document(str(team.getId())).set(data)

    return teams
    
   


if __name__ == "__main__":
    # Team Data takes about 30 seconds
    # start_time = time.time()
    get_all_team_data()
    # print("Team data takes this many seconds: " + str(time.time() - start_time))
