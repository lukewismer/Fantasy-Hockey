import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../UserContext';
import { DataGrid } from '@mui/x-data-grid';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../Navbar/Navbar';
import Button from '@material-ui/core/Button'; // Import Button
import { Grid } from '@material-ui/core'; // Import Grid


import { PositionFilter, StatsFilter, TeamFilter } from '../Players/TableFilters';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)', // Light grey for odd rows
    },
  },
  columnHeader: {
    backgroundColor: '#3f51b5', // Dark blue for column headers
    color: '#ffffff', // White color for header text
  },
  boldCell: {
    fontWeight: 'bold',
    fontSize: '1em', // Increase font size
    borderRight: '1px solid #ddd', // Add right border
  },
  positionColumn: {
    borderRight: '1px solid #ddd', // Light grey border on the right side
  },
}));


const Teams = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const teamId = searchParams.get("team_id");
  const { currentUser, managers, setManagers, leagueSettings, teams } = useUser();
  const [currentManager, setCurrentManager] = useState(null);

  const [playerStats, setPlayerStats] = useState(null);
  const [playerFantasyStats, setPlayerFantasyStats] = useState(null);

  const [isFantasyStats, setIsFantasyStats] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState(['L', 'R', 'C', 'D', "G"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      let data;
      
      if (managers && managers.length > 0) {
        data = managers;
      } else {
        const storedManagers = localStorage.getItem('managers');
        if (storedManagers) {
          data = JSON.parse(storedManagers);
          setManagers(data);
          console.log(teams)
        }
      }
      
      for (const manager of data) {
        if (manager["id"] === teamId) {
          setCurrentManager(manager);
        }
      }
    }
    fetchData();
  }, [teamId, location.state]);

  useEffect(() => {
    const fetchData = async () => {
      let data;
      
      if (managers && managers.length > 0) {
        data = managers;
      } else {
        const storedManagers = localStorage.getItem('managers');
        if (storedManagers) {
          data = JSON.parse(storedManagers);
          setManagers(data);
          console.log(teams)
        }
      }
      
      for (const manager of data) {
        if (manager["id"] === teamId) {
          setCurrentManager(manager);
        }
      }
    }
    fetchData();
  }, [teamId, location.state]);


  useEffect(() => {
    console.log('Before check:', teams);
    if (currentManager && teams && teams.length > 0) {
      console.log('After check:', teams)
      let temp_playerStats = [];
      let temp_playerFantasyStats = [];

      for (const player of currentManager["player_data"]) {
        const lastStats = player.player_stats[player.player_stats.length - 1];

        let playerTeam = "";

        for (let team of teams){
          if (team.data.team_details.id === player.player_details.teamID){
            playerTeam = team.data.team_details.abbreviation;
          }
        }

        if (player.player_details.positionCode == "G"){
          let fantasyPoints = 0;
          fantasyPoints += lastStats.wins * leagueSettings.scoring.wins;
          fantasyPoints += lastStats.saves * leagueSettings.scoring.saves;
          fantasyPoints += lastStats.shutouts * leagueSettings.scoring.shutouts;
          fantasyPoints += lastStats.goalsAgainst * leagueSettings.scoring.goalsAgainst;
  
          temp_playerStats.push({
              ...player,
              name: player.player_details.name,
              team: playerTeam,
              position: player.player_details.positionCode,
              games_played: lastStats.gamesPlayed,
              wins: lastStats.wins,
              saves: lastStats.saves,
              shutouts: lastStats.shutouts,
              goalsAgainst: lastStats.goalsAgainst,
              fantasyPoints: fantasyPoints
          });
          temp_playerFantasyStats.push({
            ...player,
            name: player.player_details.name,
            team: playerTeam,
            position: player.player_details.positionCode,
            games_played: lastStats.gamesPlayed,
            wins: lastStats.wins * leagueSettings.scoring.wins,
            saves: lastStats.saves * leagueSettings.scoring.saves,
            shutouts: lastStats.shutouts * leagueSettings.scoring.shutouts,
            goalsAgainst: lastStats.goalsAgainst * leagueSettings.scoring.goalsAgainst,
            fantasyPoints: fantasyPoints})
        } else {
          let fantasyPoints = 0;
          fantasyPoints += lastStats.goals * leagueSettings.scoring.goals;
          fantasyPoints += lastStats.assists * leagueSettings.scoring.assists;
          fantasyPoints += lastStats.shots * leagueSettings.scoring.shots;
          fantasyPoints += lastStats.plusMinus * leagueSettings.scoring.plusMinus;
          fantasyPoints += lastStats.hits * leagueSettings.scoring.hits;
          fantasyPoints += lastStats.blocks * leagueSettings.scoring.blocks
          fantasyPoints += lastStats.powerPlayPoints * leagueSettings.scoring.powerPlayPoints

          temp_playerStats.push({
              ...player,
              name: player.player_details.name,
              team: playerTeam,
              position: player.player_details.positionCode,
              games_played: lastStats.gamesPlayed,
              goals: lastStats.goals,
              assists: lastStats.assists,
              shots: lastStats.shots,
              plusMinus: lastStats.plusMinus,
              hits: lastStats.hits,
              blocks: lastStats.blocks,
              ppp: lastStats.powerPlayPoints,
              fantasyPoints: fantasyPoints
          });
          temp_playerFantasyStats.push({
            ...player,
            name: player.player_details.name,
            team: playerTeam,
            position: player.player_details.positionCode,
            games_played: lastStats.gamesPlayed,
            goals: lastStats.goals * leagueSettings.scoring.goals,
            assists: lastStats.assists * leagueSettings.scoring.assists,
            shots: lastStats.shots * leagueSettings.scoring.shots,
            plusMinus: lastStats.plusMinus * leagueSettings.scoring.plusMinus,
            hits: lastStats.hits * leagueSettings.scoring.hits,
            blocks: lastStats.blocks * leagueSettings.scoring.blocks,
            ppp: lastStats.powerPlayPoints * leagueSettings.scoring.powerPlayPoints,
            fantasyPoints: fantasyPoints})
        }
        
      }
      setPlayerFantasyStats(temp_playerFantasyStats);
      setPlayerStats(temp_playerStats);
    }
  }, [currentManager, teams]);

  const handleStatsChange = (event) => {
    setIsFantasyStats(event.target.value);
  };

  const handlePositionChange = (position) => {
      setSelectedPosition(position);
  };

  const handleTeamChange = (event) => {
    const value = event.target.value === "All Teams" ? "" : event.target.value;
    setSelectedTeam(value);
  };

  const classes = useStyles();

  const columns = [
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1.5, 
      cellClassName: classes.boldCell
    },
    { 
      field: 'position', 
      headerName: 'Position', 
      flex: 1, 
    },
    { field: 'team', headerName: 'Team', flex: 1 },
    { field: 'fantasyPoints', headerName: 'Points', flex: 1 },
    { field: 'games_played', headerName: 'GP', flex: 1 },
    { field: 'goals', headerName: 'G', flex: 1 },
    { field: 'assists', headerName: 'A', flex: 1 },
    { field: 'shots', headerName: 'S', flex: 1 },
    { field: 'plusMinus', headerName: '+/-', flex: 1 },
    { field: 'ppp', headerName: 'PPP', flex: 1 },
    { field: 'hits', headerName: 'H', flex: 1 },
    { field: 'blocks', headerName: 'B', flex: 1 },
    { field: 'wins', headerName: 'Wins', flex: 1 },
    { field: 'saves', headerName: 'Saves', flex: 1 },
    { field: 'shutouts', headerName: 'Shutouts', flex: 1 },
    { field: 'goalsAgainst', headerName: 'GA', flex: 1 },
  ];

  

  return (
    <div className="teams-page">
      {currentManager ? (
        <>
          <h1>{currentManager["details"]["username"]}</h1>
          <Navbar />
  
          {playerStats ? (
            <>
            <input
              type="text"
              placeholder="Search player"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              />
              <StatsFilter isFantasyStats={isFantasyStats} handleStatsChange={handleStatsChange} />
                
              <PositionFilter selectedPosition={selectedPosition} handlePositionChange={handlePositionChange} />

              <TeamFilter selectedTeam={selectedTeam} handleTeamChange={handleTeamChange} teams={teams}/>
              
              <Grid container className={classes.root}>
              {isFantasyStats ? (
                <DataGrid
                  autoWidth
                  rows={playerFantasyStats.filter((row) =>
                            row.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                            selectedPosition.includes(row.position)
                        )}
                  columns={columns.map((column) => ({
                    ...column,
                    headerClassName: classes.columnHeader,
                  }))}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  className={classes.row}
                  getRowId={(row) => row.name}
                  hideFooter
                />
              ) : (
                <DataGrid
                  autoWidth
                  rows={playerStats.filter((row) =>
                            row.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                            selectedPosition.includes(row.position)
                        )}
                  columns={columns.map((column) => ({
                    ...column,
                    headerClassName: classes.columnHeader,
                  }))}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  className={classes.row}
                  getRowId={(row) => row.name}
                  hideFooter
                />
              )}
            </Grid>
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
  
