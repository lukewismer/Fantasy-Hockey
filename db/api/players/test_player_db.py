import unittest
from unittest.mock import patch
from Player import Player
import player_db
from player_db import PlayerDatabase

class TestPlayer(unittest.TestCase):

    def test_player_methods(self):
        player = Player(1, {"name": "John Doe", "positionCode": "C"}, [{"year": "2021", "goals": 10, "assists": 15}])
        self.assertEqual(player.get_id(), 1)
        self.assertEqual(player.get_position(), "C")
        self.assertEqual(player.get_details()["name"], "John Doe")
        self.assertEqual(player.get_stats()[0]["year"], "2021")


class TestNHLDatabase(unittest.TestCase):

    def setUp(self):
        self.database = PlayerDatabase("../serviceAccountKey.json")

    @patch("player_db.requests.get")
    def test_get_player_ids(self, mock_get):
        mock_get.return_value.json.return_value = {
            "teams": [
                {
                    "roster": {
                        "roster": [
                            {"person": {"id": 1}},
                            {"person": {"id": 2}}
                        ]
                    }
                },
                {
                    "roster": {
                        "roster": [
                            {"person": {"id": 3}},
                            {"person": {"id": 4}}
                        ]
                    }
                }
            ]
        }

        player_ids = self.database.get_player_ids()
        expected_player_ids = [1, 2, 3, 4]
        self.assertListEqual(player_ids, expected_player_ids)

    @patch("player_db.get_player_details")
    @patch("player_db.get_player_stats")
    def test_get_all_players_data(self, mock_get_player_stats, mock_get_player_details):
        self.database.get_player_ids = lambda: [1, 2]

        mock_get_player_details.side_effect = [
            {
                "id": 1,
                "name": "John Doe",
                "positionCode": "C"
            },
            {
                "id": 2,
                "name": "Jane Doe",
                "positionCode": "G"
            }
        ]

        mock_get_player_stats.side_effect = [
            [{"year": "2021", "goals": 10, "assists": 15}],
            [{"year": "2021", "games": 30, "wins": 20}]
        ]

        players = self.database.get_all_players_data()

        self.assertEqual(len(players), 2)
        self.assertEqual(players[0].get_id(), 1)
        self.assertEqual(players[0].get_position(), "C")
        self.assertEqual(players[1].get_id(), 2)
        self.assertEqual(players[1].get_position(), "G")


if __name__ == '__main__':
    unittest.main()
