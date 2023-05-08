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

  const value = {
    currentUser,
    setCurrentUser,
    leagueSettings,
    setLeagueSettings,
    managers,
    setManagers,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
