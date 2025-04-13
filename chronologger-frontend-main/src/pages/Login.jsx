import '../styles/login_signup.css'
import { useState, useEffect } from 'react';
import ClockIcon from '../components/ClockIcon';
import {Link} from 'react-router';
import axios from 'axios';

const Login = () => {

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [passwordVisibility, setPasswordVisibility] = useState('view.png');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ userNotFound: false, incorrectPassword: false })

  useEffect(() => {
    document.title = 'ChronoLogger | Login';

    axios.get('https://chronologger-backend-0d366a44ea30.herokuapp.com/users/auth/status', { withCredentials: true })
    .then(response => {
      if (response.data.authenticated) {
        window.location.href = '/dashboard';
      }
    })
    .catch(error => {
      console.log(error);
    })
  }, [])

  const handleInputChange = e => {
    setFormData({ ...formData,  [e.target.name]: e.target.value});
  }

  const handleShowPassword = () => {
    setShowPassword(prev => !prev);
    setPasswordVisibility(prev => (prev === 'view.png' ? 'hide.png' : 'view.png'));
  }

  const handleSubmitForm = e => {
    const allFieldsFilledOut = Object.values(formData).every(value => value.trim() !== '');

    if (!allFieldsFilledOut) {
      return;
    }

    e.preventDefault();
    setErrorMessage(prev => ({...prev, incorrectPassword: false }));
    setErrorMessage(prev => ({...prev, userNotFound: false }));

    const { username, password } = formData;
    axios.post('https://chronologger-backend-0d366a44ea30.herokuapp.com/users/login', { username, password }, { withCredentials: true })
      .then(response => {
        window.location.href = '/dashboard';
      })
      .catch(error => {
        console.log(error);
        const errorStatus = error.response.status;
        if (errorStatus === 404) {
          setErrorMessage(prev => ({...prev, userNotFound: true }));
        } else { setErrorMessage(prev => ({...prev, incorrectPassword: true }));  };
      })
  }

  return(
    <div className="main-container">
      <div className="title-logo-div">
          <span>ChronoLogger</span>
          <ClockIcon background="#e9ecef"/>
      </div>

        <div className="login-form-container">
          
          <form action="">
            <span className="welcome-back-span">Welcome Back</span>

            <div className="input-block" style={{
                borderBottom: formData.username.trim().length > 0 ? 'solid 1.75px #000000' : 'solid 1.75px #989797'
              }}>
              <img className="input-icon" src="user.png"/>
              <input name="username" value={formData.username} onChange={handleInputChange} type="text" placeholder="Username" required autoComplete="off" spellCheck="false"/>
              <span style={{display: errorMessage.userNotFound ? 'flex' : 'none'}} className="error-span">User not found</span>
            </div>

            <div className="input-block" style={{
                borderBottom: formData.password.trim().length > 0 ? 'solid 1.75px #000000' : 'solid 1.75px #989797'
              }}>
              <img className="input-icon" src="padlock.png"/>
              <span style={{display: errorMessage.incorrectPassword ? 'flex' : 'none'}} className="error-span">Incorrect password</span>
              <input name="password" value={formData.password} onChange={handleInputChange} type={showPassword ? 'text' : 'password'} placeholder="Password" required autoComplete="off" spellCheck="false"/>
              <img onClick={handleShowPassword} className="password-visibility-icon" src={passwordVisibility}/>
            </div>

            <div className="remember-me-container">
              <span>Remember me</span>
              <input type="checkbox"/>
            </div>

            <button onClick={handleSubmitForm} className="login-button">LOGIN</button>

          </form>
        </div>

        <div className="account-span">
          Don't have an account? <Link className='create-account-span' to="/signup">Create one</Link>
        </div>
    </div>
  );
}

export default Login;