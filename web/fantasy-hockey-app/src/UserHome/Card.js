import React from 'react';
import './Card.css'

const Card = ({ title, caption }) => {
  return (
    <div className="stats-card">
      <h3>{title}</h3>
      <p>{caption}</p>
    </div>
  );
};

export default Card;
