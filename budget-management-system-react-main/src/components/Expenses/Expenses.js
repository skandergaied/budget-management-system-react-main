// src/components/Expenses/Expenses.js (or your preferred path)
import React, { useState, useEffect, useMemo } from 'react';
import { Button, Form, ListGroup, Container, Row, Col, Card, InputGroup, FormControl, Table } from 'react-bootstrap';
import SidebarNav from '../SidebarNav/SidebarNav'; // Adjust path if necessary
import BreadcrumbAndProfile from '../BreadcrumbAndProfile/BreadcrumbAndProfile'; // Adjust path
import * as XLSX from 'xlsx';
import './expenses.css'; // Create this CSS file (content provided below)
import 'chartjs-adapter-date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faPlusCircle, faPenToSquare, faTrashCan, faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { fetchData } from '../utils/api'; // Adjust path
import axios from "axios";
import Cookies from 'js-cookie';

function Expenses() {
  const [Username1, setUsername] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expensesPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [allExpensesData, setAllExpensesData] = useState([]);
  
  const expenseCategories = ['Utility', 'Rent', 'Groceries', 'Entertainment', 'Transportation', 'Healthcare', 'Education', 'Subscription', 'Clothing', 'Personal Care', 'Debt Payment', 'Other'];

  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    if (storedName) {
      const parsedName = JSON.parse(storedName);
      setUsername(parsedName.firstName || 'User');
    }
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetchData("http://localhost:8095/api/v1/expense/all");
        setAllExpensesData(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error fetching expenses:", error.response?.data || error.message);
        setAllExpensesData([]);
      }
    };
    fetchExpenses();
  }, []);

  const filteredExpenses = useMemo(() => {
    let expenses = allExpensesData;

    if (selectedMonth) {
      expenses = expenses.filter(expense => expense.date && expense.date.startsWith(selectedMonth));
    }

    if (searchQuery.trim() !== '') {
      const lowerSearchQuery = searchQuery.toLowerCase();
      expenses = expenses.filter(item =>
        (item.name && item.name.toLowerCase().includes(lowerSearchQuery)) ||
        (item.description && item.description.toLowerCase().includes(lowerSearchQuery)) ||
        (item.amount && item.amount.toString().includes(searchQuery)) || // Amount search can be exact
        (item.date && item.date.toLowerCase().includes(lowerSearchQuery)) ||
        (item.category && item.category.toLowerCase().includes(lowerSearchQuery))
      );
    }
    // Sort by date descending to show recent expenses first
    return expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [allExpensesData, selectedMonth, searchQuery]);

  const totalMonthlyAmount = useMemo(() => {
    // Calculate total based on expenses filtered only by month (before search query for the card total)
    const monthlyData = allExpensesData.filter(expense => expense.date && expense.date.startsWith(selectedMonth));
    return monthlyData.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  }, [allExpensesData, selectedMonth]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(currentExpenses); // Exports currently paginated view of filtered data
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(wb, `Expenses_${selectedMonth || 'all_time'}.xlsx`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('token');

    if (!name || !amount || !date || !description || !category) {
      alert("All fields are required, including the category.");
      return;
    }

    const confirmAction = editing ? "update" : "add";
    const isConfirmed = window.confirm(`Are you sure you want to ${confirmAction} this expense?`);
    if (!isConfirmed) return;

    const expensePayload = { name, amount: parseFloat(amount), date, description, category };

    if (editing && currentExpense) {
      try {
        const response = await axios.put(
          `http://localhost:8095/api/v1/expense/update/${currentExpense.id}`, // ASSUMED endpoint
          { ...expensePayload, id: currentExpense.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAllExpensesData(allExpensesData.map(exp =>
          exp.id === currentExpense.id ? { ...exp, ...response.data } : exp
        ));
        resetForm();
      } catch (error) {
        console.error('Error updating expense:', error.response ? error.response.data : error.message);
        alert(`Failed to update expense: ${error.response?.data?.message || error.message}`);
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8095/api/v1/expense/create", // ASSUMED endpoint
          expensePayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAllExpensesData([...allExpensesData, response.data]);
        resetForm();
      } catch (error) {
        console.error('Error creating expense:', error.response ? error.response.data : error.message);
        alert(`Failed to add expense: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const resetForm = () => {
    setName('');
    setAmount('');
    setDate(new Date().toISOString().slice(0, 10));
    setDescription('');
    setCategory('');
    setEditing(false);
    setCurrentExpense(null);
  };

  const handleEdit = (expense) => {
    setCurrentExpense(expense);
    setName(expense.name);
    setAmount(expense.amount.toString());
    setDate(expense.date);
    setDescription(expense.description);
    setCategory(expense.category);
    setEditing(true);
    window.scrollTo(0, 0);
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this expense?")) return;
    const token = Cookies.get('token');
    try {
      await axios.delete(`http://localhost:8095/api/v1/expense/delete/${id}`, { // ASSUMED endpoint
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllExpensesData(allExpensesData.filter(exp => exp.id !== id));
    } catch (error) {
      console.error('Error removing expense:', error.response ? error.response.data : error.message);
      alert(`Failed to remove expense: ${error.response?.data?.message || error.message}`);
    }
  };

  const indexOfLastExpense = currentPage * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirstExpense, indexOfLastExpense);
  const totalPages = Math.ceil(filteredExpenses.length / expensesPerPage);

  const handlePreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth, searchQuery]);

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="sidebar d-none d-md-block">
          <SidebarNav />
        </Col>
        <Col xs={12} md={10} className="main-content-area"> {/* Changed class for clarity */}
          <BreadcrumbAndProfile
            username={Username1}
            role="User" // Or dynamically set
            pageTitle="Manage Expenses"
            breadcrumbItems={[
              { name: 'Dashboard', path: '/dashboard', active: false },
              { name: 'Expenses', path: '/expenses', active: true }
            ]}
          />

          <Row className="mb-3 align-items-center mt-4">
            <Col md={6}>
              <InputGroup>
                <FormControl
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  aria-label="Select month for expenses"
                  style={{ maxWidth: '200px' }}
                />
                <FormControl
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search expenses"
                />
              </InputGroup>
            </Col>
            <Col md={6} className="text-md-end mt-2 mt-md-0">
                <Button onClick={exportToExcel} className="excel-button">
                    <FontAwesomeIcon icon={faFileExcel} className="icon-left" /> Export Current View
                </Button>
            </Col>
          </Row>

          {searchQuery.trim() !== '' && (
            <Card className="mb-3">
              <Card.Header>{currentExpenses.length > 0 ? `Search Results (${currentExpenses.length} found)` : 'No Results Found'}</Card.Header>
              {currentExpenses.length > 0 && (
                <Table className="app-table" striped bordered hover responsive>
                  <thead>
                      <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Category</th>
                      </tr>
                  </thead>
                  <tbody>
                      {currentExpenses.map((item) => (
                      <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.description}</td>
                          <td>{item.amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                          <td>{new Date(item.date).toLocaleDateString()}</td>
                          <td>{item.category}</td>
                      </tr>
                      ))}
                  </tbody>
                </Table>
              )}
            </Card>
           )}

          <Row>
            <Col md={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="mt-3 total-summary-card">
                  <Card.Body>
                    <Card.Title>Total Expenses for {selectedMonth ? new Date(selectedMonth + '-02').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'All Time'}</Card.Title>
                    <Card.Text className="total-amount-text">
                      {totalMonthlyAmount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>

          <Form onSubmit={handleSubmit} className="mt-4 app-form">
            <h5 className="mb-3">{editing ? 'Edit Expense' : 'Add New Expense'}</h5>
            <Row>
              <Col md={6} lg={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Expense Name</Form.Label>
                  <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Electricity Bill" required />
                </Form.Group>
              </Col>
              <Col md={6} lg={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Monthly utility" required />
                </Form.Group>
              </Col>
              <Col md={6} lg={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Amount (€)</Form.Label>
                  <Form.Control type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 75.50" required />
                </Form.Group>
              </Col>
              <Col md={6} lg={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </Form.Group>
              </Col>
              <Col md={6} lg={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Select Category</option>
                    {expenseCategories.map((cat, index) => (
                      <option key={index} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12} lg={4} className="d-flex align-items-end mb-3">
                <Button type="submit" className="primary-action-button w-100">
                  <FontAwesomeIcon icon={editing ? faPenToSquare : faPlusCircle} className="icon-left" />
                  {editing ? "Update Expense" : "Add Expense"}
                </Button>
              </Col>
            </Row>
            {editing && (
                 <Button variant="outline-secondary" onClick={resetForm} className="mt-2">Cancel Edit</Button>
            )}
          </Form>

          <h4 className="mt-5">Expenses for {selectedMonth ? new Date(selectedMonth + '-02').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'All Time'}</h4>
          {currentExpenses.length > 0 ? (
            <ListGroup className="mt-3">
            {currentExpenses.map((expenseItem) => (
              <ListGroup.Item key={expenseItem.id} className="data-list-item">
                <div className="item-details">
                  <strong>{expenseItem.name}</strong>: {parseFloat(expenseItem.amount).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })} ({new Date(expenseItem.date).toLocaleDateString()})
                  <br />
                  <small><em>{expenseItem.description}</em> - Category: {expenseItem.category || 'N/A'}</small>
                </div>
                <div className="item-actions">
                  <Button className="edit-button me-2" size="sm" onClick={() => handleEdit(expenseItem)}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </Button>
                  <Button className="remove-button" variant="danger" size="sm" onClick={() => handleRemove(expenseItem.id)}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          ) : (
            <p className="mt-3 text-muted">No expenses recorded for this period. Add some using the form above!</p>
          )}

          {totalPages > 1 && (
            <div className="pagination-controls mt-4">
              <Button onClick={handlePreviousPage} className="pagination-button" disabled={currentPage === 1}>
                <FontAwesomeIcon icon={faArrowCircleLeft} /> Previous
              </Button>
              <span>Page {currentPage} of {totalPages}</span>
              <Button onClick={handleNextPage} className="pagination-button" disabled={currentPage === totalPages}>
                Next <FontAwesomeIcon icon={faArrowCircleRight} />
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Expenses;




