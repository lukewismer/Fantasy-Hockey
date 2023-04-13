import numpy as np
import matplotlib.pyplot as plt
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from keras import Sequential
from keras.layers import Dense
from keras.callbacks import EarlyStopping


def time_string_to_seconds(time_str):
    parts = time_str.split(':')
    if len(parts) == 3:
        hours, minutes, seconds = map(int, parts)
        return hours * 3600 + minutes * 60 + seconds
    elif len(parts) == 2:
        minutes, seconds = map(int, parts)
        return minutes * 60 + seconds
    else:
        raise ValueError('Invalid time string format')

cred = credentials.Certificate({
    "type": "service_account",
    "project_id": "fantasy-hockey-57a7f",
    "private_key_id": "87e627efe4c9619ae20bd8d136277cf1196f62f5",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDZpyTwV6EUGZKv\nPoOsX4p2sQuuXo+ktH1aCmRPw7KU8DA/op7ZInpIdjqELTFFBkXlKzgyhRPmEtle\nb438IPA7H/qfNpVGMwzEer7k18hAC3K76MhIGEvmG1mjDKsczLzrno8JUqej2z5Y\nFo+j6FFIlsEylurDhZQjJJa1tFOCu85plvWe0OmS7DbuIwN4L8txvVMwj0wPF8Oe\n59yKG2Gt1a7CSHNUJ4s9zN6AfCFfiMJpUPoH4ft7WUuMUx9wCkf3TzG2TXC1JdA5\norekUknXArfpNR0/JdDsvr//Z52aZo22HhBi2bqGCb3TWr02puse1nguW4ZA+F5b\nDkVOVW0NAgMBAAECggEADsoN4gDqUpMm8Ekh/wP3miIPRk1pmvT4BuFpjdv2gKqj\ndKd9qLPFiwfxk5/91uVauXw1fi/5uVVIN45X9QJd9dPcnpXsZbqRSwaA0yGbG0hL\n3Fswb2mrOpsFfQ/0I+mriqJvBgtQ6yWPd8KCByQBkJpMeBNg0gv7vrmSk2KJ7CTr\nshqQFfVcyQSekOon7OzgVUgl+Cc0ryUQ4dYqz7za9HM6vbqDVJqPASXfJY8/KpWS\noTTdO0M8PyNTagBNgOe9NqtIKEV+Pz+M4hxHy43sypS0hJbvF1TAtKXdNZboiCOX\nmgw1EWxMWG0r5CGdIQX3xNLX6JU1ybXbLVLmQr6fAQKBgQDwl8iALf6O8hbM+JS/\nqeS61pwH0RUrbURXlmFGSX0gpYbJWHYNRSPz5AbD42dUjjI5FFmcGo91MNTUEktr\nQRsxJi7JOhTXhmXJLCrNx4ZcxvIXHCICRbGIyoUwabWh3OGUqIBV5UdtoPpMD8LA\n2w7481hGztYqA41k5noH6A92jQKBgQDnl0nwnYfRRP5oMb3asgfPJdGmkZErhmPd\n2CgxrKpTKWQbhVMPqIVQfGDwNg+ORZUgsG3Bd+gdgkG2JcyFQJQA4ZjQwRxfAFTO\ncAo5TNOSNDSXG2w/fgdU9YPVO67GuY4lu1p2OgDEBice1Ll+058HYpQQHvwZEhpC\nYv5APKFwgQKBgBczi/JQfSvrzKcXkcCp8ZTS/VkDoLb/YofPyLGuhJKRY94m2buN\n31m1s7FQTLaqv80hWULkjNEQVHXfDcbaEHU86WYeY8QlAcvUpowRobNwvAfefqkZ\nb3VxkkaI6ysg0eA0H6wo4CqCS6DqJC3U8iyvyuOJLr3+ebQxRbNdfaBBAoGBALpv\n0adxuf/fUgthV9yyC5VYdcFpWHu4kbbrJ9htjySpopyBJU/qs4AK0SMv8i/vllEd\nlw3z0JnI3cub/Fydk0huVM5hV8ynAJ68FY7xaTU+78Nh4S/v7kkX6QyFInt6r5Ny\nky2wHiOwbFfmmnoeNN0GH/omZ35rU1Z0SQg/hxuBAoGBAN/DjPdHRx7ZAsrCVwBb\nhKn4BhWsj7skixXveg+xCRBduAwvirlPpTroui+hCi14GdEJmIFp9bgVKFJ405yH\n38sjWhaKkOI6l2+ADKYTqEFu8oWfmN5YwvT5GnUAlHLmncb16UgkALOIE4P0pcsJ\nwMGZY1JqqCO6R+wdDTF+hxYP\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-wxhcv@fantasy-hockey-57a7f.iam.gserviceaccount.com",
    "client_id": "101842707150278127620",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-wxhcv%40fantasy-hockey-57a7f.iam.gserviceaccount.com"
  }
  )
#firebase_admin.initialize_app(cred) # ONLY NEED TO INITIALIZE THE FIRST TIME

db=firestore.client()

players_collection = db.collection('players')
teams_collection = db.collection('teams')


position_codes = ['D'] # Can change position code to whatever positions you want, ex) ["C", "L", "R"] for all forwards
filtered_players = []

# Gets all player
for code in position_codes:
    query = players_collection.where('player_details.positionCode', '==', code).stream()
    filtered_players.extend(list(query))


new_players = []

for player in filtered_players:
    player = player.to_dict()
    age = []
    shots = []
    games_played = []
    goals = []
    assists = []
    points = []
    powerplaypoints = []
    plusMinus = []
    hits =[]
    shotPct = []
    timeOnIce = []
    powerPlayTimeOnIce = []

    birthyear = player["player_details"]["birthDate"][:4]
    name = player["player_details"]["name"]

    for player_stats in player["player_stats"]:
        age.append(int(player_stats["year"][:4]) - int(birthyear))
        shots.append(player_stats["shots"])
        games_played.append(player_stats["gamesPlayed"])
        goals.append(player_stats["goals"])
        assists.append(player_stats["assists"])
        points.append(player_stats["points"])
        powerplaypoints.append(player_stats["powerPlayPoints"])
        plusMinus.append(player_stats["plusMinus"])
        hits.append(player_stats["hits"])
        shotPct.append(player_stats["shotPct"])
        timeOnIce.append(player_stats["timeOnIce"])
        powerPlayTimeOnIce.append(player_stats["powerPlayTimeOnIce"])

    timeOnIce_float = [time_string_to_seconds(x) for x in timeOnIce]
    powerPlayTimeOnIce_float = [time_string_to_seconds(x) for x in powerPlayTimeOnIce]

    age_arr = np.array(age)
    shots_arr = np.array(np.divide(shots, games_played))
    goals_arr = np.array(np.divide(goals, games_played))
    assists_arr = np.array(np.divide(assists, games_played))
    points_arr = np.array(np.divide(points, games_played))
    powerplaypoints_arr = np.array(np.divide(powerplaypoints, games_played))
    plusMinus_arr = np.array(np.divide(plusMinus, games_played))
    hits_arr = np.array(np.divide(hits, games_played))
    shotPct_arr = np.array(shotPct)
    timeOnIce_arr = np.array(np.divide(timeOnIce_float, games_played))
    powerPlayTimeOnIce_arr = np.array(np.divide(powerPlayTimeOnIce_float, games_played))
    games_arr = np.array(games_played)
    
    new_players.append({"name": name, "age": age_arr, "shots" : shots_arr, "games_played": games_arr, "goals": goals_arr, "assists": assists_arr, "points": points_arr, "powerplaypoints": powerplaypoints_arr, "plusMinus": plusMinus_arr, "hits": hits_arr, "shotPct": shotPct_arr, "timeOnIce": timeOnIce_arr, "powerPlayTimeOnIce": powerPlayTimeOnIce_arr})


all_data = []
for player in new_players:
    data = np.column_stack((
        player['age'][:-1], player['shots'][:-1], player['goals'][:-1], player['assists'][:-1],
        player['powerplaypoints'][:-1], player['plusMinus'][:-1], player['hits'][:-1],
        player['timeOnIce'][:-1], player['powerPlayTimeOnIce'][:-1]
    ))
    target = player['points'][1:]
    all_data.append((data, target))

latest_season_data = []
players_with_data =[]
for player in new_players:
    if len(player['age']) > 0:
        latest_data = np.column_stack((
            player['age'][-1], player['shots'][-1], player['goals'][-1], player['assists'][-1],
            player['powerplaypoints'][-1], player['plusMinus'][-1], player['hits'][-1],
            player['timeOnIce'][-1], player['powerPlayTimeOnIce'][-1]
        ))
        latest_season_data.append(latest_data)
        players_with_data.append(player)
X_latest_season = np.vstack(latest_season_data)


X = np.vstack([x[0] for x in all_data])
y = np.hstack([x[1] for x in all_data])


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42) # 80% training and 20% testing


scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
X_latest_season_scaled = scaler.transform(X_latest_season)



train_dataset = tf.data.Dataset.from_tensor_slices((X_train_scaled, y_train)).batch(32)
test_dataset = tf.data.Dataset.from_tensor_slices((X_test_scaled, y_test)).batch(32)





model = Sequential([
    Dense(64, activation='relu', input_shape=(X_train_scaled.shape[1],)),
    Dense(32, activation='relu'),
    Dense(1)  
])


model.compile(loss='mean_squared_error', optimizer='nadam', metrics=['mean_absolute_error'])


early_stopping = EarlyStopping(monitor='val_loss', patience=10)
history = model.fit(train_dataset, epochs=50, validation_data=test_dataset, callbacks=[early_stopping])

predicted_points = model.predict(X_test_scaled)
predicted_points_next_year = model.predict(X_latest_season_scaled)


print(len(predicted_points_next_year))
print(len(players_with_data))

for i in range(len(players_with_data)):
  print(f"{players_with_data[i]['name']} is predicted to have {predicted_points_next_year[i]} ppg next year or {predicted_points_next_year[i] * 82} total points\n")
