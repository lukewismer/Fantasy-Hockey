import sqlite3
from api.teams import get_all_team_data
from sql.teams import *

sqliteConnection = sqlite3.connect('db')
cursor = sqliteConnection.cursor()

sqliteConnection.execute("PRAGMA foreign_keys = 1")

create_teams_table(cursor)

teams = get_all_team_data()

for team in teams:
    insert_team(cursor, team)

sqliteConnection.commit()