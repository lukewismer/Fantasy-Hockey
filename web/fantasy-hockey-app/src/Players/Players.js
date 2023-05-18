import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import { DataGrid } from '@mui/x-data-grid';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../Navbar/Navbar';
import { PositionFilter, StatsFilter, TeamFilter} from './TableFilters';

import { Grid } from '@material-ui/core'; // Import Grid

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

const Players = () => {
    const classes = useStyles();
    const { currentUser, leagueSettings, players, teams } = useUser();
    const [playerFantasyStats, setPlayerFantasyStats] = useState([]);
    const [playerStats, setPlayerStats] = useState([]);

    const [isFantasyStats, setIsFantasyStats] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPosition, setSelectedPosition] = useState(['L', 'R', 'C', 'D', "G"]);
    const [selectedTeam, setSelectedTeam] = useState("");


    useEffect(() => {
        console.log(players)
        if (leagueSettings && players && players.length > 0 && teams && teams.length > 0){
            const temp_playerStats = []
            const temp_playerFantasyStats = []

            for (const player of players) {
                const lastStats = player.data.player_stats[player.data.player_stats.length - 1];

                if (lastStats)
                {
                    let playerTeam = "";

                    for (let team of teams){
                        if (team.data.team_details.id === player.data.player_details.teamID){
                            playerTeam = team.data.team_details.abbreviation;
                        }
                    }

                    if (player.data.player_details.positionCode == "G"){
                        let fantasyPoints = 0;
                        fantasyPoints += lastStats.wins * leagueSettings.scoring.wins;
                        fantasyPoints += lastStats.saves * leagueSettings.scoring.saves;
                        fantasyPoints += lastStats.shutouts * leagueSettings.scoring.shutouts;
                        fantasyPoints += lastStats.goalsAgainst * leagueSettings.scoring.goalsAgainst;
                
                        temp_playerStats.push({
                            ...player,
                            name: player.data.player_details.name,
                            team: playerTeam,
                            position: player.data.player_details.positionCode,
                            games_played: lastStats.gamesPlayed,
                            wins: lastStats.wins,
                            saves: lastStats.saves,
                            shutouts: lastStats.shutouts,
                            goalsAgainst: lastStats.goalsAgainst,
                            fantasyPoints: parseFloat(fantasyPoints.toFixed(2))
                        });
                        temp_playerFantasyStats.push({
                        ...player,
                        name: player.data.player_details.name,
                        team: playerTeam,
                        position: player.data.player_details.positionCode,
                        games_played: lastStats.gamesPlayed,
                        wins: lastStats.wins * leagueSettings.scoring.wins,
                        saves: lastStats.saves * leagueSettings.scoring.saves,
                        shutouts: lastStats.shutouts * leagueSettings.scoring.shutouts,
                        goalsAgainst: lastStats.goalsAgainst * leagueSettings.scoring.goalsAgainst,
                        fantasyPoints: parseFloat(fantasyPoints.toFixed(2))
                        });
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
                            name: player.data.player_details.name,
                            team: playerTeam,
                            position: player.data.player_details.positionCode,
                            games_played: lastStats.gamesPlayed,
                            goals: lastStats.goals,
                            assists: lastStats.assists,
                            shots: lastStats.shots,
                            plusMinus: lastStats.plusMinus,
                            hits: lastStats.hits,
                            blocks: lastStats.blocks,
                            ppp: lastStats.powerPlayPoints,
                            fantasyPoints: parseFloat(fantasyPoints.toFixed(2))
                        });
                        temp_playerFantasyStats.push({
                        ...player,
                        name: player.data.player_details.name,
                        team: playerTeam,
                        position: player.data.player_details.positionCode,
                        games_played: lastStats.gamesPlayed,
                        goals: lastStats.goals * leagueSettings.scoring.goals,
                        assists: lastStats.assists * leagueSettings.scoring.assists,
                        shots: lastStats.shots * leagueSettings.scoring.shots,
                        plusMinus: lastStats.plusMinus * leagueSettings.scoring.plusMinus,
                        hits: lastStats.hits * leagueSettings.scoring.hits,
                        blocks: lastStats.blocks * leagueSettings.scoring.blocks,
                        ppp: lastStats.powerPlayPoints * leagueSettings.scoring.powerPlayPoints,
                        fantasyPoints: parseFloat(fantasyPoints.toFixed(2))
                    })
                }
            }
            
        }
        setPlayerFantasyStats(temp_playerFantasyStats);
        setPlayerStats(temp_playerStats);
        }

        
      }, [players, teams, leagueSettings]);

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
      

    // Define columns for the DataGrid
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
        <div className="players-page">
          {currentUser && playerStats ? (
            <>
              <h1>All Players</h1>
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
                            selectedPosition.includes(row.position) &&
                            (selectedTeam === "" || row.team === selectedTeam)
                        )}
                      columns={columns.map((column) => ({
                        ...column,
                        headerClassName: classes.columnHeader,
                      }))}
                      pageSize={5}
                      rowsPerPageOptions={[5, 10, 25]}
                      className={classes.row}
                      getRowId={(row) => row.name}
                    />
                  ) : (
                    <DataGrid
                      autoWidth
                      rows={playerStats.filter((row) =>
                            row.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                            selectedPosition.includes(row.position) &&
                            (selectedTeam === "" || row.team === selectedTeam)
                        )}
                      columns={columns.map((column) => ({
                        ...column,
                        headerClassName: classes.columnHeader,
                      }))}
                      pageSize={5}
                      rowsPerPageOptions={[5, 10, 25]}
                      className={classes.row}
                      getRowId={(row) => row.name}
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
};

export default Players;
