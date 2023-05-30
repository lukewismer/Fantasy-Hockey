import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import { DataGrid } from '@mui/x-data-grid';
import { makeStyles } from '@material-ui/core/styles';
import { PositionFilter, StatsFilter, TeamFilter, ManagerFilter, PlayerFilter } from './TableFilters';
import './Players.css';

import { BsPlus } from "react-icons/bs";
import { MdOutlineSwapHoriz } from "react-icons/md";
import { BiMinus } from "react-icons/bi";


import { Grid } from '@material-ui/core'; // Import Grid

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      width: '100%'
    },
    row: {
      '&:nth-of-type(odd)': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)', // Light grey for odd rows
      },
    },
    columnHeader: {
      backgroundColor: '#3f51b5', // Dark blue for column headers
      color: '#ffffff', // White color for header text
      fontSize: '1.1em',
    },
    boldCell: {
      fontWeight: 'bold',
      fontSize: '1.1em', // Increase font size
      borderRight: '1px solid #ddd', // Add right border
    },
    positionColumn: {
      borderRight: '1px solid #ddd', // Light grey border on the right side
    },
    cell: {
      fontSize: '0.9em',  // Set this to your desired font size
    },
    iconCell: {
      width: '25px',
      height: '25px',
      cursor: 'pointer',
    }
  }));

const Players = ({managerFilter, teamFilter, positionFilter, playerFilter}) => {
    const classes = useStyles();
    const { currentUser, setCurrentUser, leagueSettings, players, teams, managers, setManagers } = useUser();
    const [playerFantasyStats, setPlayerFantasyStats] = useState([]);
    const [playerStats, setPlayerStats] = useState([]);

    const [isFantasyStats, setIsFantasyStats] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPosition, setSelectedPosition] = useState(positionFilter ? positionFilter : ['L', 'R', 'C', 'D', "G"]);
    const [selectedTeam, setSelectedTeam] = useState(teamFilter ? teamFilter : "");
    const [selectedManager, setSelectedManager] = useState(managerFilter ? managerFilter : "");
    const [selectedPlayer, setSelectedPlayer] = useState(playerFilter ? playerFilter : "");

    const [freeAgents, setFreeAgents] = useState([]);


    useEffect(() => {
        if (leagueSettings && players && players.length > 0 && teams && teams.length > 0){
            const temp_playerStats = []
            const temp_playerFantasyStats = []

            for (const player of players) {
                const lastStats = player.data.player_stats[player.data.player_stats.length - 1];

                if (lastStats)
                {
                    let playerTeam = "";
                    let playerAction = "FA";

                    for (let team of teams){
                        if (team.data.team_details.id === player.data.player_details.teamID){
                            playerTeam = team.data.team_details.abbreviation;
                        }
                    }

                    for (let manager of managers){
                      if (manager.details.players.length > 0 && manager.details.players.includes(player.id.toString())){
                        playerAction = "TAKEN";
                      }
                    }

                    if (currentUser.details.players.length > 0 && currentUser.details.players.includes(player.id.toString())){
                      playerAction = "USER";
                    }

                    if (player.data.player_details.positionCode == "G"){
                        let fantasyPoints = 0;
                        fantasyPoints += lastStats.wins * leagueSettings.scoring.wins;
                        fantasyPoints += lastStats.saves * leagueSettings.scoring.saves;
                        fantasyPoints += lastStats.shutouts * leagueSettings.scoring.shutouts;
                        fantasyPoints += lastStats.goalsAgainst * leagueSettings.scoring.goalsAgainst;
                
                        temp_playerStats.push({
                            ...player,
                            action: playerAction,
                            playerId: player.data.player_details.id,
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
                        action: playerAction,
                        playerId: player.data.player_details.id,
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
                            action: playerAction,
                            playerId: player.data.player_details.id,
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
                        action: playerAction,
                        playerId: player.data.player_details.id,
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

    const handleManagerChange = (event) => {
      const value = event.target.value === "All Managers" ? "" : event.target.value;
      let managerData = ""
      for (let manager of managers){
        if (manager.details.username === value){
          managerData = manager;
        }
      }
      setSelectedManager(managerData);
    };

    const handlePlayersChange = (event) => {
      const value = event.target.value === "All Players" ? "" : event.target.value;
      setSelectedPlayer(value);
    };
      
    const renderCell = (params) => (
      <div className={classes.cell}>
          {params.value}
      </div>
    );

    const handlePlayerActionClick = (action, params) => {
      if (action === "FA" && leagueSettings.rosterSize - currentUser.players.length > 0){
        let tempCurrentUser = currentUser;
        tempCurrentUser.players.push(params.row.id.toString());
        setCurrentUser(tempCurrentUser);

        let tempManagers = managers;
        for (let manager of tempManagers){
          if (manager.details.username === currentUser.username){
            manager.details.players.push(params.row.id.toString());
          }
        }
        alert("Player added to your roster!");
      }
      else if (action === "FA" && leagueSettings.rosterSize - currentUser.players.length <= 0){
        alert("You have reached your roster limit!");
      }
      else if (action === "USER"){
        let tempCurrentUser = currentUser;
        tempCurrentUser.players = tempCurrentUser.players.filter((player) => player !== params.row.id.toString());
        setCurrentUser(tempCurrentUser);
        alert("Player removed from your roster!");
        
        let tempManagers = managers;
        for (let manager of tempManagers){
          if (manager.details.username === currentUser.username){
            manager.details.players = manager.details.players.filter((player) => player !== params.row.id.toString());
            manager.player_data = manager.player_data.filter((player) => player.player_details.id !== params.row.id.toString());
          }
        }

        freeAgents.push(params.row.id.toString());
      }

      // Add a toast message here

    }

    useEffect(() => {
      let tempFreeAgents = [];
      for (let manager of managers){
        for (let player of manager.details.players){
          tempFreeAgents.push(player);
        }
      }
      setFreeAgents(tempFreeAgents);
    }, [managers])

    const columns = [
        {
          field: "action",
          headerName: "",
          width: 10,
          renderCell: (params) => (
            <>{params.value === "FA" ? (<BsPlus onClick={() => handlePlayerActionClick("FA", params)} className={classes.iconCell}/>) : (params.value === "TAKEN" ? (<MdOutlineSwapHoriz  onClick={() => handlePlayerActionClick("TAKEN", params)} className={classes.iconCell}/>) : (<BiMinus onClick={() => handlePlayerActionClick("USER", params)} className={classes.iconCell}/>))}</>
          )
        },
        { 
          field: 'name', 
          headerName: 'Name', 
          width: 110, 
          cellClassName: classes.boldCell,
          renderCell: (params) => (
            <div className={classes.cell}>
              {params.value.split(" ")[0]}<br/>
              {params.value.split(" ")[1]}
            </div>
          ),
        },
        { 
          field: 'position', 
          headerName: 'POS', 
          width: 0, 
          renderCell: renderCell
        },
        { field: 'team', headerName: 'Team', width: 50, renderCell: renderCell, },
        { field: 'fantasyPoints', headerName: 'Points', width: 75, renderCell: (params) => (
          <div className={classes.cell}>
            <strong>{params.value}</strong>
          </div>
        ), },
        { field: 'games_played', headerName: 'GP', width: 0, renderCell: renderCell, },
        { field: 'goals', headerName: 'G', width: 0, renderCell: renderCell, },
        { field: 'assists', headerName: 'A', width: 0, renderCell: renderCell, },
        { field: 'shots', headerName: 'S', width: 0, renderCell: renderCell, },
        { field: 'plusMinus', headerName: '+/-', width: 0, renderCell: renderCell, },
        { field: 'ppp', headerName: 'PPP', width: 0, renderCell: renderCell, },
        { field: 'hits', headerName: 'H', width: 0, renderCell: renderCell, },
        { field: 'blocks', headerName: 'B', width: 0, renderCell: renderCell, },
        { field: 'wins', headerName: 'W', width: 0, renderCell: renderCell, },
        { field: 'saves', headerName: 'SA', width: 0, renderCell: renderCell, },
        { field: 'shutouts', headerName: 'SO', width: 0, renderCell: renderCell, },
        { field: 'goalsAgainst', headerName: 'GA', width: 0, renderCell: renderCell, },
      ];

      console.log(selectedManager);
    return (
        <div className="players-page">
          {currentUser && playerStats ? (
            <>
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

                  <ManagerFilter selectedManager={selectedManager} handleManagerChange={handleManagerChange} managers={managers} />

                  <PlayerFilter selectedPlayers={selectedPlayer} handlePlayersChange={handlePlayersChange} />
                  
                  
                  <Grid container className={classes.root}>
                  {isFantasyStats ? (
                    <div>
                      <DataGrid
                        rows={playerFantasyStats.filter((row) =>
                              row.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                              selectedPosition.includes(row.position) &&
                              (selectedTeam === "" || row.team === selectedTeam) &&
                              (selectedManager === "" || (selectedManager.details.players.length > 0 && selectedManager.details.players.includes(row.id.toString()))) &&
                              (selectedPlayer === "" || selectedPlayer === "All Players" || (selectedPlayer === "Free Agents" && !freeAgents.includes(row.id.toString())) ||
                              (selectedPlayer === "All Taken" && freeAgents.includes(row.id.toString())))
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
                    </div>
                  ) : (
                    <div>
                      <DataGrid
                        rows={playerStats.filter((row) =>
                              row.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                              selectedPosition.includes(row.position) &&
                              (selectedTeam === "" || row.team === selectedTeam) &&
                              (selectedManager === "" || (selectedManager.details.players.length > 0 && selectedManager.details.players.includes(row.id.toString()))) &&
                              (selectedPlayer === "" || selectedPlayer === "All Players" || (selectedPlayer === "Free Agents" && !freeAgents.includes(row.id.toString())) ||
                              (selectedPlayer === "All Taken" && freeAgents.includes(row.id.toString())))
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
                    </div>
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
