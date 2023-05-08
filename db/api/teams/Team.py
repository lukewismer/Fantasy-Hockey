class Team:
    def __init__(self, id, details = {}, roster= {}, schedule={}, stats={}, years={}):
        self.id = id
        self.details = details
        self.roster = roster
        self.schedule = schedule
        self.stats = stats
        self.years = years

    def setDetails(self, details):
        self.details = details

    def getDetails(self):
        return self.details
    
    def addYear(self, year, year_roster, year_stats):
        self.years[year] = {"Roster": year_roster, "Stats": year_stats}

    def getYears(self):
        return self.years
    
    def getId(self):
        return self.id

    def getRoster(self):
        return self.roster

    def setRoster(self, roster):
        self.roster = roster

    def getSchedule(self):
        return self.schedule

    def setSchedule(self, schedule):
        self.schedule = schedule

    def getStats(self):
        return self.stats

    def setStats(self, stats):
        self.stats = stats

    