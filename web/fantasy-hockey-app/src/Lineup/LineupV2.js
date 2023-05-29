import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useUser } from '../UserContext';
import Navbar from '../Navbar/Navbar';
import {arrayMove} from '@dnd-kit/sortable';
import SortableTable from './SortableTable';
import './Lineup.css'

const useStyles = makeStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    },
    tableContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
    individualTableContainer: {
      width: '100%',
    },
    lowerTableContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      marginTop: '4rem',
    },
    lowerIndividualTableContainer: {
      width: '100%',
    },
    topThree: {
      backgroundColor: '#f0f0f0',
    },
    bench: {
        backgroundColor: '#f0f0f0',
    },
    starter: {
        backgroundColor: '#1aa7ec',
    }
  });


const LineupV2 = () => {
  const classes = useStyles();
  const [currentManager, setCurrentManager] = useState(null);
  const { currentUser, managers, leagueSettings, teams } = useUser();

  const [ leftWingPlayers, setLeftWingPlayers ] = useState([]);
  const [ rightWingPlayers, setRightWingPlayers ] = useState([]);
  const [ centrePlayers, setCentrePlayers ] = useState([]);
  const [ defencePlayers, setDefencePlayers ] = useState([]);
  const [ goaliePlayers, setGoaliePlayers ] = useState([]);

  const [ positions, setPositions ] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      for (const manager of managers) {
        if (manager['id'] === currentUser.uid) {
          setCurrentManager(manager);
        }
      }
    };

    fetchData();
  }, [managers, currentUser.uid]);

  const columns = [
    { field: 'name', headerName: 'Name', width: 150, sortable: false, disableColumnMenu: true },
    { field: 'position', headerName: 'POS', width: 25, sortable: false, disableColumnMenu: true },
    { field: 'team', headerName: 'Team', width: 50, sortable: false, disableColumnMenu: true },
  ];

  useEffect(() => {
    const getPositions = () => {
      const positionsMax = { "C": [], "L": [], "R": [], "D": [], "G": [] };
        
      if (leagueSettings && leagueSettings.positions)
      {
        for (const code in leagueSettings.positions) {
            if (code != 'B'){
                let maxValue = leagueSettings.positions[code];
                let value = 1;
                console.log(code)
                
                while (value <= maxValue) {
                    positionsMax[code].push(`${code}${value}`);
                    value++;
                }
                positionsMax[code].push("Bench");
                positionsMax[code].push("Bench");
                positionsMax[code].push("Bench");
                positionsMax[code].push("Bench");
                positionsMax[code].push("Bench");
                positionsMax[code].push("Bench");
            }
        }
        setPositions(positionsMax); // Update the state here
      }
    };
  
    getPositions();
  }, [leagueSettings]);
  
  const findTeam = (teamId) => {
    for (const team of teams){
        console.log(team)
        if (team.data.team_details.id == teamId){
            return team;
        }
    }
  }


  const players = currentManager?.player_data?.map((player, index) => {
    
    const team = findTeam(player.player_details.teamID)

    return {
      id: player.player_details.id,
      name: player.player_details.name,
      team: team.data.team_details.abbreviation,
      position: player.player_details.positionCode,
      ...player,
    };
  });
  
  
  

  useEffect(() => {
    const setPlayers = () => {
      if (leftWingPlayers.length === 0) {
        setLeftWingPlayers(players.filter(player => player.position === 'L'));
      }
      if (centrePlayers.length === 0) {
        setCentrePlayers(players.filter(player => player.position === 'C'));
      }
      if (rightWingPlayers.length === 0) {
        setRightWingPlayers(players.filter(player => player.position === 'R'));
      }
      if (defencePlayers.length === 0) {
        setDefencePlayers(players.filter(player => player.position === 'D'));
      }
      if (goaliePlayers.length === 0) {
        setGoaliePlayers(players.filter(player => player.position === 'G'));
      }
    };
  
    if (players) {
      setPlayers();
    }
  }, [players, leftWingPlayers, centrePlayers, rightWingPlayers, defencePlayers, goaliePlayers]);
  
  
  const handleDragEnd = useCallback((event, setState) => {
    const { active, over } = event;
  
    if (active.id !== over.id) {
      setState((items) => {
        const activeIndex = items.findIndex(({ id }) => id === active.id);
        const overIndex = items.findIndex(({ id }) => id === over.id);
  
        return arrayMove(items, activeIndex, overIndex);
      });
    }
  }, []);

  return (
    <>
      <div className={`lineup-container ${classes.container}`}>
        {players && (
          <>
            <div className={`lineup-table-container ${classes.tableContainer}`}>
              <div className={`lineup-individual-table-container ${classes.individualTableContainer}`}>
                <h2 className="lineup-position-header">Left Wing</h2>
                <SortableTable
                  players={leftWingPlayers}
                    handleDragEnd={(event) => handleDragEnd(event, setLeftWingPlayers)}
                    columns={columns}
                    rosterSpots={positions["L"]}
                    classes={classes}
                    constantColumn={{
                        header: '',
                        cell: (rowData, rosterSpot) => <div>{rosterSpot}</div>,
                    }}
                />
              </div>
              <div className={`lineup-individual-table-container ${classes.individualTableContainer}`}>
                <h2 className="lineup-position-header">Center</h2>
                <SortableTable
                  players={centrePlayers}
                    handleDragEnd={(event) => handleDragEnd(event, setCentrePlayers)}
                    columns={columns}
                    rosterSpots={positions["C"]}
                    classes={classes}
                    constantColumn={{
                        header: '',
                        cell: (rowData, rosterSpot) => <div>{rosterSpot}</div>,
                    }}
                />
              </div>
              <div className={`lineup-individual-table-container ${classes.individualTableContainer}`}>
                <h2 className="lineup-position-header">Right Wing</h2>
                <SortableTable
                  players={rightWingPlayers}
                    handleDragEnd={(event) => handleDragEnd(event, setRightWingPlayers)}
                    columns={columns}
                    rosterSpots={positions["R"]}
                    classes={classes}
                    constantColumn={{
                        header: '',
                        cell: (rowData, rosterSpot) => <div>{rosterSpot}</div>,
                    }}
                />
              </div>
              <div className={`lineup-individual-table-container ${classes.lowerIndividualTableContainer}`}>
                <h2 className="lineup-position-header">Defence</h2>
                <SortableTable
                  players={defencePlayers}
                    handleDragEnd={(event) => handleDragEnd(event, setDefencePlayers)}
                    columns={columns}
                    rosterSpots={positions["D"]}
                    classes={classes}
                    constantColumn={{
                        header: '',
                        cell: (rowData, rosterSpot) => <div>{rosterSpot}</div>,
                    }}
                />
              </div>
              <div className={`lineup-individual-table-container ${classes.lowerIndividualTableContainer}`}>
                <h2 className="lineup-position-header">Goalies</h2>
                <SortableTable
                  players={goaliePlayers}
                    handleDragEnd={(event) => handleDragEnd(event, setGoaliePlayers)}
                    columns={columns}
                    rosterSpots={positions["G"]}
                    classes={classes}
                    constantColumn={{
                        header: '',
                        cell: (rowData, rosterSpot) => <div>{rosterSpot}</div>,
                    }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default LineupV2;