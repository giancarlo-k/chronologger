import '../styles/dashboard.css';
import '../styles/hamburger.css';
import { useState, useEffect } from 'react';
import LogsContent from './dashboardContent/LogsContent.jsx';

const DashboardMainContent = ({  handleIsLogFormActive }) => {

  const [dashboardRender, setDashboardRender] = useState('logs');

  return(
    <div className="dashboard-container">
      <div className="rendered-content-container">
        { dashboardRender === 'logs' ? <LogsContent handleIsLogFormActive={handleIsLogFormActive} /> : <StatsContent /> }
      </div>
    </div>
  );
}

export default DashboardMainContent;