import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

const SignupPage = () => {
  const { setCurrentUser } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, "users", user.uid), {
        "username": username, 
        "email": email
      })

      setCurrentUser({uid: user.uid, username, email});

      navigate({pathname : "/home"})
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container">
        <div className="signup-page">
            <h1>Fantasy Hockey Signup</h1>
            <form onSubmit={handleSubmit}>
                <div>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                </div>
                <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
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
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit">Sign up</button>
                <p>Or</p>
                <h6><a href="/">Login</a></h6>
            </form>
        </div>
    </div>
    
  );
};

export default SignupPage;
