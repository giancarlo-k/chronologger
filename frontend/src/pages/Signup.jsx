import '../styles/login_signup.css'
import { useState, useEffect } from 'react';
import ClockIcon from '../components/ClockIcon';
import { Link } from 'react-router';
import axios from "axios";

const Signup = () => {

  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false });
  const [passwordVisibility, setPasswordVisibility] = useState({ password: 'view.png', confirmPassword: 'view.png' });
  const [errorMessage, setErrorMessage] = useState({ usernameTaken: false, passwordsMatch: true });

  useEffect(() => {
    document.title = 'ChronoLogger | Create Account';

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

  const handleShowPassword = field => {
    setShowPassword(prev => ({...prev, [field]: !prev[field]}));
    setPasswordVisibility(prev => ({...prev, [field]: prev[field] === 'view.png' ? 'hide.png' : 'view.png' }));
  }

  const handleSubmitForm = e => {

    const allFieldsFilledOut = Object.values(formData).every(value => value.trim() !== '');

    if (!allFieldsFilledOut) {   
      return;
    }

    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage(prev => ({...prev, passwordsMatch: false }));
    } else { 
      setErrorMessage(prev => ({...prev, passwordsMatch: true }));
      setErrorMessage(prev => ({...prev, usernameTaken: false }));
      const { username, password } = formData
      axios.post('https://chronologger-backend-0d366a44ea30.herokuapp.com/users/add', { username, password }, { withCredentials: true })
        .then(response => {
          window.location.href = '/dashboard';
        })
        .catch (error => {
          console.log(error);
          setErrorMessage(prev => ({...prev, usernameTaken: true }));
        })
     }
  }

  return(
    <div className="main-container">

      <div className="title-logo-div">
        <span>ChronoLogger</span>
        <ClockIcon background="#e9ecef"/>
      </div>

      <div className="login-form-container">
        
        <form className="signup-form" action="" autoComplete="off">
          <span className="welcome-back-span">Create Account</span>

          <div className="input-block" style={{
                borderBottom: formData.username.trim().length > 0 ? 'solid 1.75px #000000' : 'solid 1.75px #989797'
              }}>
            <img className="input-icon" src="user.png"/>
            <input onChange={handleInputChange} value={formData.username} required name="username" type="text" placeholder="Username"  autoComplete="off" spellCheck="false"/>
            <span style={{display: errorMessage.usernameTaken ? 'flex' : 'none'}} className="error-span">Username taken</span>
          </div>

          <div className="input-block" style={{
                borderBottom: formData.password.trim().length > 0 ? 'solid 1.75px #000000' : 'solid 1.75px #989797'
              }}>
            <img className="input-icon" src="padlock.png"/>
            <input onChange={handleInputChange} required value={formData.password} name="password"  type={showPassword.password ? 'text' : 'password'} placeholder="Password"  autoComplete="off" spellCheck="false"/>
            <img onClick={() => handleShowPassword('password')} className="password-visibility-icon" src={passwordVisibility.password}/>
          </div>

          <div className="input-block" style={{
                borderBottom: formData.confirmPassword.trim().length > 0 ? 'solid 1.75px #000000' : 'solid 1.75px #989797'
              }}>
            <img className="input-icon confirm-icon" src="check-mark.png"/>
            <span style={{display: errorMessage.passwordsMatch ? 'none' : 'flex'}} className="error-span">Make sure your passwords match!</span>
            <input  onChange={handleInputChange} required value={formData.confirmPassword} name="confirmPassword"  type={showPassword.confirmPassword ? 'text' : 'password'} placeholder="Confirm password"  autoComplete="off" spellCheck="false"/>
            <img onClick={() => handleShowPassword('confirmPassword')} className="password-visibility-icon" src={passwordVisibility.confirmPassword}/>
          </div>

          <button onClick={handleSubmitForm} className="login-button">CREATE</button>

        </form>
      </div>

      <div className="account-span">
        Already have an account? <Link className='create-account-span' to="/">Login</Link>
      </div>
    </div>
  );
}

export default Signup;
