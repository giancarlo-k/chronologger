import { useState, useEffect } from 'react';
import ClockIcon from './ClockIcon.jsx';
import '../styles/dashboard.css';
import '../styles/hamburger.css';

const MobileNavbar = ({ isBurgerActive, handleIsBurgerActive }) => {


  
  return(
  <div className="mobile-navbar">
    <ClockIcon background="#e9ecef"/>

    <div className="hamburger-container">
      <button 
        onClick={handleIsBurgerActive} 
        className={`hamburger hamburger--collapse ${isBurgerActive === true ? 'is-active' : ''}`} 
        type="button"
      >
        <span className="hamburger-box">
          <span className="hamburger-inner"></span>
        </span>
      </button>  
    </div>
  </div>
  );
}

export default MobileNavbar;