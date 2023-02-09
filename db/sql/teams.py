import sqlite3


def create_teams_table(cursor):
    # Drop the GEEK table if already exists.
    cursor.execute("DROP TABLE IF EXISTS TEAMS_INFO")
    
    # Creating table
    table = """ CREATE TABLE TEAMS_INFO (
                id INT PRIMARY KEY NOT NULL,
                name CHAR(100),
                abbreviation CHAR(20),
                conference CHAR(100),
                division CHAR(100)
            ); """
    
    cursor.execute(table)

def create_team_stats_table(cursor):
    cursor.execute("DROP TABLE IF EXISTS TEAMS_STATS")

    table = """ CREATE TABLE TEAMS_STATS (
                id INT PRIMARY KEY NOT NULL,
                gp INT,
                wins INT,
                losses INT,
                otl INT,
                points INT,
                pointPctg DOUBLE,
                gpg DOUBLE,
                gapg DOUBLE,
                pppct DOUBLE,
                ppg DOUBLE,
                ppga DOUBLE,
                ppo INT,
                pkpct DOUBLE,
                shotspg DOUBLE,
                shotsapg DOUBLE,
                wScoreFirst DOUBLE,
                wScoreLast DOUBLE,
                wLeadFirstPer DOUBLE,
                wLeadSecondPer DOUBLE,
                wOutshoot DOUBLE,
                wOutshot DOUBLE,
                foTaken INT,
                foW INT,
                foL INT,
                fopct DOUBLE,
                shootPct DOUBLE,
                savePct DOUBLE
                """

    cursor.execute(table)

def insert_team(cursor, team_data):
    cursor.execute("INSERT INTO TEAMS_INFO (id, name, abbreviation, conference, division) values (?, ?, ?, ?, ?)",
    (team_data["info"]["id"], team_data["info"]["name"], team_data["info"]["abbreviation"],
    team_data["info"]["conference"], team_data["info"]["division"]))

    cursor.execute("INSERT INTO TEAMS_STATS (id")

    print("inserted")