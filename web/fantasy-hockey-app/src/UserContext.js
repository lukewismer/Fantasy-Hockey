import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [leagueSettings, setLeagueSettings] = useState(() => {
    const storedSettings = localStorage.getItem('leagueSettings');
    return storedSettings ? JSON.parse(storedSettings) : null;
  });

  const [managers, setManagers] = useState(() => {
    const storedManagers = localStorage.getItem('managers');
    return storedManagers ? JSON.parse(storedManagers) : [];
  });

  const [teams, setTeams] = useState(() => {
    const storedTeams = localStorage.getItem('teams');
    if (storedTeams === null) {
      return null;
    }
    try {
      return JSON.parse(storedTeams);
    } catch (e) {
      console.error('Error parsing teams from localStorage', e);
      return null;
    }
  });
  

  const [players, setPlayers] = useState(() => {
    const storedPlayers = localStorage.getItem('players');
    if (storedPlayers === null) {
      return null;
    }
    try {
      return JSON.parse(storedPlayers);
    } catch (e) {
      console.error('Error parsing players from localStorage', e);
      return null;
    }
  });


  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    if (leagueSettings) {
      localStorage.setItem('leagueSettings', JSON.stringify(leagueSettings));
    } else {
      localStorage.removeItem('leagueSettings');
    }
  }, [leagueSettings]);

  useEffect(() => {
    localStorage.setItem('managers', JSON.stringify(managers));
  }, [managers]);

  useEffect(() => {
    if (teams) {
      localStorage.setItem('teams', JSON.stringify(teams))
    } else {
      localStorage.removeItem('teams')
    }
    
  }, [teams])

  useEffect(() => {
    if (players) {
      localStorage.setItem('players', JSON.stringify(players))
    } else {
      localStorage.removeItem('players')
    }
    
  }, [players])

  const value = {
    currentUser,
    setCurrentUser,
    leagueSettings,
    setLeagueSettings,
    managers,
    setManagers,
    teams, 
    setTeams,
    players,
    setPlayers
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
