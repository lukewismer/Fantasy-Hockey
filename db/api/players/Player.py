class Player:
    def __init__(self, id, details=None, stats=None, seasonStats=None):
        self.id = id
        self.details = details if details is not None else {}
        self.stats = stats if stats is not None else {}
        self.seasonStats = seasonStats if seasonStats is not None else {}

    def set_details(self, details):
        self.details = details

    def get_details(self):
        return self.details

    def get_id(self):
        return self.id

    def get_stats(self):
        return self.stats

    def set_stats(self, stats):
        self.stats = stats

    def get_position(self):
        return self.details["positionCode"]
    
    def set_seasonStats(self, seasonStats):
        self.seasonStats = seasonStats

    def get_seasonStats(self):
        return self.seasonStats
