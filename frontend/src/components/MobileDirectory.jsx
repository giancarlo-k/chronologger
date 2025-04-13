import '../styles/dashboard.css';
import '../styles/hamburger.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import axios from "axios";

const MobileDirectory = () => {

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

  return(
    <div className="mobile-directory-container">
      <div className="mobile-links-container">
        <ul>
          <li>
            <a className="mobile-links" href="">Dashboard</a>
          </li>

          <li>
            <a className="mobile-links" href="https://github.com" target="_blank">Repository</a>
          </li>

          <li onClick={handleLogout}>
            <div className="mobile-links" href="">Logout</div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MobileDirectory;

// mobile-activated-colormode