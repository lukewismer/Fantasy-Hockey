import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../UserContext';
import { getDocs, getDoc, doc, query, where, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useLocation } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)', // Light grey for odd rows
    },
  },
});


const UserHome = () => {
  const { currentUser, managers, setManagers, leagueSettings, setLeagueSettings } = useUser();
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const unsubscribeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      if (location.state && location.state.userData) {
        setUserData(location.state.userData);
      } else {
        await fetchUserData();
      }
      await fetchManagers();
      await fetchLeagueSettings();
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
  
  

  const sortedRows = managers
  .map((manager, index) => ({
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
  ];
  
  
  return (
    <div className="home-page">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <header className="header">
            {userData ? (
              <>
                <h1>Welcome back, {userData.username}</h1>
                <h2>Points: {userData.score}</h2>
              </>
            ) : (
              <h1>Loading</h1>
            )}
          </header>
          <Navbar />
          <main>
            {managers && managers.length > 0 && (
              <div style={{ height: 400, width: '80%' }}>
                <DataGrid
                  classes={{row: classes.row}}
                  rows={sortedRows}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
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
          <footer className="footer">
            <p>&copy; 2023 FantasyHockeyRealm. All rights reserved.</p>
          </footer>
        </>
      )}
    </div>
  );
  
};  

export default UserHome;
