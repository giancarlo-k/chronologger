import '../styles/dashboard.css';
import '../styles/form.css';
import { useState, useEffect } from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';

const AddLogForm = ({ handleIsLogFormActive, mode }) => {
    const [chosenLogImage, setChosenLogImage] = useState('/favicon.png');
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({ title: '', goal: '' });

    const { logID } = useParams();

    useEffect(() => {
      if (mode === 'edit') {
        axios.get(`https://chronologger-backend-0d366a44ea30.herokuapp.com/logs/${logID}`, { withCredentials: true })
        .then(response => {
          // console.log(response.data.log);
          setFormData({ title: response.data.log.title, goal: response.data.log.goal })
        })
        .catch(error => {
          console.log(error);
        })
      }
    }, [])

    const handleChosenLogImage = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setChosenLogImage(reader.result); 
        };
        reader.readAsDataURL(file); 
    }
    }

    const handleNumberInput = (e) => {
      const inputValue = e.target.value;
      if (/^\d*$/.test(inputValue)) {
        setFormData(prev => ({
          ...prev, goal: inputValue === '' ? '' : Number(inputValue)
        }))
      }
    };

    const handleInputChange = e => {
      setFormData({ ...formData,  [e.target.name]: e.target.value});
    }

    const handleFormSubmission = async (e) => {
      e.preventDefault(); 

      const { title, goal } = formData;
      const isValidGoal = goal >= 10 && goal <= 10000;
    
      const date = new Date();

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let shortenedYear = year % 100; 

      let currentDate = (`${month}/${day}/${shortenedYear}`);
    
      if (title.trim() === '' || isNaN(goal) || !isValidGoal) {
        setFormData({ title: '', goal: '' })
        return; 
      }

      const loggedTime = 0;

      const formPayload = new FormData();
      formPayload.append('title', title);
      formPayload.append('goal', goal);
      formPayload.append('createdAtFormatted', currentDate);
      formPayload.append('loggedTime', loggedTime);
      formPayload.append('logID', logID)
    
      if (imageFile) {
        formPayload.append('image', imageFile);
      } else {
        const response = await fetch('/favicon.png'); // adjust path if needed
        const blob = await response.blob();
        const file = new File([blob], 'default-image.png', { type: blob.type });
        formPayload.append('image', file);
      }

      if (mode === 'add') {
        axios.post('https://chronologger-backend-0d366a44ea30.herokuapp.com/logs', formPayload, { withCredentials: true })
        .then(response => {
          console.log(response);
          window.location.href = '/dashboard';
        })
        .catch(error => {
          console.log(error);
        })
      } else {
        axios.put(`https://chronologger-backend-0d366a44ea30.herokuapp.com/logs/${logID}`, formPayload, { withCredentials: true })
        .then(response => {
          window.location.href = `/log/${logID}`;
        })
        .catch(error => {
          console.log(error);
        })
      }
    };

    

    return(
      <div className="log-form-page-overlay">
        <div className="log-form-container">
          <form className="log-form">
            <img id="chosen-log-image" src={chosenLogImage}/>
            <div className="photo-input-box input-box">
              <span className="input-span">Log Image</span>
              <input onChange={handleChosenLogImage} type="file" accept="image/*"/>
            </div>
            <div className="title-input-box input-box">
              <span className="input-span">Title</span>
              <div className="title-input">
                <input onChange={handleInputChange} value={formData.title} name="title" type="text" placeholder="Piano" maxLength={24} required/>
              </div>
            </div>
            <div className="goal-input-box input-box">
              <span className="input-span goal-div">
                Goal 
                <div id="goal-divider"></div>
                <span style={{ color: formData.goal >= 10 && formData.goal <= 10000 || formData.goal === '' ? '' : 'red' }} id="goal-span">Min: 10 Hrs - Max: 10,000 Hrs</span>
              </span>
              <div className="goal-input">
                <input value={formData.goal} name="goal" type="text" placeholder='10000' onChange={handleNumberInput} maxLength={5} required/>
              </div>
              <span className="hours-span">Hours</span>
            </div>
            <div className="buttons-container">
              <button onClick={handleIsLogFormActive}>Cancel</button>
              <button onClick={handleFormSubmission} type="submit">{mode === 'add' ? 'Create Log' : 'Edit Log'}</button>
            </div>
          </form>
        </div>
      </div>
    );
}

export default AddLogForm;
