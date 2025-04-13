import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import Sidebar from '../components/Sidebar.jsx';
import MobileDirectory from '../components/MobileDirectory.jsx';
import MobileNavbar from '../components/MobileNavbar.jsx';
import LogInfo from '../components/LogInfo.jsx';
import AddLogForm from '../components/AddLogForm.jsx';
import LogTimeForm from '../components/LogTimeForm.jsx';
import '../styles/dashboard.css';
import '../styles/loginfo.css';

const LogInfoSkeleton = () => {

  const [isBurgerActive, setisBurgerActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLogFormActive, setIsLogFormActive] = useState(false);
  const [isLogTimeFormActive, setIsLogTimeFormActive] = useState(false);

  const handleIsLogFormActive = () => {
    setIsLogFormActive(prev => !prev);
  }

  const handleIsLogTimeFormActive = () => {
    setIsLogTimeFormActive(prev => !prev);
  }

  const handleIsBurgerActive = () => {
    setisBurgerActive(prev => !prev);
  }

  useEffect(() => {
    document.title = `ChronoLogger | Dashboard`;

    const checkMobileView = () => {
      setIsMobile(window.innerWidth <= 700);
    }

    checkMobileView()

    window.addEventListener('resize', checkMobileView)

    axios.get('https://chronologger-backend-0d366a44ea30.herokuapp.com/users/auth/status', { withCredentials: true })
      .then(response => {
        if (!response.data.authenticated) {
          window.location.href = '/';
        }
      })
      .catch(error => {
        console.log(error);
      })
  }, [])

  return(
    <div className="container">     
      <Sidebar />
      <MobileNavbar isBurgerActive={isBurgerActive} handleIsBurgerActive={handleIsBurgerActive} />
      { isBurgerActive 
        ?  (isMobile ? <MobileDirectory /> : <LogInfo  handleIsLogTimeFormActive={handleIsLogTimeFormActive}  handleIsLogFormActive={handleIsLogFormActive} />) 
        : <LogInfo  handleIsLogTimeFormActive={handleIsLogTimeFormActive}  handleIsLogFormActive={handleIsLogFormActive} /> 
      }

      { isLogFormActive ? <AddLogForm handleIsLogFormActive={handleIsLogFormActive} mode="edit"/> : ''}
      { isLogTimeFormActive ? <LogTimeForm handleIsLogTimeFormActive={handleIsLogTimeFormActive}/> : ''}
    </div>
  );
}

export default LogInfoSkeleton;