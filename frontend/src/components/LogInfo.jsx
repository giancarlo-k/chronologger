import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import '../styles/dashboard.css';
import '../styles/loginfo.css';
import Chart from './Chart.jsx';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const LogInfo = ({ handleIsLogFormActive, handleIsLogTimeFormActive }) => {
  function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  const { logID } = useParams();
  const [logInfo, setLogInfo] = useState([]);
  const [loggedTimes, setLoggedTimes] = useState([]);
  const [totalTimeLogged, setTotalTimeLogged] = useState('00:00');
  const [percentCompleted, setPercentCompleted] = useState('95');
  const [progressBarRadiuses, setProgressBarRadiuses] = useState('0');

  useEffect(() => {
    axios.get(`https://chronologger-backend-0d366a44ea30.herokuapp.com/logs/${logID}`, { withCredentials: true })
    .then(response => {
      setLogInfo(response.data.log);
      const loggedTimes = response.data.log.loggedTimes;
      setLoggedTimes(loggedTimes)
    })
    .catch(error => {
      console.log(error);
    })
  }, [])

  useEffect(() => {
    calculateTimeLogged();

    if (logInfo.title) {
      document.title = `ChronoLogger | ${capitalizeFirstLetter(logInfo.title)} Log`;
    }
  }, [logInfo.title]);

  const calculateTimeLogged = async () => {
    let totalMinutes = 0;

    loggedTimes.forEach(entry => {
      totalMinutes += entry.loggedTimeTotal;
    })

    const goal = await logInfo.goal;
    const goalMinutes = goal * 60;
    let percentage = 100 * (totalMinutes / goalMinutes);
    percentage = percentage.toFixed(2);

    if (percentage > 100) {
      percentage = 100;
    }

    setPercentCompleted(percentage);

    if (percentage > 94) {
      setProgressBarRadiuses('10');
    }

    let totalHours = Math.floor(totalMinutes / 60);
    let remainingMinutes = totalMinutes % 60;
    
    if (totalHours === 0) {
      totalHours = '00'
    }

    if (remainingMinutes === 0) {
      remainingMinutes = '00'
    }

    if (remainingMinutes < 10 && remainingMinutes > 0 ) {
      remainingMinutes = `0${remainingMinutes}`; // im too lazy to use .pad
    }

    const formattedTotalTimeLogged = `${totalHours}:${remainingMinutes}`;
    setTotalTimeLogged(formattedTotalTimeLogged);
  }

  const handleDeleteLog = () => {
    withReactContent(Swal).fire({
      title: "Are you sure?",
      text: "The log will be permanently deleted",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#40C057",
      cancelButtonColor: "#808080",
      confirmButtonText: "Yes, delete it!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`https://chronologger-backend-0d366a44ea30.herokuapp.com/logs/${logID}`, { withCredentials: true })
        .then(response => {
          window.location.href = '/dashboard'
        })
        .catch(error => {
          console.log(error);
        })
      }
    });
  }


  return(
    <div className="loginfo-container">     
      <div className="loginfo-top-section">
        <div className="image-and-title-box">
          <div className="log-image-box">
            <img className="log-info-image" src={logInfo.image}/>
          </div>
          <div className="log-info-title">{capitalizeFirstLetter(logInfo.title)}</div>
        </div>
      </div>

      <div className="loginfo-middle-section">

        <div className="completed-percent-box">
            {`${percentCompleted}%`}
            <div className="outer-progress-bar">
              <div className="total-completed-without-percent">
                {`${totalTimeLogged} / ${Number(logInfo?.goal || 0).toLocaleString()} Hours`}
              </div>
              <div className="inner-progress-bar" style={{ 
              width: `${percentCompleted}%`, 
              borderTopRightRadius: `${progressBarRadiuses}px`,
              borderBottomRightRadius: `${progressBarRadiuses}px` }}></div>
            </div>
        </div>

        <div className="loginfo-buttons-box">
          <button onClick={handleIsLogTimeFormActive} className="add-log-button">
            <img src="/add.png" />
            Log Time
          </button>

          <button onClick={handleIsLogFormActive} className="add-log-button">
            <img src="/pencil.png" />
            Edit Log
          </button>

          <button onClick={handleDeleteLog} className="add-log-button">
            <img src="/delete.png" />
            Delete Log
          </button>
        </div>


      </div>

      <div className="loginfo-bottom-section">
        <Chart />
        <div className="recent-logs-container">
          <span>Recent Logs</span>
          <div className="recent-logs-divider"></div>
          <div className="recent-logs-list">
            {loggedTimes.slice().reverse().slice(0, 7).map((log, index) => (
              <div key={index} className="recent-log-line">
               {log.formattedDate} - {log.formattedLoggedTime} 
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
}

// for recent logs, just take the most recent 7

export default LogInfo;
