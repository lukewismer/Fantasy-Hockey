import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../UserContext';
import { DataGrid } from '@mui/x-data-grid';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../Navbar/Navbar';
import Button from '@material-ui/core/Button'; // Import Button

const useStyles = makeStyles({
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)', // Light grey for odd rows
    },
  },
});

const Teams = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const teamId = searchParams.get("team_id");
  const { currentUser, managers, setManagers, leagueSettings, setLeagueSettings } = useUser();
  const [currentManager, setCurrentManager] = useState(null);

  const [playerStats, setPlayerStats] = useState(null);
  const [playerFantasyStats, setPlayerFantasyStats] = useState(null);

  const [isFantasyStats, setIsFantasyStats] = useState(true);
  const [isPlayerStats, setIsPlayerStats] = useState(false);
  const [isPredictedStats, setIsPredictedStats] = useState(false);

  const [viewedPosition, setViewedPosition] = useState()

  useEffect(() => {
    const fetchData = async () => {
      for (const manager of managers) {
        if (manager["id"] === teamId) {
          setCurrentManager(manager);
        }
      }
    };

    fetchData();
  }, [teamId, location.state]);

  useEffect(() => {
    if (currentManager) {
      let temp_playerStats = [];
      let temp_playerFantasyStats = [];

      for (const player of currentManager["player_data"]) {
        const lastStats = player.player_stats[player.player_stats.length - 1];

        if (player.player_details.positionCode == "G"){
          let fantasyPoints = 0;
          fantasyPoints += lastStats.wins * leagueSettings.scoring.win;
          fantasyPoints += lastStats.saves * leagueSettings.scoring.save;
          fantasyPoints += lastStats.shutouts * leagueSettings.scoring.shutout;
  
          temp_playerStats.push({
              ...player,
              name: player.player_details.name,
              position: player.player_details.positionCode,
              games_played: lastStats.gamesPlayed,
              wins: lastStats.wins,
              saves: lastStats.saves,
              shutouts: lastStats.shutouts,
              fantasyPoints: fantasyPoints
          });
          temp_playerFantasyStats.push({
            ...player,
            name: player.player_details.name,
            position: player.player_details.positionCode,
            games_played: lastStats.gamesPlayed,
            wins: lastStats.wins * leagueSettings.scoring.win,
            saves: lastStats.saves * leagueSettings.scoring.save,
            shutouts: lastStats.shutouts * leagueSettings.scoring.shutout,
            fantasyPoints: fantasyPoints})
        } else {
          let fantasyPoints = 0;
        fantasyPoints += lastStats.goals * leagueSettings.scoring.goals;
        fantasyPoints += lastStats.assists * leagueSettings.scoring.assists;
        fantasyPoints += lastStats.shots * leagueSettings.scoring.shots;
        fantasyPoints += lastStats.plusMinus * leagueSettings.scoring.plusMinus;
        fantasyPoints += lastStats.hits * leagueSettings.scoring.hits;
        fantasyPoints += lastStats.blocks * leagueSettings.scoring.blocks

        temp_playerStats.push({
            ...player,
            name: player.player_details.name,
            position: player.player_details.positionCode,
            games_played: lastStats.gamesPlayed,
            goals: lastStats.goals,
            assists: lastStats.assists,
            shots: lastStats.shots,
            plusMinus: lastStats.plusMinus,
            hits: lastStats.hits,
            blocks: lastStats.blocks,
            fantasyPoints: fantasyPoints
        });
        temp_playerFantasyStats.push({
          ...player,
          name: player.player_details.name,
          position: player.player_details.positionCode,
          games_played: lastStats.gamesPlayed,
          goals: lastStats.goals * leagueSettings.scoring.goals,
          assists: lastStats.assists * leagueSettings.scoring.assists,
          shots: lastStats.shots * leagueSettings.scoring.shots,
          plusMinus: lastStats.plusMinus * leagueSettings.scoring.plusMinus,
          hits: lastStats.hits * leagueSettings.scoring.hits,
          blocks: lastStats.blocks * leagueSettings.scoring.blocks,
          fantasyPoints: fantasyPoints})
        }
        
      }
      setPlayerFantasyStats(temp_playerFantasyStats);
      setPlayerStats(temp_playerStats);
    }
  }, [currentManager]);

  const toggleFantasyStats = () => {
    setIsFantasyStats(!isFantasyStats);
  };

  const classes = useStyles();

  const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'position', headerName: 'Position', width: 100 },
    { field: 'fantasyPoints', headerName: 'Points', width: 100 },
    { field: 'games_played', headerName: 'GP', width: 100 },
    { field: 'goals', headerName: 'G', width: 100 },
    { field: 'assists', headerName: 'A', width: 100 },
    { field: 'shots', headerName: 'S', width: 100 },
    { field: 'plusMinus', headerName: '+/-', width: 100 },
    { field: 'hits', headerName: 'H', width: 100 },
    { field: 'blocks', headerName: 'B', width: 100 },
    { field: 'wins', headerName: 'Wins', width: 100 },
    { field: 'saves', headerName: 'Saves', width: 100 },
    { field: 'shutouts', headerName: 'Shutouts', width: 100 },
  ];

  console.log(leagueSettings)

  return (
    <div className="teams-page">
      {currentManager ? (
        <>
          <h1>{currentManager["details"]["username"]}</h1>
          <Navbar />
  
          {playerStats ? (
            <>
            <h2>{isFantasyStats ? 'Fantasy Stats' : 'Regular Stats'}</h2>
              <Button variant="contained" color="primary" onClick={toggleFantasyStats}>
                Toggle Fantasy Stats
              </Button> 
            {isFantasyStats ? (
              <DataGrid
                rows={playerFantasyStats}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                className={classes.row}
                getRowId={(row) => row.name}
              />
            ) : (
              <DataGrid
                rows={playerStats}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                className={classes.row}
                getRowId={(row) => row.name}
              />
            )}
            </>
          ) : null}
  
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default Teams;
  
