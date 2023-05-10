import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useUser } from '../UserContext';
import Navbar from '../Navbar/Navbar';
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TableRow from './TableRow';
import { TableCell } from '@material-ui/core';
import SortableTable from './SortableTable';

const useStyles = makeStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    },
    tableContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
    },
    individualTableContainer: {
      width: '30%',
    },
    lowerTableContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      width: '100%',
      marginTop: '4rem',
    },
    lowerIndividualTableContainer: {
      width: '45%',
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

const Lineup = () => {
  const classes = useStyles();
  const [currentManager, setCurrentManager] = useState(null);
  const { currentUser, managers, leagueSettings } = useUser();

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
    { field: 'name', headerName: 'Name', width: 200, sortable: false, disableColumnMenu: true },
    { field: 'position', headerName: 'Position', width: 150, sortable: false, disableColumnMenu: true },
    { field: 'team', headerName: 'Team', width: 150, sortable: false, disableColumnMenu: true },
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
  

  const players = currentManager?.player_data?.map((player, index) => {
    
    return {
      id: player.player_details.id,
      name: player.player_details.name,
      team: player.player_details.teamID,
      position: player.player_details.positionCode,
      ...player,
    };
  });

  const getRowClassName = (params) => {
    return !params.row.id.toString();
  };  

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
      <Navbar />
      <div className={classes.container}>
        {players && (
          <>
            <div className={classes.tableContainer}>
            <div className={classes.individualTableContainer}>
                <h2>Left Wing</h2>
                <SortableTable
                    players={leftWingPlayers}
                    handleDragEnd={(event) => handleDragEnd(event, setLeftWingPlayers)}
                    columns={columns}
                    rosterSpots={positions["L"]}
                    classes={classes}
                    constantColumn={{
                        header: 'Roster Spot',
                        cell: (rowData, rosterSpot) => <div>{rosterSpot}</div>,
                    }}
                />
              </div>
              <div className={classes.individualTableContainer}>
                <h2>Center</h2>
                <SortableTable
                    players={centrePlayers}
                    handleDragEnd={(event) => handleDragEnd(event, setCentrePlayers)}
                    columns={columns}
                    rosterSpots={positions["C"]}
                    classes={classes}
                    constantColumn={{
                        header: 'Roster Spot',
                        cell: (rowData, rosterSpot) => <div>{rosterSpot}</div>,
                    }}
                />
              </div>
              <div className={classes.individualTableContainer}>
                <h2>Right Wing</h2>
                <SortableTable
                    players={rightWingPlayers}
                    handleDragEnd={(event) => handleDragEnd(event, setRightWingPlayers)}
                    columns={columns}
                    rosterSpots={positions["R"]}
                    classes={classes}
                    constantColumn={{
                        header: 'Roster Spot',
                        cell: (rowData, rosterSpot) => <div>{rosterSpot}</div>,
                    }}
                />
              </div>
            </div>
            <div className={classes.lowerTableContainer}>
              <div className={classes.lowerIndividualTableContainer}>
                <h2>Defence</h2>
                <SortableTable
                    players={defencePlayers}
                    handleDragEnd={(event) => handleDragEnd(event, setDefencePlayers)}
                    columns={columns}
                    rosterSpots={positions["D"]}
                    classes={classes}
                    constantColumn={{
                        header: 'Roster Spot',
                        cell: (rowData, rosterSpot) => <div>{rosterSpot}</div>,
                    }}
                />
              </div>
              <div className={classes.lowerIndividualTableContainer}>
                <h2>Goalies</h2>
                <SortableTable
                    players={goaliePlayers}
                    handleDragEnd={(event) => handleDragEnd(event, setGoaliePlayers)}
                    columns={columns}
                    rosterSpots={positions["G"]}
                    classes={classes}
                    constantColumn={{
                        header: 'Roster Spot',
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

export default Lineup;