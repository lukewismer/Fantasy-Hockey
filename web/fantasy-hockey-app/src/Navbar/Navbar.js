import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { useUser } from '../UserContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const handleClick = (route) => {
    navigate(route);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          FantasyHockeyRealm
        </div>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Button onClick={() => handleClick('/home')} className="navbar-link" style={{ color: '#fff' }}>Home</Button>
          </li>
          <li className="navbar-item">
            <Button onClick={() => handleClick(`/teams?team_id=${currentUser.uid}`)} className="navbar-link" style={{ color: '#fff' }}>Your Team</Button>
          </li>
          <li className="navbar-item">
            <Button onClick={() => handleClick('/players')} className="navbar-link" style={{ color: '#fff' }}>Players</Button>
          </li>
          <li className="navbar-item">
            <Button onClick={() => handleClick('/lineup')} className="navbar-link" style={{ color: '#fff' }}>Lineup</Button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
