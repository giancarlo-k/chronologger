import '../styles/dashboard.css';
import '../styles/form.css';
import { useState, useEffect } from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';

const AddLogForm = ({ handleIsLogTimeFormActive }) => {

  const [formData, setFormData] = useState({ hours: '', minutes: '' });

  const { logID } = useParams();

  const handleNumberInput = (e) => {
    const inputValue = e.target.value;
    const inputName = e.target.name;

    if (/[^0-9]/.test(inputValue)) {
      setFormData({ hours: '', minutes: '' })
    }

    if (/^\d*$/.test(inputValue)) {
      setFormData(prev => ({
        ...prev, [inputName]: inputValue === '' ? '' : inputValue
      }))
    }
  };

  const handleFormSubmission = e => {
    e.preventDefault()

    const { hours, minutes } = formData;

    const isValidHours = Number(hours) <= 5;
    const isValidMinutes = Number(minutes) <= 59;

    if (minutes.length > 2 || hours.length > 1) {
      setFormData({ hours: '', minutes: '' })
      return;
    }

    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let shortenedYear = year % 100; 

    let formattedDate = (`${month}/${day}/${shortenedYear}`);

    if (!isValidHours || !isValidMinutes) {
      if (minutes.length > 2 || hours.length > 1) {
        setFormData({ hours: '', minutes: '' })
      }
      setFormData({ hours: '', minutes: '' })
      return;
    }

    let formattedMinutes = minutes;
    let formattedHours = hours;

    if (minutes.length === 1) {
      formattedMinutes = `0${minutes}`
    }

    if (minutes === '') {
      formattedMinutes = '00'
    }

    if (hours === '') {
      formattedHours = '0'
    }


    const formattedLoggedTime = `${formattedHours}:${formattedMinutes}`;

    if (formattedLoggedTime !== '0:00') {
        const loggedTimeTotal = Number(hours) * 60 + Number(minutes);
        // alert(formattedLoggedTime);
        // alert(loggedTimeTotal);
        
      axios.post(`https://chronologger-backend-0d366a44ea30.herokuapp.com/logs/${logID}/times`, {  formattedLoggedTime, formattedDate, loggedTimeTotal, logID  }, { withCredentials: true })
        .then(response => {
          // console.log(response);
          window.location.href = `/log/${logID}`;
        })
        .catch(error => {
          console.log(error);
        })
    } else {
      setFormData({ hours: '', minutes: '' })
      return;
    }
  }

    return(
      <div className="log-form-page-overlay">
        <div className="logtime-form-container">
          <form className="logtime-form">
            <div className="time-input-container">
              <div id="hours" className="time-input-section">
                <span className="time-input-section-text">Hours</span>
                <input onChange={handleNumberInput} value={formData.hours} name="hours" type="text" max="5"/>
                <div className="hours-message">5 or less</div>
              </div>

              <div className="time-input-divider">:</div>

              <div id="minutes" className="time-input-section">
                <span className="time-input-section-text">Minutes</span>
                <input onChange={handleNumberInput} value={formData.minutes} name="minutes" type="text"/>
              </div>
            </div>

            <div className="buttons-container logtime-buttons-container">
              <button onClick={handleIsLogTimeFormActive}>Cancel</button>
              <button onClick={handleFormSubmission} type="submit">Log Time</button>
            </div>
          </form>
        </div>
      </div>
    );
}

export default AddLogForm;
