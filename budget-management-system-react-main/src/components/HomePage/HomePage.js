// HomePage.js
import React, { useMemo, useState, useEffect, useRef } from 'react'; // Added useRef
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { motion, animate } from 'framer-motion'; // Added animate import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus, faChartPie, faLock } from '@fortawesome/free-solid-svg-icons';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// No import for AnimatedNumber needed anymore

import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css'; // Import the CSS

// --- Inline Animated Number Component ---
function InlineAnimatedNumber({ targetValue, duration = 1.5 }) {
  const nodeRef = useRef();

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return; // Guard clause if node isn't ready

    const controls = animate(0, targetValue, {
      duration: duration,
      ease: "easeOut",
      onUpdate(value) {
        // Update the text content directly
        node.textContent = Math.round(value).toLocaleString();
      }
    });

    // Cleanup animation on unmount
    return () => controls.stop();

  }, [targetValue, duration]); // Dependencies

  // Render the initial value '0'; animation updates it
  return <span ref={nodeRef}>0</span>;
}
// --- End Inline Component ---


function HomePage() {
  // State
  const [isLoaded, setIsLoaded] = useState(false);
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(true); // Start true to wait for load

  // Typewriter Config
  const baseTitle = "Smart Finances, ";
  const highlightedPart = "Brighter Future.";
  const fullTitle = useMemo(() => baseTitle + highlightedPart, []);
  const typingSpeed = 75; // ms per letter
  const pauseDuration = 2000; // ms pause after typing

  // Initial Load Effect
  useEffect(() => {
    const loadTimer = setTimeout(() => {
        setIsLoaded(true);
        setIsTypingComplete(false); // Trigger first typing round
    } , 300); // Short delay to simulate loading
    return () => clearTimeout(loadTimer);
  }, []); // Run only once on mount

  // Typewriter Loop Effect
  useEffect(() => {
    if (isLoaded && !isTypingComplete) {
      let index = 0;
      setDisplayedTitle('');

      const typingIntervalId = setInterval(() => {
        if (index < fullTitle.length) {
          setDisplayedTitle(fullTitle.substring(0, index + 1));
          index++;
        } else {
          clearInterval(typingIntervalId);
          setIsTypingComplete(true); // Mark round complete

          // Schedule restart
          const resetTimeoutId = setTimeout(() => {
            setIsTypingComplete(false); // Trigger next round
          }, pauseDuration);

          // Cleanup specific to this timeout
          return () => clearTimeout(resetTimeoutId);
        }
      }, typingSpeed);

      // Cleanup for interval
      return () => {
          clearInterval(typingIntervalId);
      };
    }
  }, [isLoaded, isTypingComplete, fullTitle, pauseDuration, typingSpeed]);

  // Animation Variants
  const pageVariants = useMemo(() => ({
    initial: { opacity: 0 },
    in: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
    out: { opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
  }), []);

  const contentVariants = useMemo(() => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } },
  }), []);

  const imageVariants = useMemo(() => ({
    initial: { opacity: 0, scale: 0.92, x: 40 },
    animate: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.7, delay: 0.3 } },
  }), []);

  // Data
  const benefits = useMemo(() => [
    { icon: faChartPie, text: "Visualize your financial growth" },
    { icon: faLock, text: "Bank-level security for your data" }
  ], []);

  const stats = useMemo(() => [
    { target: 50, suffix: "K+", label: "Users" },
    { target: 99, suffix: "%", label: "Satisfaction" },
    { value: "24/7", label: "Support" } // Non-numeric
  ], []);

  return (
    <motion.div
      className="homepage-wrapper-pro"
      initial="initial"
      animate={isLoaded ? "in" : "initial"}
      exit="out"
      variants={pageVariants}
    >
      <Container className="homepage-container-pro">
        <Row className="align-items-center min-vh-100 gx-xl-5">
          {/* Text Column */}
          <Col md={6} className="text-content-col-pro">
            <motion.div
              className="content-box-pro text-center text-md-start"
              variants={contentVariants}
              initial="initial"
              animate={isLoaded ? "animate" : "initial"} // Animate content box based on load
            >
              {/* Brand Icon */}
              <div className="brand-container-pro mb-4">
                <FontAwesomeIcon icon={faChartPie} size="3x" className="brand-icon-pro" />
              </div>

              {/* Headline with Typewriter Effect */}
              <h1 className="hero-title-pro mb-3">
                {displayedTitle.substring(0, baseTitle.length)}
                {displayedTitle.length > baseTitle.length && (
                  <span className="highlight-text-pro">
                    {displayedTitle.substring(baseTitle.length)}
                  </span>
                )}
                {!isTypingComplete && <span className="typing-cursor">|</span>}
              </h1>

               {/* Lead Paragraph */}
              <motion.p
                className="hero-lead-pro mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Take control of your financial journey with intuitive tracking, powerful insights, and intelligent forecasting.
              </motion.p>

              {/* Benefits */}
               <motion.div
                  className="benefits-container-pro mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isLoaded ? 1 : 0 }}
                  transition={{ delay: 0.5 }}
              >
                 {benefits.map((b, i) => (
                   <div key={i} className="d-flex align-items-center mb-3 benefit-item-pro">
                     <FontAwesomeIcon icon={b.icon} className="me-2 benefit-icon-pro" />
                     <span className="benefit-text-pro">{b.text}</span>
                   </div>
                 ))}
               </motion.div>

              {/* Buttons */}
              <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: isLoaded ? 1 : 0 }}
                 transition={{ delay: 0.6 }}
              >
                 <Row className="cta-buttons-row-pro mb-4">
                   <Col xs={12} sm={6} className="mb-3 mb-sm-0">
                    <Link to="/signin" className="w-100" aria-label="Sign in">
                      <Button size="lg" className="w-100 btn-primary-pro">
                          <FontAwesomeIcon icon={faSignInAlt} className="me-2" /> Sign In
                      </Button>
                    </Link>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Link to="/signup" className="w-100" aria-label="Sign up">
                      <Button size="lg" className="w-100 btn-secondary-pro">
                          <FontAwesomeIcon icon={faUserPlus} className="me-2" /> Get Started
                      </Button>
                    </Link>
                  </Col>
                 </Row>
               </motion.div>

              {/* Stats Counter Section with Animated Numbers */}
              <motion.div
                 className="stats-counter-pro mt-4 pt-2"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: isLoaded ? 1 : 0 }}
                 transition={{ delay: 0.7 }}
               >
                 <Row className="text-center text-md-start">
                   {stats.map((stat, index) => (
                     <Col xs={4} key={index}>
                       <div className="stat-number-pro">
                         {/* Conditional Rendering for Animation */}
                         {isLoaded && stat.target !== undefined ? (
                           <>
                             {/* Use the inline component here */}
                             <InlineAnimatedNumber targetValue={stat.target} duration={1.5} />
                             {stat.suffix}
                           </>
                         ) : stat.value ? (
                           stat.value // Display non-numeric directly
                         ) : (
                           '0' // Initial placeholder before load/animation
                         )}
                       </div>
                       <div className="stat-label-pro">{stat.label}</div>
                     </Col>
                   ))}
                 </Row>
               </motion.div>

              {/* Tagline */}
              <motion.p
                 className="mt-4 tagline-muted-pro"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: isLoaded ? 1 : 0 }}
                 transition={{ delay: 0.8 }}
               >
                 Secure. Insightful. Empowering.
               </motion.p>

            </motion.div>
          </Col>

          {/* Animation Column */}
          <Col md={6} className="d-none d-md-flex justify-content-center align-items-center image-col-pro">
            <motion.div
              className="image-box-pro"
              variants={imageVariants}
              initial="initial"
              animate={isLoaded ? "animate" : "initial"}
            >
              <DotLottieReact
                src="https://lottie.host/b8c95bce-6f47-488c-8c09-ac73f0d0f685/WBb7WEcph8.lottie"
                loop
                autoplay
                style={{ width: '100%', maxWidth: '600px', height: 'auto' }}
              />
            </motion.div>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
}

export default HomePage;