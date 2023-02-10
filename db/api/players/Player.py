class Player:
    def __init__(self, id, details = {}, stats={}):
        self.id = id
        self.details = details
        self.stats = stats

    def setDetails(self, details):
        self.details = details

    def getDetails(self):
        return self.details

    def getId(self):
        return self.id

    def getStats(self):
        return self.stats

    def setStats(self, stats):
        self.stats = stats

    def getPosition(self):
        return self.details["positionCode"]

    