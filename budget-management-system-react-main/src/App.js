import React, { useState, useEffect } from 'react'; // Added useEffect
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage'; // Make sure this path is correct
import SignIn from './components/SignIn/SignIn';
import Sign from './components/Sign/Sign'; // This is your SignUp component
import Dashboard from './components/Dashboard/Dashboard';
import Incomes from './components/Incomes/Incomes';
import Expenses from './components/Expenses/Expenses';
import SignOut from './components/SignOut/SignOut';
import News from './components/News/News';

import './App.css';

function App() {
  const [incomes, setIncomes] = useState(() => {
    const savedIncomes = localStorage.getItem('incomesData'); // Changed key for clarity
    return savedIncomes ? JSON.parse(savedIncomes) : [];
  });

  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expensesData'); // Changed key for clarity
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  // Persist incomes to localStorage
  useEffect(() => {
    localStorage.setItem('incomesData', JSON.stringify(incomes));
  }, [incomes]);

  // Persist expenses to localStorage
  useEffect(() => {
    localStorage.setItem('expensesData', JSON.stringify(expenses));
  }, [expenses]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Sign />} /> {/* Changed path for Sign Up */}

        {/* Protected/App Routes (assuming authentication handles access) */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Removed redundant props */}
        <Route path="/incomes" element={<Incomes incomes={incomes} setIncomes={setIncomes} />} />
        <Route path="/expenses" element={<Expenses expenses={expenses} setExpenses={setExpenses} />} />
        <Route path="/news" element={<News />} />
        <Route path="/signout" element={<SignOut />} />

        {/* Optional: Add a 404 Not Found Route */}
        {/* <Route path="*" element={<div>Page Not Found</div>} /> */}
      </Routes>
    </Router>
  );
}

export default App;