// Dashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { Line,  } from 'react-chartjs-2';
// Components
import SidebarNav from '../SidebarNav/SidebarNav';
import BreadcrumbAndProfile from '../BreadcrumbAndProfile/BreadcrumbAndProfile';
import InfoCard from '../InfoCard/InfoCard';
import DashedLineChart from '../DashboradCompanent/DashedLineChart/DashedLineChart';
import Income from '../DashboradCompanent/Income/Income';
import ExpenseCard from '../DashboradCompanent/Expense/Expense';
import fff from '../DashboradCompanent/DashedLineChart/DashedLineChart';
import Coins from '../CoinScreen/CoinS';
import Coin from '../Coin/Coin';
// Utilities
import { fetchData } from '../utils/api';

// Styles
import './Dashboard.css';

function Dashboard() {
  // State management
  const [expensesData, setExpensesData] = useState(0);
  const [incomesData, setIncomesData] = useState(0);
  const salaryAmount = "$4,500";
  const freelancerAmount = "$1,200";
  const investmentAmount = "$800";
  const spendingData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [7500, 9500, 8000, 9794, 7000, 8500],
        borderColor: '#F43F5E',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        fill: false
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: { color: "#fff" },
        grid: { color: "rgba(255, 255, 255, 0.1)" }
      },
      x: {
        ticks: { color: "#fff" },
        grid: { color: "rgba(255, 255, 255, 0.1)" }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  // Data fetching
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        // Load user data if available
        const storedName = localStorage.getItem('username');
        if (storedName) {
          JSON.parse(storedName);
        }

        // Fetch income data
        try {
          const fetchedIncomes = await fetchData("http://localhost:8095/api/v1/income/my-incomes");
          console.log("Fetched incomes:", fetchedIncomes);
          const totalAmount = fetchedIncomes.reduce((sum, item) => sum + parseFloat(item.amount), 0);
          setIncomesData(totalAmount);
          console.log("Total incomes:", totalAmount);
        } catch (error) {
          console.error("Error fetching incomes:", error.response?.data || error.message);
        }

        // Fetch expense data
        try {
          const fetchedExpense = await fetchData("http://localhost:8095/api/v1/expense/all");
          const totalExpense = fetchedExpense.reduce((sum, item) => sum + parseFloat(item.amount), 0);
          setExpensesData(totalExpense);
        } catch (error) {
          console.error("Error fetching expenses:", error.response?.data || error.message);
        }
      } catch (error) {
        console.error("Error in data fetching:", error);
      }
    };

    fetchFinancialData();
  }, []);

  // Calculate total balance
  const total = incomesData - expensesData;

  // Page reload handler
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Container fluid className="dashboard-container">
      <Row>
        {/* Sidebar */}
        <Col md={2} className="sidebar">
          <SidebarNav />
        </Col>
  
        {/* Main Content */}
        <Col md={10} className="main-content p-3">
          {/* Header Section */}
          <BreadcrumbAndProfile 
            role="Freelancer React Developer"
            pageTitle="Dashboard"
            breadcrumbItems={[
              { name: 'Dashboard', path: '/dashboard', active: true },
              { name: 'Welcome', path: '/welcome', active: true }
            ]}
          />
  
          {/* Action Button */}
          
  
          {/* Financial Summary Cards */}
          <Row className="mb-2 justify-content-center  ">
            {/* Total Balance */}
            <Col md={3} >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card-highlight "
              >
                <InfoCard 
                  title="Monthly Net Profit"
                  value={`$${total}`}
                  linkTo="/dashboard"
                />
              </motion.div>
            </Col>
  
            {/* Incomes */}
            <Col md={3}  >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="card-highlight "

              >
                <InfoCard
                  title="Incomes"
                  value={`$${incomesData}`}
                 
                  linkTo="/incomes"
                />
              </motion.div>
            </Col>
  
            {/* Expenses */}
            <Col md={3} height="5h0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="card-highlight"
              >
                <InfoCard
                  title="Expenses"
                  value={`$${expensesData}`}
              
                  linkTo="/expenses"
                />
              </motion.div>
            </Col>
            <Col md={3}> {/* Smaller and centered */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="dashboard-panel"
      style={{  borderRadius: '12px', padding: '20px' }}
    >
      <Coins />
    </motion.div>
  </Col>

         
          </Row>
  
          {/* Financial Details Section */}
          <Row className="mb-3 ">
            {/* Income Component */}
            <Col md={4} lg={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="dashboard-panel h-100"
              >
                <Income 
                  Salary={salaryAmount}
                  Freelancer={freelancerAmount}
                  Investment={investmentAmount}
                />
              </motion.div>
            </Col>
  
            {/* Expense Component */}
            <Col md={6} lg={4} className="h-100" >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="dashboard-panel h-1000  justify-content-between"
              >
                
                <ExpenseCard />
              </motion.div>
            </Col>
            
          </Row>
  
          {/* Chart Section */}
          <Row >
            <Col md={9} >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="dashboard-panel"
                
              >
                <DashedLineChart  />
              </motion.div>
            </Col>
            
          </Row>
          <Row className="justify-content-center" >
          
</Row>
        </Col>
      </Row>
    </Container>
  );
  
}

export default Dashboard;