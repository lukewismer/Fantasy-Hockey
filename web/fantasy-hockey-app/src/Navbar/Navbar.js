import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

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
            <Button onClick={() => handleClick('/home')} className="navbar-link">Home</Button>
          </li>
          <li className="navbar-item">
            <Button onClick={() => handleClick('/user-team')} className="navbar-link">Your Team</Button>
          </li>
          <li className="navbar-item">
            <Button onClick={() => handleClick('/players')} className="navbar-link">Players</Button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
