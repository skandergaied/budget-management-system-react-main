import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn/SignIn';
import Sign from './components/Sign/Sign'
import Dashboard from './components/Dashboard/Dashboard';
import Incomes from './components/Incomes/Incomes';
import Expenses from './components/Expenses/Expenses';
import SignOut from './components/SignOut/SignOut';

import News from './components/News/News';

import './App.css';

function App() {
  const [incomes, setIncomes] = useState(() => {
    const savedIncomes = localStorage.getItem('incomes');
    return savedIncomes ? JSON.parse(savedIncomes) : [];
  });

  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expensesAmount');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  // Calculate total incomes
  const totalIncomes = localStorage.getItem('incomes');
  // Calculate total expenses
  const totalExpenses = localStorage.getItem('expensesAmount');

  // Persist incomes and expenses to localStorage
 


  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<Sign />} />
        <Route path="/dashboard" element={<Dashboard totalIncomes={totalIncomes} totalExpenses={totalExpenses} />} />
        <Route path="/incomes" element={<Incomes incomes={incomes} setIncomes={setIncomes} />} />
        <Route path="/expenses" element={<Expenses expenses={expenses} setExpenses={setExpenses} />} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="/news" element={<News/>} />
      </Routes>
    </Router>
  );
}

export default App;
