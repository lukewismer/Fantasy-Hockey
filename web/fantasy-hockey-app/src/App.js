import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import LoginPage from './Login/Login';
import SignupPage from './SignUp/SignUp';
import UserHome from './UserHome/UserHome';
import { UserProvider } from './UserContext';
import Teams from './Team/Team';
import Lineup from './Lineup/Lineup';
import Players from './Players/Players';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Cleanup the listener on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="home" element={<UserHome />} />
            <Route path="teams" element={<Teams />} />
            <Route path="lineup" element={<Lineup />} />
            <Route path="players" element={<Players />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;