import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../UserContext';
import { getDocs, getDoc, doc, query, where, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useLocation } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Container, Typography, makeStyles } from '@material-ui/core';

import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  header: {
    marginBottom: theme.spacing(2),
    textAlign: 'center'
  },
  title: {
    marginTop: theme.spacing(2),
  },
  dataTable: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  footer: {
    marginTop: theme.spacing(4),
    textAlign: 'center',
    padding: theme.spacing(2),
    backgroundColor: '#f8f9fa',
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
  },
}));


const UserHome = () => {
  const { currentUser, managers, setManagers, setLeagueSettings, setPlayers, setTeams } = useUser();
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const unsubscribeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      if (location.state && location.state.userData) {
        setUserData(location.state.userData);
      } else {
        await fetchUserData();
      }
      await fetchManagers();
      await fetchLeagueSettings();
      await fetchTeamData();
      await fetchPlayerData();
      setIsLoading(false);
    };
  
    if (currentUser) {
      fetchData();
    }
  
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [currentUser, location.state]);
  

  const fetchUserData = async () => {
    if (currentUser) {
      const userQuery = query(
        collection(db, 'users'),
        where('username', '==', currentUser.username)
      );

      unsubscribeRef.current = onSnapshot(userQuery, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setUserData(doc.data());
        });
      });
    } else {
        console.log("no user")
    }
  };

  const fetchManagers = async () => {
    if (currentUser) {
      const managerQuery = query(
        collection(db, 'leagues'),
        where('managers', 'array-contains', currentUser.uid)
      );
  
      // Listen for changes in the matching documents
      unsubscribeRef.current = onSnapshot(managerQuery, async (querySnapshot) => {
        let temp_managers = [];
  
        querySnapshot.forEach((doc) => {
          const leagueData = doc.data();
          leagueData.managers.forEach(manager_id => temp_managers.push(manager_id));
        });
  
        let new_managers = [];
  
        // Fetch manager_data for all managers in parallel
        const manager_data_promises = temp_managers.map(manager_id => fetchDocumentById("users", manager_id));
        const manager_data_list = await Promise.all(manager_data_promises);
  
        for (const [index, manager_data] of manager_data_list.entries()) {
          const manager_id = temp_managers[index];
          let temp_data = { "id": manager_id, "details": manager_data, "player_data": [] }
  
          // Fetch player data for all players in parallel
          const player_ids = manager_data.players;
          const player_data_promises = player_ids.map(player_id => fetchDocumentById("active_players", player_id));
          const player_data_list = await Promise.all(player_data_promises);
  
          for (const playerdata of player_data_list) {
            temp_data["player_data"].push(playerdata );
          }

          new_managers.push(temp_data)
        }
  
        setManagers(new_managers);
      });
    }
  }

  const fetchLeagueSettings = async () => {
    const leagueQuery = query(
      collection(db, 'leagues'),
      where('managers', 'array-contains', currentUser.uid)
    );

    unsubscribeRef.current = onSnapshot(leagueQuery, async (querySnapshot) => {

      querySnapshot.forEach((doc) => {
        const leagueData = doc.data();
        setLeagueSettings(leagueData)
      });
    });
  }

  const fetchTeamData = async () => {
    const teamQuery = query(
      collection(db, 'teams_v2')
    );

    let allTeamData = []
    unsubscribeRef.current = onSnapshot(teamQuery, async (querySnapshot) => {

      querySnapshot.forEach((doc) => {
        const teamData = doc.data();
        allTeamData.push(teamData)
      });
    });
    setTeams(allTeamData)
  }

  const fetchPlayerData = async () => {
    const playerQuery = query(
      collection(db, 'active_players')
    );

    unsubscribeRef.current = onSnapshot(playerQuery, async (querySnapshot) => {

      querySnapshot.forEach((doc) => {
        const playerData = doc.data();
        setPlayers(playerData)
      });
    });
  }
  
  const fetchDocumentById = async (collectionName, documentId) => {
    // Get a reference to the specific document by its document ID
    const documentRef = doc(db, collectionName, documentId);
  
    // Retrieve the document data
    const documentSnapshot = await getDoc(documentRef);
  
    if (documentSnapshot.exists()) {
      return documentSnapshot.data();
    } else {
      console.log('No such document found');
      return null;
    }
  };
  
  const fetchManagerData = (manager) => {
    let stats  = {"Normal": {"goals": 0, "assists": 0, "shots": 0, "blocks": 0, "hits" :0, "plusMinus": 0, "powerPlayPoints": 0, "wins": 0, "saves": 0, "shutouts":0},
     "Fantasy": {"goals": 0, "assists": 0, "shots": 0, "blocks": 0, "hits" :0, "plusMinus": 0, "powerPlayPoints": 0, "wins": 0, "saves": 0, "shutouts":0}}
    for (player in manager.player_data){
      
    }
  }

  const sortedRows = managers.map((manager, index) => ({
    id: index,
    username: manager.details.username,
    score: manager.details.score,
  }))
  .sort((a, b) => b.score - a.score)
  .map((row, index) => ({
    ...row,
    rowIndex: index + 1,
  }));

  const columns = [
    {
      field: 'username',
      headerName: 'Username',
      width: 150,
      sortable: true,
      renderCell: (params) => {
        const manager = managers[params.row.id];
        return (
          <Link to={`/teams?team_id=${manager.id}`}>
            {params.row.username}
          </Link>
        );
      },
    },
    { field: 'score', headerName: 'Score', width: 150, sortable: true },
    { field: 'score', headerName: 'Goals', width: 150, sortable: true },
    { field: 'score', headerName: 'Assists', width: 150, sortable: true },
    { field: 'score', headerName: 'Shots', width: 150, sortable: true },
    { field: 'score', headerName: 'Hits', width: 150, sortable: true },
    { field: 'score', headerName: 'Blocks', width: 150, sortable: true },
    { field: 'score', headerName: 'Wins', width: 150, sortable: true },
    { field: 'score', headerName: 'Saves', width: 150, sortable: true },
    { field: 'score', headerName: 'Shutouts', width: 150, sortable: true },
  ];
  
  return (
    <Container className={classes.root}>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <header className={classes.header}>
            {userData ? (
              <>
                <Typography variant="h4" component="h1">
                  Welcome back, {userData.username}
                </Typography>
                <Typography variant="h6" component="h2">
                  Points: {userData.score}
                </Typography>
              </>
            ) : (
              <Typography variant="h4" component="h1">
                Loading
              </Typography>
            )}
          </header>
          <Navbar />
          <main>
            {managers && managers.length > 0 && (
              <div style={{ height: '100%', width: '100%' }} className={classes.dataTable}>
                <DataGrid
                  classes={{row: classes.row}}
                  rows={sortedRows}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                  hideFooter
                  sortModel={[
                    {
                      field: 'score',
                      sort: 'desc',
                    },
                  ]}
                />
              </div>
            )}
          </main>
          <footer className={classes.footer}>
            <Typography variant="body2" color="textSecondary" component="p">
              &copy; 2023 FantasyHockeyRealm. All rights reserved.
            </Typography>
          </footer>
        </>
      )}
    </Container>
  );
};  

export default UserHome;
