import React, { useState, useEffect } from 'react';
import { Button, Form, ListGroup, Container, Row, Col, Card, InputGroup, FormControl } from 'react-bootstrap';
import { Chart as ChartJS } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileExcel,
  faArrowCircleLeft,
  faArrowCircleRight,
  faPlusCircle,
  faPenToSquare,
  faTrashCan
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import axios from "axios";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import SidebarNav from '../SidebarNav/SidebarNav';
import BreadcrumbAndProfile from '../BreadcrumbAndProfile/BreadcrumbAndProfile';
import './expenses.css';
import 'chartjs-adapter-date-fns';

function Expenses() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expensesPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [expensesData, setExpensesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const categories = ['Utility', 'Rent', 'Groceries', 'Entertainment', 'Transportation', 'Healthcare', 'Financial', 'Personal', 'Education', 'Home', 'Social', 'Daily', 'Other'];

  useEffect(() => {
    const fetchUserData = () => {
      const storedName = localStorage.getItem('username');
      if (storedName) {
        try {
          const parsedName = JSON.parse(storedName);
          setUsername(parsedName.firstName || '');
        } catch (e) {
          console.error("Error parsing username:", e);
        }
      }
    };

    const fetchExpenses = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = Cookies.get('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(
            "http://localhost:8095/api/v1/expense/all",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        setExpensesData(response.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setError(error.response?.data?.message || "Failed to fetch expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchExpenses();
  }, [navigate]);

  const totalAmount = expensesData.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  const chartData = {
    labels: expensesData.map(expense => new Date(expense.date)),
    datasets: [
      {
        label: 'Expense Trend',
        data: expensesData.map(expense => parseFloat(expense.amount)),
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'MMM d, yyyy',
          displayFormats: {
            day: 'MMM d'
          }
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Amount (€)'
        },
        ticks: {
          callback: function(value) {
            return '€' + value;
          }
        },
        suggestedMin: 0
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: €${context.parsed.y}`;
          }
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !amount || !date || !category) {
      alert("Please fill all required fields");
      return;
    }

    const isConfirmed = window.confirm(
        editing
            ? "Are you sure you want to update this expense?"
            : "Are you sure you want to add this expense?"
    );
    if (!isConfirmed) return;

    const expenseData = {
      name,
      amount: parseFloat(amount),
      date,
      description,
      category
    };

    const token = Cookies.get('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      let response;
      if (editing) {
        response = await axios.put(
            `http://localhost:8095/api/v1/expense/update/${currentExpense.id}`,
            expenseData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        setExpensesData(expensesData.map(item =>
            item.id === currentExpense.id ? response.data : item
        ));
      } else {
        response = await axios.post(
            "http://localhost:8095/api/v1/expense/create",
            expenseData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        setExpensesData([...expensesData, response.data]);
      }
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  const handleEdit = (expense) => {
    setEditing(true);
    setCurrentExpense(expense);
    setName(expense.name);
    setAmount(expense.amount);
    setDate(expense.date);
    setDescription(expense.description || '');
    setCategory(expense.category);
  };

  const handleRemove = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this expense?");
    if (!isConfirmed) return;

    const token = Cookies.get('token');
    try {
      await axios.delete(
          `http://localhost:8095/api/v1/expense/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      setExpensesData(expensesData.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || "Failed to delete expense");
    }
  };

  const resetForm = () => {
    setName('');
    setAmount('');
    setDate('');
    setDescription('');
    setCategory('');
    setEditing(false);
    setCurrentExpense(null);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(expensesData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(wb, "Expenses.xlsx");
  };

  // Pagination logic
  const indexOfLastExpense = currentPage * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = expensesData.slice(indexOfFirstExpense, indexOfLastExpense);
  const totalPages = Math.ceil(expensesData.length / expensesPerPage);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const filteredExpenses = searchQuery
      ? expensesData.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.amount.toString().includes(searchQuery) ||
          item.date.includes(searchQuery) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : expensesData;

  return (
      <Container fluid>
        <Row>
          <Col md={2} className="sidebar">
            <SidebarNav />
          </Col>
          <Col md={10} className="main">
            <BreadcrumbAndProfile
                username={username}
                role="User"
                pageTitle="Expenses"
                breadcrumbItems={[
                  { name: 'Dashboard', path: '/dashboard', active: false },
                  { name: 'Expenses', path: '/expenses', active: true }
                ]}
            />

            {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
            )}

            <InputGroup className="mb-3">
              <FormControl
                  placeholder="Search expenses..."
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <Row>
              <Col md={6}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                  <Card className="mt-3 total">
                    <Card.Body>
                      <Card.Title>Total Expenses</Card.Title>
                      <Card.Text className="display-6">
                        €{totalAmount.toFixed(2)}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
              <Col md={6}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="mt-3">
                    <Card.Body>
                      <Card.Title>Expense Trends</Card.Title>
                      <div style={{ height: '250px' }}>
                        <Line data={chartData} options={chartOptions} />
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            </Row>

            <Form onSubmit={handleSubmit} className="mt-4">
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="formName">
                    <Form.Label>Name*</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Expense name"
                        required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="formAmount">
                    <Form.Label>Amount (€)*</Form.Label>
                    <Form.Control
                        type="number"
                        min="0"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="formDate">
                    <Form.Label>Date*</Form.Label>
                    <Form.Control
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Additional details"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formCategory">
                    <Form.Label>Category*</Form.Label>
                    <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                      <option value="">Select category</option>
                      {categories.map((cat, index) => (
                          <option key={index} value={cat}>{cat}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Button
                  variant="primary"
                  type="submit"
                  className="me-2"
              >
                <FontAwesomeIcon icon={editing ? faPenToSquare : faPlusCircle} className="me-2" />
                {editing ? 'Update Expense' : 'Add Expense'}
              </Button>
              {editing && (
                  <Button
                      variant="secondary"
                      onClick={resetForm}
                  >
                    Cancel
                  </Button>
              )}
            </Form>

            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Expense Records</h5>
                <Button onClick={exportToExcel} variant="success">
                  <FontAwesomeIcon icon={faFileExcel} className="me-2" />
                  Export to Excel
                </Button>
              </div>

              {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
              ) : (
                  <>
                    <ListGroup>
                      {filteredExpenses.length > 0 ? (
                          filteredExpenses.slice(indexOfFirstExpense, indexOfLastExpense).map((expense) => (
                              <ListGroup.Item key={expense.id} className="mb-2">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <h6>{expense.name}</h6>
                                    <div className="text-muted small">
                                      <span className="me-3">€{parseFloat(expense.amount).toFixed(2)}</span>
                                      <span className="me-3">{expense.date}</span>
                                      <span className="badge bg-info">{expense.category}</span>
                                    </div>
                                    {expense.description && (
                                        <p className="mt-1 mb-0 small">{expense.description}</p>
                                    )}
                                  </div>
                                  <div>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleEdit(expense)}
                                    >
                                      <FontAwesomeIcon icon={faPenToSquare} />
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleRemove(expense.id)}
                                    >
                                      <FontAwesomeIcon icon={faTrashCan} />
                                    </Button>
                                  </div>
                                </div>
                              </ListGroup.Item>
                          ))
                      ) : (
                          <ListGroup.Item className="text-center py-4">
                            No expense records found
                          </ListGroup.Item>
                      )}
                    </ListGroup>

                    {expensesData.length > expensesPerPage && (
                        <div className="d-flex justify-content-center mt-3">
                          <Button
                              variant="outline-primary"
                              className="me-2"
                              onClick={handlePreviousPage}
                              disabled={currentPage === 1}
                          >
                            <FontAwesomeIcon icon={faArrowCircleLeft} />
                          </Button>
                          <span className="mx-2 align-self-center">
                      Page {currentPage} of {totalPages}
                    </span>
                          <Button
                              variant="outline-primary"
                              onClick={handleNextPage}
                              disabled={currentPage === totalPages}
                          >
                            <FontAwesomeIcon icon={faArrowCircleRight} />
                          </Button>
                        </div>
                    )}
                  </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
  );
}

export default Expenses;