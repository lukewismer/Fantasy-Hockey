import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { setItem, getItem, getAllItems, setItems, deleteAllItems } from './indexedDB';
import { getDocs, getDoc, doc, query, where, collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

const UserContext = createContext();
const teamStoreName = 'teams';
const playerStoreName = 'players';


export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [leagueSettings, setLeagueSettings] = useState(null);
  const [managers, setManagers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchSettingsAndManagers = async () => {
      const storedSettings = localStorage.getItem('leagueSettings');
      if (storedSettings) {
        setLeagueSettings(JSON.parse(storedSettings));
      }

      const storedManagers = localStorage.getItem('managers');
      if (storedManagers) {
        setManagers(JSON.parse(storedManagers));
      }

      const storedTeams = await getAllItems(teamStoreName);
      if (storedTeams !== null) {
        setTeams(storedTeams);
      }

      const storedPlayers = await getAllItems(playerStoreName);
      if (storedPlayers !== null) {
        setPlayers(storedPlayers);
      }
    }

    fetchSettingsAndManagers();
  }, []);

  useEffect(() => {
    if (leagueSettings) {
      localStorage.setItem('leagueSettings', JSON.stringify(leagueSettings));
    } else {
      localStorage.removeItem('leagueSettings');
    }
  }, [leagueSettings]);

  const fetchTeamDataOnRefresh = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchTeamDataOnRefresh();
  }, [fetchTeamDataOnRefresh]);
  
  const fetchPlayerDataOnRefresh = useCallback(async () => {
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
  }, []);

  const updateManagers = async (newManagers) => {
    setManagers(newManagers);
    localStorage.setItem('managers', JSON.stringify(newManagers));
  };

  useEffect(() => {
    
    fetchPlayerDataOnRefresh();
  }, [fetchPlayerDataOnRefresh]);

  useEffect(() => {
    if (leagueSettings) {
      localStorage.setItem('managers', JSON.stringify(managers));
    } else {
      localStorage.removeItem('managers');
    }
  }, [managers]);

  const value = {
    currentUser,
    setCurrentUser,
    leagueSettings,
    setLeagueSettings,
    managers,
    setManagers: updateManagers,
    teams, 
    setTeams,
    players,
    setPlayers
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
