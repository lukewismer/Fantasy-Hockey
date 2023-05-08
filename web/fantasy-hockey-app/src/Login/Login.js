import React, { useState, useRef } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { getDocs, query, where, collection } from 'firebase/firestore';
import './Login.css';

const LoginPage = () => {
  const { setCurrentUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const emailref = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userQuery = query(
        collection(db, 'users'),
        where('email', '==', user.email)
      );
      const querySnapshot = await getDocs(userQuery);

      querySnapshot.forEach((doc) => {
        const userData = { uid: user.uid, ...doc.data() };
        setCurrentUser(userData);
        navigate({ pathname: '/home', state: { userData } });
      });

    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container">
      <div className="login-page">
        <h1>Fantasy Hockey Login</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              ref={emailref}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              ref={passwordRef}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit">Login</button>
          <p>Or</p>
          <h6>
            <a href="/signup">Sign Up</a>
          </h6>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
