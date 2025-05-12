import React, { useState, useEffect } from 'react';
import { Button, Form, ListGroup, Container, Row, Col, Card, InputGroup, FormControl } from 'react-bootstrap';
import { Chart as ChartJS } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileExcel,
  faArrowCircleLeft,
  faPlusCircle,
  faPenToSquare,
  faTrashCan,
  faArrowCircleRight
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import axios from "axios";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import SidebarNav from '../SidebarNav/SidebarNav';
import BreadcrumbAndProfile from '../BreadcrumbAndProfile/BreadcrumbAndProfile';
import PredictionPanel from '../Panel/PredictionPanel';
import './incomes.css';
import 'chartjs-adapter-date-fns';

function Incomes() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentIncome, setCurrentIncome] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [incomesPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [incomesData, setIncomesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const categories = ['Salary', 'Freelance', 'Investment', 'Additional Income', 'Passive Income', 'Other'];

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

    const fetchIncomes = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = Cookies.get('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(
            "http://localhost:8095/api/v1/income/my-incomes",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        setIncomesData(response.data);
      } catch (error) {
        console.error("Error fetching incomes:", error);
        setError(error.response?.data?.message || "Failed to fetch incomes");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchIncomes();
  }, [navigate]);

  const totalAmount = incomesData.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  const chartData = {
    labels: incomesData.map(income => new Date(income.date)),
    datasets: [
      {
        label: 'Income Trend',
        data: incomesData.map(income => parseFloat(income.amount)),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
            ? "Are you sure you want to update this income?"
            : "Are you sure you want to add this income?"
    );
    if (!isConfirmed) return;

    const incomeData = {
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
            `http://localhost:8095/api/v1/income/update/${currentIncome.id}`,
            incomeData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        setIncomesData(incomesData.map(item =>
            item.id === currentIncome.id ? response.data : item
        ));
      } else {
        response = await axios.post(
            "http://localhost:8095/api/v1/income/create",
            incomeData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        setIncomesData([...incomesData, response.data]);
      }
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  const handleEdit = (income) => {
    setEditing(true);
    setCurrentIncome(income);
    setName(income.name);
    setAmount(income.amount);
    setDate(income.date);
    setDescription(income.description || '');
    setCategory(income.category);
  };

  const handleRemove = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this income?");
    if (!isConfirmed) return;

    const token = Cookies.get('token');
    try {
      await axios.delete(
          `http://localhost:8095/api/v1/income/DeleteIncome/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      setIncomesData(incomesData.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || "Failed to delete income");
    }
  };

  const resetForm = () => {
    setName('');
    setAmount('');
    setDate('');
    setDescription('');
    setCategory('');
    setEditing(false);
    setCurrentIncome(null);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(incomesData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Incomes");
    XLSX.writeFile(wb, "Incomes.xlsx");
  };

  // Pagination logic
  const indexOfLastIncome = currentPage * incomesPerPage;
  const indexOfFirstIncome = indexOfLastIncome - incomesPerPage;
  const currentIncomes = incomesData.slice(indexOfFirstIncome, indexOfLastIncome);
  const totalPages = Math.ceil(incomesData.length / incomesPerPage);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const filteredIncomes = searchQuery
      ? incomesData.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.amount.toString().includes(searchQuery) ||
          item.date.includes(searchQuery) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : incomesData;

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
                pageTitle="Incomes"
                breadcrumbItems={[
                  { name: 'Dashboard', path: '/dashboard', active: false },
                  { name: 'Incomes', path: '/incomes', active: true }
                ]}
            />

            {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
            )}

            <InputGroup className="mb-3">
              <FormControl
                  placeholder="Search incomes..."
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
                      <Card.Title>Total Income</Card.Title>
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
                      <Card.Title>Income Trends</Card.Title>
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
                        placeholder="Income source"
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
                {editing ? 'Update Income' : 'Add Income'}
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
                <h5>Income Records</h5>
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
                      {filteredIncomes.length > 0 ? (
                          filteredIncomes.slice(indexOfFirstIncome, indexOfLastIncome).map((income) => (
                              <ListGroup.Item key={income.id} className="mb-2">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <h6>{income.name}</h6>
                                    <div className="text-muted small">
                                      <span className="me-3">€{parseFloat(income.amount).toFixed(2)}</span>
                                      <span className="me-3">{income.date}</span>
                                      <span className="badge bg-info">{income.category}</span>
                                    </div>
                                    {income.description && (
                                        <p className="mt-1 mb-0 small">{income.description}</p>
                                    )}
                                  </div>
                                  <div>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleEdit(income)}
                                    >
                                      <FontAwesomeIcon icon={faPenToSquare} />
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleRemove(income.id)}
                                    >
                                      <FontAwesomeIcon icon={faTrashCan} />
                                    </Button>
                                  </div>
                                </div>
                              </ListGroup.Item>
                          ))
                      ) : (
                          <ListGroup.Item className="text-center py-4">
                            No income records found
                          </ListGroup.Item>
                      )}
                    </ListGroup>

                    {incomesData.length > incomesPerPage && (
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

            <div className="mt-5">
              <PredictionPanel />
            </div>
          </Col>
        </Row>
      </Container>
  );
}

export default Incomes;