// Dashboard.js
import { Container, Row, Col, Button } from 'react-bootstrap';
import SidebarNav from '../SidebarNav/SidebarNav';
import BreadcrumbAndProfile from '../BreadcrumbAndProfile/BreadcrumbAndProfile';
import InfoCard from '../InfoCard/InfoCard';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { fetchData } from '../utils/api';
function Dashboard({ totalIncomes, totalExpenses }) {
  
  
  const [expensesData, setExpensesData] = useState([0]);
 
  const [incomesData, setIncomesData] = useState([0]); // State to hold the fetched incomes data
  // Function to reload the page
  const handleReload = () => {
    window.location.reload();
    
  };

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    if (storedName) {
      const parsedName = JSON.parse(storedName); 
    }
    const fetchIncomes = async () => {
          
          try {
            const fetchedIncomes = await fetchData("http://localhost:8095/api/v1/income/my-incomes");
            
            console.log("Fetched incomes:", fetchedIncomes);
            const totalAmount = fetchedIncomes.reduce((sum, item) => sum + parseFloat(item.amount), 0);
            setIncomesData(totalAmount); 
            console.log("Total incomes:", totalAmount);
          } catch (error) {
            console.error("Error fetching incomes:", error.response?.data || error.message);
          }
        };
        fetchIncomes(); 
        const fetchExpense = async () => {
          try {
            
            const fetchedExpense = await fetchData("http://localhost:8095/api/v1/expense/all");
            const totalExpense = fetchedExpense.reduce((sum, item) => sum + parseFloat(item.amount), 0);
            setExpensesData(totalExpense);
            
          } catch (error) {
            console.error("Error fetching incomes:", error.response?.data || error.message);
          }
        };
        fetchExpense(); 

    
  }, []);
  const total = incomesData - expensesData;
  return (
<Container fluid>
  <Row>
    <Col md={2} className="sidebar">
      <SidebarNav />
    </Col>
    <Col md={10} className="main-content main">
      <BreadcrumbAndProfile 
        role="Freelancer React Developer" 
        pageTitle="Dashboard"
        breadcrumbItems={[
          { name: 'Dashboard', path: '/dashboard', active: true },
          { name: 'Welcome', path: '/welcome', active: true }
        ]}
      />

      {/* Row for the three buttons */}
      <Row className="mb-3">
        <Col md={4}>
          <Button onClick={handleReload} className="secondary-button w-50">
            <FontAwesomeIcon icon={faRotateRight} className="icon-left"/>Reload
          </Button>
        </Col>
      </Row>

      {/* Row for the Total, Incomes, and Expenses */}
      <Row className="mb-3">
      <Col md={12}>
      <motion.div
      initial={{ opacity: 0, y: 20 }} // Initial state: transparent and slightly down
      animate={{ opacity: 1, y: 0 }} // Animate to: fully opaque and original position
      transition={{ duration: 0.5 }} // Animation duration: 0.5 seconds
      >
      <InfoCard 
        title="Total" 
        value={`$${total}`} 
        linkText="View details" 
        linkTo="/dashboard"
      />
      </motion.div>
      </Col>
    </Row>

      
    <Row>
  <Col md={6}>
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Start from slightly below and transparent
      animate={{ opacity: 1, y: 0 }} // Animate to fully visible and original position
      transition={{ duration: 0.5, delay: 0.2 }} // Delay the animation of the first card
    >
      <InfoCard
        title="Incomes"
        value={`$${incomesData}`}
        linkText="Add or manage your Income"
        linkTo="/incomes"
      />
    </motion.div>
  </Col>
  <Col md={6}>
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Start from slightly below and transparent
      animate={{ opacity: 1, y: 0 }} // Animate to fully visible and original position
      transition={{ duration: 0.5, delay: 0.4 }} // Delay the animation of the second card a bit more
    >
      <InfoCard
        title="Expenses"
        value={`$${expensesData}`}
        linkText="Add or manage your expenses"
        linkTo="/expenses"
      />
    </motion.div>
  </Col>
</Row>


         {/* Section for news cards */}
       
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
