// Dashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import SidebarNav from '../SidebarNav/SidebarNav';
import BreadcrumbAndProfile from '../BreadcrumbAndProfile/BreadcrumbAndProfile';
import InfoCard from '../InfoCard/InfoCard';
import Income from '../DashboradCompanent/Income/Income';
import ExpenseCard from '../DashboradCompanent/Expense/Expense';
import DashedLineChart from '../DashboradCompanent/DashedLineChart/DashedLineChart';
import Coins from '../CoinScreen/CoinS';
import { fetchData } from '../utils/api';
import PredictionDashboard from "../DashboradCompanent/Predictor/PredictionDashboard";
import './Dashboard.css';


function Dashboard() {
  // username state'ini daha basit ve doğrudan tanımlama
  const [username, setUsername] = useState('');

  const [expensesData, setExpensesData] = useState(0);
  const [incomesList, setIncomesList] = useState([]);
  const [incomesData, setIncomesData] = useState(0);

  // Username bilgisini alacak useEffect - bileşen mount olduğunda bir kez çalışır
  useEffect(() => {
    const storedName = localStorage.getItem('username');

    

    if (storedName) {
      try {
        const parsedName = JSON.parse(storedName);
        if (parsedName && parsedName.firstName) {
          setUsername(parsedName.firstName);
        }
      } catch (error) {
        console.error("Error parsing username from localStorage:", error);
        // Eğer JSON parse edilemiyorsa, doğrudan string olarak kullan
        setUsername(storedName);
      }
    }
  }, []); // Boş dependency array ile sadece bir kez çalışır

  // Data fetching
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        // Fetch income data
        const fetchedIncomes = await fetchData("http://localhost:8095/api/v1/income/my-incomes");
        setIncomesList(fetchedIncomes);
        const totalAmount = fetchedIncomes.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        setIncomesData(totalAmount);

        // Fetch expense data
        const fetchedExpense = await fetchData("http://localhost:8095/api/v1/expense/all");
        const totalExpense = fetchedExpense.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        setExpensesData(totalExpense);
      } catch (error) {
        console.error("Error in data fetching:", error);
      }
    };

    fetchFinancialData();
  }, []);

  // Calculate total balance
  const total = incomesData - expensesData;

  return (
      <Container fluid className="dashboard-container" >
        <Row className="g-0">
          {/* Sidebar */}
          <Col md={2} className="sidebar">
            <SidebarNav />
          </Col>

          {/* Main Content */}
          <Col md={8} className="main-content p-3" >
            {/* Header Section */}
            <BreadcrumbAndProfile
                username={username} // Artık username değeri doğru aktarılıyor
                role="Freelancer React Developer"
                pageTitle="Dashboard"
                breadcrumbItems={[
                  {name: 'Dashboard', path: '/dashboard', active: true},
                  {name: 'Welcome', path: '/welcome', active: true},
                ]}
            />

            {/* Financial Summary Cards */}
            <Row className="justify-content-between mb-5" style={{marginTop: '60px'}}>
              <Col md={4}>
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="card-highlight"
                >
                  <InfoCard
                      title="Monthly Net Profit"
                      value={`${total.toFixed(2)}`}
                      linkTo="/dashboard"
                  />
                </motion.div>
              </Col>

              <Col md={4}>
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.2}}
                    className="card-highlight"
                >
                  <InfoCard
                      title="Incomes"
                      value={`${incomesData.toFixed(2)}`}
                      linkTo="/incomes"
                  />
                </motion.div>
              </Col>

              <Col md={3}>
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.4}}
                    className="card-highlight"
                >
                  <InfoCard
                      title="Expenses"
                      value={`${expensesData.toFixed(2)}`}
                      linkTo="/expenses"
                  />
                </motion.div>
              </Col>
            </Row>

            {/* Financial Details Section */}
            <Row className="mb-7" style={{marginTop: '60px'}}>
              {/* Income Component with dynamic data */}
              <Col md={5}>
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.3}}
                    className="dashboard-panel"
                >
                  <Income incomeSources={incomesList}/>
                </motion.div>
              </Col>

              {/* Expense Component */}
              <Col md={7} className="h-100">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.4}}
                    className="dashboard-panel h-100"
                >
                  <ExpenseCard/>
                </motion.div>
              </Col>
            </Row>

            {/* Chart Section */}
            <Row className="mb-4" style={{marginTop: '40px'}}>
              <Col md={12}>
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.5}}
                    className="dashboard-panel"
                >
                  <DashedLineChart />
                </motion.div>
              </Col>
            </Row>

            <div style={{marginTop: '40px', marginBottom: '40px'}}>
              {/* AI Tahmin Grafikleri */}
              <PredictionDashboard/>
            </div>

          </Col>

          <Col md={2} style={{paddingTop: '200px'}} className="position-relative">
            <div className="sticky-top pt-5">
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="dashboard-panel"
                  style={{ borderRadius: '12px', padding: '20px' }}
              >
                <Coins />
              </motion.div>
            </div>
          </Col>
        </Row>
      </Container>
  );
}

export default Dashboard;