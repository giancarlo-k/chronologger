import '../../styles/dashboard.css';
import { useState, useEffect } from 'react';
import axios from "axios";

const LogsContent = ({ handleIsLogFormActive }) => {

  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');

  const handleSearch = e => {
    setSearch(e.target.value);
  }

  const routeToLogInfo = e => {
    const logID = e.currentTarget.id;
    window.location.href = `/log/${logID}`;
  }

  useEffect(() => {
    axios.get('https://chronologger-backend-0d366a44ea30.herokuapp.com/logs', { withCredentials: true })
    .then(response => {
      console.log(response.data.logs);
      setLogs(response.data.logs);
      // const loggedTimes = response.data.log.loggedTimes;
      // setLoggedTimes(loggedTimes);
    })
    .catch(error => {
      console.log(error);
    })
  }, [])

  return(
    <>
      <div className="log-filters-container">
        <div className="searchbar-container">
          <img className="searchbar-icon" src="search.png"/>
          <div className="searchbar">
            <input onChange={handleSearch} type="text" placeholder="Search logs.."/>
          </div>
        </div>
        <button onClick={handleIsLogFormActive} className="add-log-button">
          <img src="add.png" />
          New Log
        </button>
      </div>

      <div className="logs-container">
        <div className="logs-header-wrapper">
          <div className="logs-header">
            <div className="logs-header-info">
              <div className="log-image-box">
                <img src="image.png"/>
              </div>
              <span>Title</span>
              <span>Time Logged</span>
              <span>Goal</span>
              <span>Created</span>
            </div>
          </div>
        </div>
        <div className="logs-list">
          {logs
          .filter((log) => log.title.toLowerCase().trim().includes(search.toLowerCase().trim()))
          .map((log, index) => [
            <div onClick={routeToLogInfo} id={log._id} className="log" key={log._id}>
              <div className="log-info">
                <div className="log-image-box">
                  <img className="log-image" src={log.image}/>
                </div>
                <span>{log.title}</span>
                <span>
                  { Number.isInteger(log.loggedTime / 60) 
                  ? (log.loggedTime / 60)
                  : (log.loggedTime / 60).toFixed(1) } Hours
                </span>
                <span>{`${log.goal} Hours`}</span>
                <span>{log.createdAtFormatted}</span>
              </div>
            </div>
          ])}        
        </div>
      </div>
    </>     
  );
}

export default LogsContent;
