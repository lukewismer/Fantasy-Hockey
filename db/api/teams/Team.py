class Team:
    def __init__(self, id, details = {}, roster= {}, schedule={}, stats={}):
        self.id = id
        self.details = details
        self.roster = roster
        self.schedule = schedule
        self.stats = stats

    def setDetails(self, details):
        self.details = details

    def getDetails(self):
        return self.details

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

    