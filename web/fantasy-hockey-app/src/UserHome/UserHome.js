import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../UserContext';
import { getDocs, getDoc, doc, query, where, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useLocation } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { setItem } from '../indexedDB';
import Card from './Card'
import Players from '../Players/Players';

import { StatsFilter } from '../Players/TableFilters';

import './UserHome.css';
import LineupV2 from '../Lineup/LineupV2';

import logo from './fantasyhockeyrealm-logo.png';

import { BsFillHouseFill, BsPeopleFill } from "react-icons/bs";
import { FaPeopleArrows, FaSearch } from "react-icons/fa";

const teamStoreName = 'teams';
const playerStoreName = 'players';

const UserHome = () => {
  const { currentUser, managers, setManagers, leagueSettings, setLeagueSettings, setPlayers, setTeams } = useUser();
  const location = useLocation();
  const unsubscribeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const [ menuItem, setMenuItem ] = useState("home");

  const [ playerTeamFilter, setPlayerTeamFilter ] = useState("");

  const [isFantasyStats, setIsFantasyStats] = useState(true);

  const playerMenuItemRef = useRef(null);


  useEffect(() => {
    const fetchData = async () => {
      console.log("fetched user data");
      await fetchManagers();
      console.log("fetched managers");
      await fetchLeagueSettings();
      console.log("fetched league settings");
      await fetchTeamData();
      console.log("fetched team data");
      await fetchPlayerData();
      console.log("fetched player data");
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
  

  const fetchManagers = async () => {
    if (currentUser) {
      const managerQuery = query(
        collection(db, 'leagues'),
        where('managers', 'array-contains', currentUser.id)
      );
  
      // Listen for changes in the matching documents
      unsubscribeRef.current = onSnapshot(managerQuery, async (querySnapshot) => {
        let temp_managers = [];
  
        querySnapshot.forEach((doc) => {
          const leagueData = doc.data();
          leagueData.managers.forEach(manager_id => temp_managers.push(manager_id));
        });
  
        // Fetch manager_data for all managers in parallel
        const manager_data_promises = temp_managers.map(manager_id => fetchDocumentById("users", manager_id));
        const manager_data_list = await Promise.all(manager_data_promises);
  
        setManagers(manager_data_list);
      });
    }
  }

  const fetchLeagueSettings = async () => {
    const leagueQuery = query(
      collection(db, 'leagues'),
      where('managers', 'array-contains', currentUser.id)
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
        const updated_teamData = {"id": teamData.team_details.id, "data": teamData}
        allTeamData.push(updated_teamData)
        setItem(teamStoreName, updated_teamData)
      });
      setTeams(allTeamData); 
    });
  }

  const fetchPlayerData = async () => {
    const playerQuery = query(
      collection(db, 'active_players')
    );
    const allPlayers = []
    unsubscribeRef.current = onSnapshot(playerQuery, async (querySnapshot) => {
      
      querySnapshot.forEach((doc) => {
        const playerData = doc.data();
        const updated_playerData = {"id": playerData.player_details.id, "data": playerData}
        allPlayers.push(updated_playerData)
        setItem(playerStoreName, updated_playerData)
      });
      setPlayers(allPlayers)
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

  
  const sortedRowsNormal = managers.map((manager, index) => ({
    id: index,
    username: manager.details.username,
    score: manager.details.score,
    goals: manager.stats.Normal.goals,
    assists: manager.stats.Normal.assists,
    shots: manager.stats.Normal.shots,
    plusMinus: manager.stats.Normal.plusMinus,
    powerPlayPoints: manager.stats.Normal.powerPlayPoints,
    hits: manager.stats.Normal.hits,
    blocks: manager.stats.Normal.blocks,
    wins: manager.stats.Normal.wins,
    saves: manager.stats.Normal.saves,
    shutouts: manager.stats.Normal.shutouts,
    goalsAgainst: manager.stats.Normal.goalsAgainst,
  }))
  .sort((a, b) => b.score - a.score)
  .map((row, index) => ({
    ...row,
    rowIndex: index + 1,
  }));

  const sortedRowsFantasy = managers.map((manager, index) => ({
    id: index,
    username: manager.details.username,
    score: manager.details.score,
    goals: manager.stats.Fantasy.goals,
    assists: manager.stats.Fantasy.assists,
    shots: manager.stats.Fantasy.shots,
    plusMinus: manager.stats.Fantasy.plusMinus,
    powerPlayPoints: manager.stats.Fantasy.powerPlayPoints,
    hits: manager.stats.Fantasy.hits,
    blocks: manager.stats.Fantasy.blocks,
    wins: manager.stats.Fantasy.wins,
    saves: manager.stats.Fantasy.saves,
    shutouts: manager.stats.Fantasy.shutouts,
    goalsAgainst: manager.stats.Fantasy.goalsAgainst,
  }))
  .sort((a, b) => b.score - a.score)
  .map((row, index) => ({
    ...row,
    rowIndex: index + 1,
  }));

  const handleStatsChange = (event) => {
    setIsFantasyStats(event.target.value);
  };

  const handleClickOnManager = (event) => {
    setMenuItem("players");
    for (let manager of managers){
      if (manager.details.username === event.value){

        setPlayerTeamFilter(manager);
      }
    }

    menuItems.forEach(i => i.classList.remove('selected'));
    menuItems.forEach(i => i.classList.add('unselected'));

    playerMenuItemRef.current.classList.remove('unselected');
    playerMenuItemRef.current.classList.add('selected');

  }

  const columns = [
    {
      field: 'username',
      headerName: 'Username',
      width: 150,
      sortable: true,
      renderCell: (params) => (
        <div
          onClick={() => handleClickOnManager(params)}
          style={{ cursor: 'pointer' }}
        >
          {params.value}
        </div>
      ),
    },
    { field: 'score', headerName: 'Score', width: 100, sortable: true},
    { field: 'goals', headerName: 'Goals', width: 85, sortable: true },
    { field: 'assists', headerName: 'Assists', width: 85, sortable: true },
    { field: 'shots', headerName: 'Shots', width: 85, sortable: true },
    { field: 'plusMinus', headerName: '+/-', width: 85, sortable: true },
    { field: 'powerPlayPoints', headerName: 'PPP', width: 85, sortable: true },
    { field: 'hits', headerName: 'Hits', width: 85, sortable: true },
    { field: 'blocks', headerName: 'Blocks', width: 85, sortable: true },
    { field: 'wins', headerName: 'Wins', width: 85, sortable: true },
    { field: 'saves', headerName: 'Saves', width: 85, sortable: true },
    { field: 'shutouts', headerName: 'Shutouts', width: 85, sortable: true },
    { field: 'goalsAgainst', headerName: 'GA', width: 85, sortable: true },
  ];

  let menuItems = document.querySelectorAll('.menu-item');

  // Add event listener to each menu item
  menuItems.forEach(item => {
      item.addEventListener('click', function() {
          // Remove the 'selected' class from all menu items
          menuItems.forEach(i => i.classList.remove('selected'));
          menuItems.forEach(i => i.classList.add('unselected'));

          // Add the 'selected' class to the clicked item
          this.classList.remove('unselected');
          this.classList.add('selected');
      });
  });

  const handleMenuItemClick = (item) => {
    setMenuItem(item);
  };
  
  return (
    <div className="root">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="sidebar">
            <div className='logo-container'><img src={logo} className='logo-img'></img></div>
            <div class="menu-label">Pages</div>
            <div onClick={() => handleMenuItemClick("home")} class="menu-item selected">
              <div className="item-content">
                  <BsFillHouseFill />
                  <span>Home</span>
              </div>
            </div>
            <div onClick={() => handleMenuItemClick("lineup")} class="menu-item unselected">
              <div className="item-content">
                  <FaPeopleArrows />
                  <span>Lineup</span>
              </div>
            </div>
            <div onClick={() => handleMenuItemClick("players")} class="menu-item unselected" ref={playerMenuItemRef}>
              <div className="item-content">
                  <BsPeopleFill />
                  <span>Players</span>
              </div>
            </div>
          </div>
          <div className="main">
            {menuItem === "home" ? ( 
            <main>
              <>
                <h1>Welcome back, {currentUser.details.username}</h1>
                <h2>Points: {currentUser.details.score}</h2>
              </>
              <StatsFilter isFantasyStats={isFantasyStats} handleStatsChange={handleStatsChange} />
              {managers && managers.length > 0 && (
                isFantasyStats ? (
                  <div className="data-table">
                    <DataGrid
                      classes={{row: "row"}}
                      rows={sortedRowsFantasy}
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      disableSelectionOnClick
                      hideFooter
                    />
                  </div>
                ) : (
                  <div className="data-table">
                    <DataGrid
                      classes={{row: "row"}}
                      rows={sortedRowsNormal}
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      disableSelectionOnClick
                      hideFooter
                    />
                  </div>
                )
              )}
            </main>) : menuItem === "lineup" ? (
              <>
                <h1>Your Lineup</h1>
                <LineupV2 />
              </>
            ) : menuItem === "players" ? (
              <div className='table-wrapper'>
                <h1>Players</h1>
                <Players managerFilter={playerTeamFilter}/>
              </div>
            ) : null
            }
          </div>
          
          <div className="cards">
            <div className="search-bar">
              <FaSearch className='search-icon'/>
              <input type="text" placeholder="Search..." />
            </div>
            <Card title="Card 1" caption="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
            <Card title="Card 2" caption="Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
          </div>
        </>
      )}
    </div>
  );
};  

export default UserHome;