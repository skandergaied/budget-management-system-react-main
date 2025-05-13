import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sign.css'; // Make sure this CSS file exists and is styled
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faArrowRight, faEye, faEyeSlash, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import Cookies from 'js-cookie';

function Sign() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    general: '',
  });
  // New state to control the "already have an account" prompt
  const [showLoginSuggestion, setShowLoginSuggestion] = useState(false);

  const validateForm = () => {
    let formIsValid = true;
    let currentErrors = {};

    if (!email) {
      currentErrors.email = 'Email is required';
      formIsValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      currentErrors.email = 'Email is invalid';
      formIsValid = false;
    }
    if (!firstName) {
      currentErrors.firstName = 'Your first name is required';
      formIsValid = false;
    }
    if (!lastName) {
      currentErrors.lastName = 'Your last name is required';
      formIsValid = false;
    }
    if (!password) {
      currentErrors.password = 'Password is required';
      formIsValid = false;
    } else if (password.length < 6) {
      currentErrors.password = 'Password must be at least 6 characters';
      formIsValid = false;
    }

    setErrors(currentErrors);
    return formIsValid;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({ email: '', firstName: '', lastName: '', password: '', general: '' }); // Clear previous errors
    setShowLoginSuggestion(false); // Reset login suggestion

    if (!validateForm()) {
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
      
      // Storing username in localStorage before successful registration might not be ideal.
      // If it's for pre-filling login or some other non-critical UI, it might be okay.
      localStorage.setItem('username', JSON.stringify({ firstName, lastName }));

      const response = await axios.post(
        "http://localhost:8095/api/v1/auth/register",
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );

      const token = response.data.access_token;
      if (token) {
        Cookies.set('token', token, { expires: 1 });
        // Optionally save user info from response.data.user if available
        // localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      } else {
        setErrors(prev => ({ ...prev, general: "Registration completed but failed to retrieve session token. Please try logging in." }));
      }

    } catch (error) {
      console.error("Error during registration:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      let isExistingUserError = false;

      if (error.response) {
        const serverMessage = error.response.data?.message || error.response.data?.error || (typeof error.response.data === 'string' ? error.response.data : null);

        if (error.response.status === 403) {
          // YOU NEED TO CONFIRM THE EXACT MESSAGE FROM YOUR BACKEND FOR "EMAIL EXISTS"
          // For example, if backend sends: { "message": "Email already exists" }
          if (serverMessage && (serverMessage.toLowerCase().includes("email already exist") || serverMessage.toLowerCase().includes("user already exist") || serverMessage.toLowerCase().includes("email is already taken"))) {
            errorMessage = "This email is already registered. Please log in.";
            setErrors(prev => ({ ...prev, email: errorMessage })); // Show error on email field
            setShowLoginSuggestion(true); // Trigger the login suggestion display
            isExistingUserError = true;
          } else {
            errorMessage = serverMessage || "Registration forbidden. Please check your details.";
            setErrors(prev => ({ ...prev, general: errorMessage }));
          }
        } else if (error.response.status === 400) {
           // Handle other validation errors from backend
           if (error.response.data && typeof error.response.data.errors === 'object') {
            const backendErrors = error.response.data.errors;
            let newErrorsState = { ...errors, general: '' }; // Retain existing client errors, clear general
            for (const key in backendErrors) {
                if (newErrorsState.hasOwnProperty(key)) { // Check if key exists in our error state
                    newErrorsState[key] = backendErrors[key].join ? backendErrors[key].join(', ') : backendErrors[key];
                } else {
                    newErrorsState.general = (newErrorsState.general ? newErrorsState.general + '; ' : '') + (backendErrors[key].join ? backendErrors[key].join(', ') : backendErrors[key]);
                }
            }
            setErrors(newErrorsState);
          } else {
            errorMessage = serverMessage || "Invalid data submitted. Please check your input.";
            setErrors(prev => ({ ...prev, general: errorMessage }));
          }
        } else {
          errorMessage = serverMessage || `Registration failed with status: ${error.response.status}`;
          setErrors(prev => ({ ...prev, general: errorMessage }));
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check your network connection.";
        setErrors(prev => ({ ...prev, general: errorMessage }));
      } else {
        errorMessage = "Error setting up registration request. Please try again.";
        setErrors(prev => ({ ...prev, general: errorMessage }));
      }

      // If it's not an existing user error, ensure the specific error is displayed
      if (!isExistingUserError && !errors.general && !errors.email && !errors.firstName && !errors.lastName && !errors.password) {
          setErrors(prev => ({ ...prev, general: errorMessage }));
      }

    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    // Assuming your login route is '/' or '/login'
    // If your Sign component is at '/', and login is also there,
    // you might need a separate login component/route like '/login'
    navigate('/'); // Or '/login' if that's your login page route
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="signin"
      style={{
        backgroundImage: "url('https://media.istockphoto.com/id/473279561/video/charts-and-numbers.jpg?s=640x640&k=20&c=ZTLU6eBGDnjj2hQRO2wbIzXvGjMMSTDeME3CgJeXKQ0=')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        padding: "20px",
      }}
    >
      <div className="signin-container">
        <div className="text-center">
          <p>Sign up to <span className="bold-text">Bee Finance</span></p>
        </div>

        {/* General error display */}
        {errors.general && !showLoginSuggestion && (
          <div className="alert alert-danger mb-3" role="alert">
            {errors.general}
          </div>
        )}

        {/* "Already have an account" prompt */}
        {showLoginSuggestion && (
          <div className="alert alert-info mb-3 text-center" role="alert">
            <p className="mb-2">{errors.email || "You already have an account with this email."}</p>
            <button onClick={handleGoToLogin} className="btn btn-primary btn-sm">
              Go to Login
            </button>
          </div>
        )}

        {/* Hide form if login suggestion is shown, or just disable submit */}
        {/* For now, let's keep the form visible but the specific error will guide them */}
        <form onSubmit={handleSubmit}>
          <div className="form-group input-icon-container">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input
              type="text"
              className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
          </div>
          <div className="form-group input-icon-container">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input
              type="text"
              className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
          </div>
          <div className="form-group input-icon-container">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && !showLoginSuggestion && <div className="invalid-feedback d-block">{errors.email}</div>}
          </div>
          <div className="form-group input-icon-container">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="toggle-password" onClick={togglePasswordVisibility} />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          {!showLoginSuggestion && ( // Only show "Do you have an account?" if not showing login suggestion
             <div className="text-center">
                <p>Do you have an account? <Link to="/signin" className="dark-link">Sign In</Link></p>
             </div>
          )}


          <div className="form-group">
            <button type="submit" className="btn-login" disabled={loading || showLoginSuggestion}>
              {loading ? 'Signing Up...' : <>Sign Up <FontAwesomeIcon icon={faArrowRight} /></>}
            </button>
          </div>
        </form>
        <div className="text-center mt-2">
          <Link to="/forgot-password" className="forgot-password dark-link">Forgot password?</Link>
          {/* Changed dashboard link to forgot-password for context */}
        </div>
      </div>
    </div>
  );
}

export default Sign;