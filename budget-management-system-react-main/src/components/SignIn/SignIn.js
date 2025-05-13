import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignIn.css'; // Ensure this CSS file exists and has your styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faArrowRight, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import Cookies from 'js-cookie';

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    email: '',
    password: '',
    api: '' // Added for general API/network errors
  });

  const validateForm = () => {
    let formIsValid = true;
    let newFieldErrors = { // Renamed to avoid confusion with 'error' state
        email: '',
        password: ''
    };

    if (!email) {
      newFieldErrors.email = 'Email is required';
      formIsValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newFieldErrors.email = 'Email is invalid';
      formIsValid = false;
    }

    if (!password) {
      newFieldErrors.password = 'Password is required';
      formIsValid = false;
    }
    // You might want to remove the password length check here if the backend handles it
    // and just focus on presence for the frontend validation in sign-in.
    // else if (password.length < 6) {
    //   newFieldErrors.password = 'Password must be at least 6 characters';
    //   formIsValid = false;
    // }

    setError(prevErrors => ({
        ...prevErrors,
        ...newFieldErrors,
        api: '' // Clear previous API error when re-validating fields
    }));
    return formIsValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Clear previous API error
    setError(prev => ({ ...prev, api: '' }));
    
    if (!validateForm()) { // Validate first
      console.log('Form has validation errors');
      setLoading(false); // Ensure loading is set to false if validation fails
      return;
    }

    setLoading(true);

    const formData = {
      email,
      password,
    };
    console.log('Form data being sent to API:', formData);

    try {
      const response = await axios.post(
        "http://localhost:8095/api/v1/auth/authenticate", 
        formData, 
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true
        }
      );

      const token = response.data.access_token;
      if (token) {
        Cookies.set('token', token, { expires: 1 }); // Expires in 1 day
        // Optionally, store user info if your API returns it and you need it
        // For example: if response.data.user { localStorage.setItem('userInfo', JSON.stringify(response.data.user)); }
        navigate('/dashboard');
      } else {
        // This case should ideally not happen if the API design is good (token always present on success)
        console.error("Token not found in response:", response.data);
        setError(prev => ({ ...prev, api: "Login successful, but failed to receive authentication token." }));
      }

    } catch (err) { // Changed variable name from 'error' to 'err'
      console.error("Error during authentication:", err);
      if (err.code === 'ERR_NETWORK' || !err.response) {
        setError(prev => ({ 
            ...prev, 
            api: "Unable to connect to the server. Please check your internet connection or ensure the server is running." 
        }));
      } else if (err.response) {
        // Server responded with an error status (4xx, 5xx)
        let apiErrorMessage = "Login failed. Please check your credentials or try again.";
        if (err.response.status === 401 || err.response.status === 403) {
            apiErrorMessage = "Invalid email or password. Please try again.";
        } else if (err.response.data) {
            if (typeof err.response.data === 'string') {
                apiErrorMessage = err.response.data;
            } else if (err.response.data.message) {
                apiErrorMessage = err.response.data.message;
            } else if (err.response.data.error) { // Common pattern for error messages
                apiErrorMessage = err.response.data.error;
            }
        }
        setError(prev => ({ ...prev, api: apiErrorMessage }));
      } else {
        // Other unexpected JavaScript errors
        setError(prev => ({ ...prev, api: "An unexpected error occurred. Please try again." }));
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signin" style={{ // Added some basic styling for centering
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      // Assuming you have a background image or color in SignIn.css
    }}>
      <div className="signin-container">
        <div className="text-center">
            <p>Log in to <span className="bold-text">Bee Finance</span></p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group input-icon-container">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input
              type="email"
              className={`form-control ${error.email ? 'is-invalid' : ''}`}
              placeholder="Your email"
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            //   required // JS validation is more robust
            />
            {error.email && <div className="invalid-feedback">{error.email}</div>}
          </div>

          <div className="form-group input-icon-container">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              className={`form-control ${error.password ? 'is-invalid' : ''}`}
              placeholder="Your password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            //   required
            />
            <FontAwesomeIcon 
              icon={showPassword ? faEyeSlash : faEye} 
              className="toggle-password" 
              onClick={togglePasswordVisibility} 
              style={{ cursor: 'pointer' }}
            />
            {error.password && <div className="invalid-feedback">{error.password}</div>}
          </div>

          <div className="form-group">
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Logging In...' : 'Log In'}
              {!loading && <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '8px' }} />}
            </button>
          </div>
        </form>

        {/* Display API/Network error message */}
        {error.api && (
          <div className="alert alert-danger mt-3" role="alert">
            {error.api}
          </div>
        )}

        <div className="text-center mt-3"> {/* Added mt-3 for spacing */}
          <Link to="/dashboard" className="forgot-password dark-link">Forgot password?</Link>
          <p className="mt-2">Don’t have an account? <Link to="/signup" className="dark-link">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;