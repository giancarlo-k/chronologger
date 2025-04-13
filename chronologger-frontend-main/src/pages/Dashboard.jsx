import { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router';
import Sidebar from '../components/Sidebar.jsx';
import DashboardMainContent from '../components/DashboardMainContent.jsx';
import MobileDirectory from '../components/MobileDirectory.jsx';
import MobileNavbar from '../components/MobileNavbar.jsx';
import AddLogForm from '../components/AddLogForm.jsx';
import '../styles/dashboard.css';

const Dashboard = () => {

  const navigate = useNavigate();

  const [isBurgerActive, setisBurgerActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // check to see if its mobile view
  const [isLogFormActive, setIsLogFormActive] = useState(false);

  const [S3Image, setS3Image] = useState('');


  const handleIsBurgerActive = () => {
    setisBurgerActive(prev => !prev);
  }

  const handleIsLogFormActive = () => {
    setIsLogFormActive(prev => !prev);
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
      ?  (isMobile ? <MobileDirectory /> : <DashboardMainContent handleIsLogFormActive={handleIsLogFormActive} />) 
      : <DashboardMainContent handleIsLogFormActive={handleIsLogFormActive} />
      }

      { isLogFormActive ? <AddLogForm handleIsLogFormActive={handleIsLogFormActive} mode="add" /> : ''}
    </div>
  );
}

export default Dashboard;