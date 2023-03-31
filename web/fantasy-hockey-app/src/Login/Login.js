import React, { useState, useRef } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import './Login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const emailref = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        await signInWithEmailAndPassword(auth, email, password);
        // Redirect or update the app state on successful login
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
                <h6><a href="/signup">Sign Up</a></h6>
            </form>
        </div>
    </div>
    
  );
};

export default LoginPage;
