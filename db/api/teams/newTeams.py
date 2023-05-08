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

teams_collection = db.collection('teams_v2')


def get_all_team_data():
    
    ids = [i for i in range(1, 56)]
    years = ["19971998", "19981999", "19992000", "20002001", "20012002", "20022003", "20032004", "20042005", "20052006", "20062007", "20072008",
             "20082009", "20092010", "20102011", "20112012", "20122013", "20132014", "20142015", "20152016", "20162017", "20172018", "20182019",
             "20192020", "20202021", "20212022", "20222023"]
    
    teams = [Team(id) for id in ids]
    for team in teams:
        team.setDetails(get_team_details(team.getId()))
        team.setSchedule(get_team_schedule(team.getId()))
        
        for year in years:
            team.addYear(year, get_team_roster(team.getId(), year), get_team_stats(team.getId(), year))
        

        data = {"team_details": team.getDetails(), "team_schedule": team.getSchedule(), "years": team.getYears()}
        teams_collection.document(str(team.getId())).set(data)

    return teams
    
   


if __name__ == "__main__":
    # Team Data takes about 30 seconds
    # start_time = time.time()
    get_all_team_data()
    # print("Team data takes this many seconds: " + str(time.time() - start_time))
