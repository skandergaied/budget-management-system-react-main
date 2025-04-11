import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sign.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faArrowRight, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

function Sign() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });

  const validateForm = () => {
    let formIsValid = true;
    let errors = {};

    // Example validation logic
    if (!email) {
      errors.email = 'Email is required';
      formIsValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      formIsValid = false;
    }
    if (!firstName) {
        errors.firstName = 'Your first name is required';
        console.log('Your first name is required')
        formIsValid = false;
     }

    if (!password) {
      errors.password = 'Password is required';
      formIsValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      formIsValid = false;
    }

    setError(errors);
    return formIsValid;
  }

  const handleSubmit = async (event) => {
  event.preventDefault();
  setLoading(true);

  if (!validateForm()) {
    console.log("Form has errors");
    setLoading(false);
    return;
  }
  try {
    const formData = {
      firstName,
      lastName,
      email,
      password,
    };

    console.log("Form Data:", formData); // Debugging: Log the payload
    const response = await axios.post(
      "http://localhost:8095/api/v1/auth/register", 
      formData, 
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      }
    );
    console.log("Response Status:", response.status);     
        console.log("Response:", response.data);

    setMessage("Registration successful!");
    navigate('/dashboard');
  } catch (error) {
    console.error("Error during registration:", error.response?.data || error.message);
    setMessage("Registration failed: " + (error.response?.data?.message || error.message));
  } finally {
    setLoading(false);
  }
};



  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
<div className="signin">
  <div className="signin-container">
    <div className="text-center">
        <p>Sign up to <span className="bold-text">Bee Finance</span></p>
    </div>
    
    <form onSubmit={handleSubmit}>
    <div className="form-group input-icon-container">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input
              type="text"
              className={`form-control ${error.firstName ? 'is-invalid' : ''}`}
              placeholder="First name"
              aria-label="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            {error.firstName && <div className="invalid-feedback">{error.firstName}</div>}
    </div>
    <div className="form-group input-icon-container">
      <FontAwesomeIcon icon={faUser} className="input-icon" />
      <input
      type="text"
      className={`form-control ${error.lastName ? 'is-invalid' : ''}`}
      placeholder="Last name"
      aria-label="Last name"
      value={lastName}
      onChange={(e) => setLastName(e.target.value)}
      required
      />
      {error.lastName && <div className="invalid-feedback">{error.lastName}</div>}
    </div>
    <div className="form-group input-icon-container">
      <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
      <input
      type="email"
      className={`form-control ${error.email ? 'is-invalid' : ''}`}
      placeholder="Your email"
      aria-label="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
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
      required
      />
      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="toggle-password" onClick={togglePasswordVisibility} />
      {error.password && <div className="invalid-feedback">{error.password}</div>}
    </div>

    <div className="text-center">
          <p>Do you have an account? <Link to="/" className="dark-link">Sign In</Link></p>
          </div>

        <div className="form-group">
          <button type="submit" className="btn-login" disabled={loading}>
          Sign Up<FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
        {loading && <div>Loading...</div>}
      </form>
      <div className="text-center">
      <Link to="/dashboard" className="forgot-password dark-link">Forgot password?</Link>
      
      </div>
    </div>
  </div>

  );
}

export default Sign;
