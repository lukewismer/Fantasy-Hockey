import numpy as np
import matplotlib.pyplot as plt
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("../db/api/serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db=firestore.client()

players_collection = db.collection('players')
teams_collection = db.collection('teams')

# Perform separate queries for positionCode 'C', 'L', and 'R'
position_codes = ['C', 'L', 'R']
filtered_players = []

for code in position_codes:
    query = players_collection.where('player_details.positionCode', '==', code).stream()
    filtered_players.extend(list(query))


data = filtered_players[0].to_dict()["player_stats"]

age = []
shots = []
games_played = []
goals = []
assists = []
points = []


for i in range(len(data)):
    age.append(19 + i)
    shots.append(data[i]["shots"])
    games_played.append(data[i]["gamesPlayed"])
    goals.append(data[i]["goals"])
    assists.append(data[i]["assists"])
    points.append(data[i]["points"])

age_arr = np.array(age)
shots_arr = np.array(np.divide(shots, games_played))
goals_arr = np.array(np.divide(goals, games_played))
assists_arr = np.array(np.divide(assists, games_played))
points_arr = np.array(np.divide(points, games_played))
games_arr = np.array(games_played)

print(f"Correlation coefficient between this year's shots and next year's points: {correlation_coefficient}")

# Plot the data
plt.plot(age_arr, shots_arr, label='Shots')
plt.plot(age_arr, goals_arr, label='Goals')
plt.plot(age_arr, assists_arr, label='Assists')
plt.plot(age_arr, points_arr, label='Points')

# Customize the plot
plt.xlabel('Age')
plt.ylabel('Stats')
plt.title('Player Stats by Age')
plt.legend()

plt.xticks(age_arr)

# Display the plot
plt.show()