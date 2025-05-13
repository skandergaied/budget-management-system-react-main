// src/components/Dashboard/Dashboard.js
import React, { useState, useEffect, useMemo, useRef } from 'react'; // Added useRef
import { Link } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap'; // Added Button if needed, Spinner, Alert
import { motion, animate } from 'framer-motion'; // Added animate import
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Assuming InfoCard might use it
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons'; // Icons for buttons, potentially used elsewhere

// Components (adjust paths as necessary)
import SidebarNav from '../SidebarNav/SidebarNav';
import BreadcrumbAndProfile from '../BreadcrumbAndProfile/BreadcrumbAndProfile';
import InfoCard from '../InfoCard/InfoCard';
import DashedLineChart from '../DashboradCompanent/DashedLineChart/DashedLineChart';
import Income from '../DashboradCompanent/Income/Income';
import ExpenseCard from '../DashboradCompanent/Expense/Expense';
import Coins from '../CoinScreen/CoinS';
import PredictionCard from '../PredictionCard/PredictionCard';

// Utilities
import { fetchData } from '../utils/api'; // Assuming you have this utility

// Styles
import './Dashboard.css';

// --- Inline Animated Number Component ---
function InlineAnimatedNumber({ targetValue, duration = 1.5 }) {
  const nodeRef = useRef();

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(0, targetValue, {
      duration: duration,
      ease: "easeOut",
      onUpdate(value) {
        node.textContent = Math.round(value).toLocaleString();
      }
    });

    return () => controls.stop();
  }, [targetValue, duration]);

  return <span ref={nodeRef}>0</span>;
}
// --- End Inline Component ---


function Dashboard() {
  // --- State Variables ---
  const [currentUsername, setCurrentUsername] = useState('');
  const [monthlyTotalIncome, setMonthlyTotalIncome] = useState(0);
  const [monthlyTotalExpense, setMonthlyTotalExpense] = useState(0);
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [monthlyFreelance, setMonthlyFreelance] = useState(0);
  const [monthlyInvestment, setMonthlyInvestment] = useState(0);
  const [monthlyOtherIncome, setMonthlyOtherIncome] = useState(0);
  const [rechartsChartData, setRechartsChartData] = useState([]);
  const [allFetchedExpenses, setAllFetchedExpenses] = useState([]);
  const [currentDashboardMonth, setCurrentDashboardMonth] = useState(new Date().getMonth());
  const [currentDashboardYear, setCurrentDashboardYear] = useState(new Date().getFullYear());
  const [predictions, setPredictions] = useState(null);
  const [loadingPredictions, setLoadingPredictions] = useState(true);
  const [errorPredictions, setErrorPredictions] = useState(null);

  // --- Effects ---
  useEffect(() => {
    // Get Username from localStorage
    const storedNameData = localStorage.getItem('username');
    if (storedNameData) {
      try {
          const parsedName = JSON.parse(storedNameData);
          setCurrentUsername(parsedName.firstName || 'User');
      } catch (e) {
          console.error("Failed to parse username from localStorage", e);
          setCurrentUsername('User');
      }
    } else {
        setCurrentUsername('User');
    }

    // Fetch Financial Data (Incomes & Expenses)
    const fetchFinancialData = async () => {
      try {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        setCurrentDashboardMonth(currentMonth);
        setCurrentDashboardYear(currentYear);

        // Incomes
        const fetchedIncomes = await fetchData("http://localhost:8095/api/v1/income/my-incomes");
        let currentMonthIncomesTotalAgg = 0;
        let currentMonthSalaryAgg = 0, currentMonthFreelanceAgg = 0, currentMonthInvestmentAgg = 0, currentMonthOtherIncomeAgg = 0;
        const incomeTotalsByMonth = {};

        if (Array.isArray(fetchedIncomes)) {
          fetchedIncomes.forEach(income => {
            if (!income.date || typeof income.amount === 'undefined' || income.amount === null) return;
            const incomeDate = new Date(income.date);
            const amount = parseFloat(income.amount);
            if (isNaN(amount)) return;

            const yearMonthKey = `${incomeDate.getFullYear()}-${String(incomeDate.getMonth() + 1).padStart(2, '0')}`;
            incomeTotalsByMonth[yearMonthKey] = (incomeTotalsByMonth[yearMonthKey] || 0) + amount;

            if (incomeDate.getFullYear() === currentYear && incomeDate.getMonth() === currentMonth) {
              currentMonthIncomesTotalAgg += amount;
              if (income.category === 'Salary') currentMonthSalaryAgg += amount;
              else if (income.category === 'Freelance') currentMonthFreelanceAgg += amount;
              else if (income.category === 'Investment') currentMonthInvestmentAgg += amount;
              else if (income.category === 'Other') currentMonthOtherIncomeAgg += amount;
            }
          });
          setMonthlyTotalIncome(currentMonthIncomesTotalAgg);
          setMonthlySalary(currentMonthSalaryAgg);
          setMonthlyFreelance(currentMonthFreelanceAgg);
          setMonthlyInvestment(currentMonthInvestmentAgg);
          setMonthlyOtherIncome(currentMonthOtherIncomeAgg);
        } else {
            console.error("Fetched incomes is not an array or is null:", fetchedIncomes);
        }

        // Expenses
        const fetchedExpenses = await fetchData("http://localhost:8095/api/v1/expense/all");
        setAllFetchedExpenses(Array.isArray(fetchedExpenses) ? fetchedExpenses : []);

        let currentMonthExpensesTotalAgg = 0;
        const expenseTotalsByMonth = {};

        if (Array.isArray(fetchedExpenses)) {
          fetchedExpenses.forEach(expense => {
            if (!expense.date || typeof expense.amount === 'undefined' || expense.amount === null || !expense.category) return;
            const expenseDate = new Date(expense.date);
            const amount = parseFloat(expense.amount);
            if (isNaN(amount)) return;

            const yearMonthKey = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;
            expenseTotalsByMonth[yearMonthKey] = (expenseTotalsByMonth[yearMonthKey] || 0) + amount;

            if (expenseDate.getFullYear() === currentYear && expenseDate.getMonth() === currentMonth) {
              currentMonthExpensesTotalAgg += amount;
            }
          });
          setMonthlyTotalExpense(currentMonthExpensesTotalAgg);
        } else {
            console.error("Fetched expenses is not an array or is null:", fetchedExpenses);
        }

        // Prepare Chart Data for the Current Year
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const yearlyChartData = [];
        for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
          const monthName = monthNames[monthIndex];
          const yearMonthKey = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}`;
          yearlyChartData.push({
            name: monthName,
            income: incomeTotalsByMonth[yearMonthKey] || 0,
            expense: expenseTotalsByMonth[yearMonthKey] || 0,
          });
        }
        setRechartsChartData(yearlyChartData);

      } catch (error) {
        console.error("Error in financial data fetching:", error);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const defaultChartData = monthNames.map(name => ({ name, income: 0, expense: 0 }));
        setRechartsChartData(defaultChartData);
        setAllFetchedExpenses([]);
        setMonthlyTotalIncome(0);
        setMonthlyTotalExpense(0);
        setMonthlySalary(0);
        setMonthlyFreelance(0);
        setMonthlyInvestment(0);
        setMonthlyOtherIncome(0);
      }
    };

    // Fetch Price Predictions
    const fetchPricePredictions = async () => {
      setLoadingPredictions(true);
      setErrorPredictions(null);
      try {
        const response = await axios.get('https://pfeapiml.onrender.com/api/predictions');
        if (response.data && response.data.predictions) {
          setPredictions(response.data.predictions);
        } else {
          console.warn("Predictions API response format unexpected:", response.data);
          setErrorPredictions('Unexpected data format from predictions API.');
        }
      } catch (err) {
        console.error("Error fetching price predictions:", err);
        let errorMsg = 'Failed to fetch price predictions.';
        if (err.response) {
            errorMsg += ` Status: ${err.response.status}`;
        } else if (err.request) {
            errorMsg += ' No response received from server.';
        } else {
            errorMsg += ` Error: ${err.message}`;
        }
        setErrorPredictions(errorMsg);
      } finally {
        setLoadingPredictions(false);
      }
    };

    fetchFinancialData();
    fetchPricePredictions();
  }, []); // Empty dependency array ensures this runs once on mount

  // Calculated Values
  const monthlyNetProfit = monthlyTotalIncome - monthlyTotalExpense;

  // --- JSX Rendering ---
  return (
    <Container fluid className="dashboard-container">
      <Row>
        {/* Sidebar */}
        <Col md={2} className="sidebar d-none d-md-block">
          <SidebarNav />
        </Col>

        {/* Main Content */}
        <Col xs={12} md={8} className="main-content p-3 main-content-area-with-fixed-sidebar">
          <BreadcrumbAndProfile
            username={currentUsername}
            role="User" // Generic role or fetch dynamically
            pageTitle="Dashboard Overview"
            breadcrumbItems={[{ name: 'Dashboard', path: '/dashboard', active: true }]}
          />

          {/* Info Cards */}
          <Row className="justify-content-center mb-4" style={{ marginTop: '40px' }}>
            <Col xs={12} sm={6} md={4} className="mb-3">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="card-highlight h-100">
                <InfoCard title="Current Month's Net Profit" value={`$${monthlyNetProfit.toFixed(2)}`} linkTo="/dashboard" />
              </motion.div>
            </Col>
            <Col xs={12} sm={6} md={4} className="mb-3">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="card-highlight h-100">
                <InfoCard title="Current Month's Incomes" value={`$${monthlyTotalIncome.toFixed(2)}`} linkTo="/incomes" />
              </motion.div>
            </Col>
            <Col xs={12} sm={12} md={4} className="mb-3">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="card-highlight h-100">
                <InfoCard title="Current Month's Expenses" value={`$${monthlyTotalExpense.toFixed(2)}`} linkTo="/expenses" />
              </motion.div>
            </Col>
          </Row>

          {/* Food Price Predictions */}
          <Row className="justify-content-center mb-4" style={{ marginTop: '30px' }}>
             <Col xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="dashboard-panel"
              >
                <h3 className="panel-title mb-3">Food Price Predictions</h3>
                 {loadingPredictions && (
                  <div className="text-center my-3">
                    <Spinner animation="border" role="status" size="sm" />
                    <p className='mt-2 mb-0'>Loading predictions...</p>
                  </div>
                )}
                {errorPredictions && (
                  <Alert variant="warning" className="my-3 small"> {/* Use warning or danger */}
                    Could not load predictions: {errorPredictions}
                  </Alert>
                )}
                {predictions && !loadingPredictions && !errorPredictions && (
                  <Row xs={1} sm={2} lg={3} xl={4} className="g-3"> {/* Use g-3 or g-4 for spacing */}
                    {Object.entries(predictions).map(([itemName, data]) => (
                      <Col key={itemName}>
                        <PredictionCard
                          itemName={itemName}
                          latestPrice={data.latest_price}
                          predictedPrice={data.predicted_price}
                          changePercentage={data.change_percentage}
                        />
                      </Col>
                    ))}
                  </Row>
                )}
                 {!predictions && !loadingPredictions && !errorPredictions && (
                     <p className="text-muted text-center my-3">No prediction data available.</p>
                 )}
              </motion.div>
            </Col>
          </Row>

          {/* Income & Expense Cards */}
          <Row className="justify-content-center mb-4" style={{ marginTop: '30px' }}>
            <Col md={12} lg={6} className="mb-3">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="dashboard-panel h-100">
                 <Income
                  Salary={`$${monthlySalary.toFixed(2)}`}
                  Freelancer={`$${monthlyFreelance.toFixed(2)}`}
                  Investment={`$${monthlyInvestment.toFixed(2)}`}
                  Other={`$${monthlyOtherIncome.toFixed(2)}`}
                />
              </motion.div>
            </Col>
            <Col md={12} lg={6} className="mb-3">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="dashboard-panel h-100" style={{ minHeight: '370px' }}>
                  <ExpenseCard
                    allExpenses={allFetchedExpenses}
                    targetMonth={currentDashboardMonth}
                    targetYear={currentDashboardYear}
                  />
              </motion.div>
            </Col>
          </Row>

          {/* Yearly Chart */}
          <Row className="justify-content-center" style={{ marginTop: '30px' }}>
             <Col md={12} className="mb-3">
                {/* Centering container for the chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    // Flexbox classes for centering
                    className="dashboard-panel h-100 d-flex flex-column justify-content-center align-items-center"
                    style={{ minHeight: '400px' }} // Increased minHeight slightly
                >
                    <DashedLineChart chartData={rechartsChartData} />
                </motion.div>
             </Col>
          </Row>
        </Col>

        {/* Crypto Sidebar */}
        <Col xs={12} md={2} className="crypto-sidebar p-3"> {/* Removed potentially conflicting class */}
           <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="dashboard-panel crypto-panel-sticky" // Ensure this class handles stickiness
            >
                <Coins />
            </motion.div>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;