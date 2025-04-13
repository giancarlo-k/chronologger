import '../styles/dashboard.css';
import '../styles/hamburger.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import axios from "axios";
import ClockIcon from './ClockIcon.jsx';

const Sidebar = () => {

  const handleLogout = async () => {
    await axios.get('https://chronologger-backend-0d366a44ea30.herokuapp.com/users/logout', { withCredentials: true }) 
      .then(response => {
        if (response.status === 200) {
          window.location.href = '/';
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  const handleRouteToDashboard = () => {
    window.location.href='/dashboard'
  }

  return(
    <div className="sidebar">
      <div className="branding-container">
        <ClockIcon background="#e3e3e3"/>
      </div>
      <div className="links-container">
        <ul>
          <li onClick={handleRouteToDashboard} className="link-box active-link">
            <img id="dashboard-icon" src="/dashboards.png"/>
            Dashboard
          </li>

          <li>
            <a className="react-link link-box" href="https://github.com" target="_blank">
              <img id="github-icon" src="/github.png"/>
              Repository
            </a>
          </li>

          <li onClick={handleLogout} className="link-box">
            <img id="logout-icon" src="/logout.png"/>
            Logout
          </li>
        </ul>
      </div>

      
    </div>
  );
}

export default Sidebar;