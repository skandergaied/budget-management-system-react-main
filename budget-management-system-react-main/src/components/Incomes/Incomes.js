// src/components/Incomes/Incomes.js
import React, { useState, useEffect, useMemo } from 'react';
import { Button, Form, ListGroup, Container, Row, Col, Card, InputGroup, FormControl, Table } from 'react-bootstrap';
import SidebarNav from '../SidebarNav/SidebarNav';
import BreadcrumbAndProfile from '../BreadcrumbAndProfile/BreadcrumbAndProfile';
import * as XLSX from 'xlsx';
import './incomes.css'; // Make sure this CSS file exists and has the shared styles
import 'chartjs-adapter-date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faPlusCircle, faPenToSquare, faTrashCan, faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { fetchData } from '../utils/api';
import axios from "axios";
import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router-dom'; // useNavigate is imported but not used. Remove if not needed.

function Incomes() {
  const [Username1, setUsername] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  // const [isPaid, setIsPaid] = useState(false); // Retained if status is still part of your model - currently commented out in JSX
  const [editing, setEditing] = useState(false);
  const [currentIncome, setCurrentIncome] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [incomesPerPage] = useState(5);
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  // const navigate = useNavigate(); // Imported but not used.
  const [allIncomesData, setAllIncomesData] = useState([]);
  const categories = ['Salary', 'Freelance', 'Investment', 'Other'];

  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    if (storedName) {
      const parsedName = JSON.parse(storedName);
      setUsername(parsedName.firstName || 'User');
    }
  }, []);

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await fetchData("http://localhost:8095/api/v1/income/my-incomes");
        setAllIncomesData(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error fetching incomes:", error.response?.data || error.message);
        setAllIncomesData([]);
      }
    };
    fetchIncomes();
  }, []);

  const filteredIncomes = useMemo(() => {
    let incomes = [...allIncomesData];

    if (selectedMonth) {
      incomes = incomes.filter(income => income.date && income.date.startsWith(selectedMonth));
    }

    if (searchQuery.trim() !== '') {
      const lowerSearchQuery = searchQuery.toLowerCase();
      incomes = incomes.filter(item =>
        (item.name && item.name.toLowerCase().includes(lowerSearchQuery)) ||
        (item.description && item.description.toLowerCase().includes(lowerSearchQuery)) ||
        (item.amount && item.amount.toString().includes(searchQuery)) ||
        (item.date && item.date.toLowerCase().includes(lowerSearchQuery)) ||
        (item.category && item.category.toLowerCase().includes(lowerSearchQuery))
      );
    }
    return incomes.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [allIncomesData, selectedMonth, searchQuery]);

  const totalMonthlyAmount = useMemo(() => {
    const monthlyData = allIncomesData.filter(income => income.date && income.date.startsWith(selectedMonth));
    return monthlyData.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  }, [allIncomesData, selectedMonth]);

  const indexOfLastIncome = currentPage * incomesPerPage;
  const indexOfFirstIncome = indexOfLastIncome - incomesPerPage;
  const currentIncomes = filteredIncomes.slice(indexOfFirstIncome, indexOfLastIncome);
  const totalPages = Math.ceil(filteredIncomes.length / incomesPerPage);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(currentIncomes);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Incomes");
    XLSX.writeFile(wb, `Incomes_${selectedMonth || 'all_time'}.xlsx`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('token');

    if (!name || !amount || !date || !description || !category) {
      alert("All fields are required, including the category.");
      return;
    }

    const confirmAction = editing ? "update" : "add";
    const isConfirmed = window.confirm(`Are you sure you want to ${confirmAction} this income?`);
    if (!isConfirmed) return;

    const incomePayload = { name, amount: parseFloat(amount), date, description, category };

    if (editing && currentIncome) {
      try {
        const response = await axios.put(
          `http://localhost:8095/api/v1/income/update/${currentIncome.id}`,
          { ...incomePayload, id: currentIncome.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAllIncomesData(prevIncomes => prevIncomes.map(inc =>
          inc.id === currentIncome.id ? { ...inc, ...response.data } : inc
        ));
        resetForm();
      } catch (error) {
        console.error('Error updating income:', error.response ? error.response.data : error.message);
        alert(`Failed to update income: ${error.response?.data?.message || error.message}`);
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8095/api/v1/income/create",
          incomePayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAllIncomesData(prevIncomes => [...prevIncomes, response.data]);
        resetForm();
      } catch (error) {
        console.error('Error creating income:', error.response ? error.response.data : error.message);
        alert(`Failed to add income: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const resetForm = () => {
    setName('');
    setAmount('');
    setDate(new Date().toISOString().slice(0, 10));
    setDescription('');
    // setIsPaid(false); // If using this state
    setCategory('');
    setEditing(false);
    setCurrentIncome(null);
  };

  const handleEdit = (income) => {
    setCurrentIncome(income);
    setName(income.name);
    setAmount(income.amount.toString());
    setDate(income.date);
    setDescription(income.description);
    // setIsPaid(income.status === "PAID"); // Assuming status field exists
    setCategory(income.category);
    setEditing(true);
    window.scrollTo(0, 0);
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this income?")) return;
    const token = Cookies.get('token');
    try {
      await axios.delete(`http://localhost:8095/api/v1/income/DeleteIncome/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllIncomesData(prevIncomes => prevIncomes.filter(inc => inc.id !== id));
    } catch (error) {
      console.error('Error removing income:', error.response ? error.response.data : error.message);
      alert(`Failed to remove income: ${error.response?.data?.message || error.message}`);
    }
  };

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
        <Col xs={12} md={10} className="main-content-area"> {/* Applied generic class */}
          <BreadcrumbAndProfile
            username={Username1}
            role="Freelancer React Developer"
            pageTitle="Manage Incomes"
            breadcrumbItems={[
              { name: 'Dashboard', path: '/dashboard', active: false },
              { name: 'Incomes', path: '/incomes', active: true }
            ]}
          />

          <Row className="mb-3 align-items-center mt-4">
            <Col md={6}>
              <InputGroup>
                <FormControl
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  aria-label="Select month for incomes"
                  style={{ maxWidth: '200px' }}
                />
                <FormControl
                  placeholder="Search incomes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search incomes"
                />
              </InputGroup>
            </Col>
            <Col md={6} className="text-md-end mt-2 mt-md-0">
                <Button onClick={exportToExcel} className="excel-button"> {/* Applied generic class */}
                    <FontAwesomeIcon icon={faFileExcel} className="icon-left" /> Export Current View
                </Button>
            </Col>
          </Row>

          {searchQuery.trim() !== '' && (
            <Card className="mb-3">
              <Card.Header>{currentIncomes.length > 0 ? `Search Results (${currentIncomes.length} found)` : 'No Results Found'}</Card.Header>
              {currentIncomes.length > 0 && (
                <Table className="app-table" striped bordered hover responsive> {/* Applied generic class */}
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
                      {currentIncomes.map((item) => (
                      <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.description}</td>
                          <td>{parseFloat(item.amount || 0).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
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
                <Card className="mt-3 total-summary-card"> {/* Applied generic class */}
                  <Card.Body>
                    <Card.Title>Total Income for {selectedMonth ? new Date(selectedMonth + '-02').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'All Time'}</Card.Title>
                    <Card.Text className="total-amount-text"> {/* Applied generic class */}
                      {totalMonthlyAmount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>

          <Form onSubmit={handleSubmit} className="mt-4 app-form"> {/* Applied generic class */}
            <h5 className="mb-3">{editing ? 'Edit Income' : 'Add New Income'}</h5>
            <Row>
              <Col md={6} lg={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Income Name</Form.Label>
                  <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Project Alpha" required />
                </Form.Group>
              </Col>
              <Col md={6} lg={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Client X payment" required />
                </Form.Group>
              </Col>
              <Col md={6} lg={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Amount (€)</Form.Label>
                  <Form.Control type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 1200.00" required />
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
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12} lg={4} className="d-flex align-items-end mb-3">
                <Button type="submit" className="primary-action-button w-100"> {/* Applied generic class */}
                  <FontAwesomeIcon icon={editing ? faPenToSquare : faPlusCircle} className="icon-left" />
                  {editing ? "Update Income" : "Add Income"}
                </Button>
              </Col>
            </Row>
            {editing && (
                 <Button variant="outline-secondary" onClick={resetForm} className="mt-2">Cancel Edit</Button>
            )}
          </Form>

          <h4 className="mt-5">Incomes for {selectedMonth ? new Date(selectedMonth + '-02').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'All Time'}</h4>
          {currentIncomes.length > 0 ? (
            <ListGroup className="mt-3">
            {currentIncomes.map((incomeItem) => (
              <ListGroup.Item key={incomeItem.id} className="data-list-item"> {/* Applied generic class */}
                <div className="item-details"> {/* Applied generic class */}
                  <strong>{incomeItem.name}</strong>: {parseFloat(incomeItem.amount || 0).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })} ({new Date(incomeItem.date).toLocaleDateString()})
                  <br />
                  <small><em>{incomeItem.description}</em> - Category: {incomeItem.category || 'N/A'}</small>
                </div>
                <div className="item-actions"> {/* Applied generic class */}
                  <Button className="edit-button me-2" size="sm" onClick={() => handleEdit(incomeItem)}> {/* Applied generic class */}
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </Button>
                  <Button className="remove-button" variant="danger" size="sm" onClick={() => handleRemove(incomeItem.id)}> {/* Applied generic class */}
                    <FontAwesomeIcon icon={faTrashCan} />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          ) : (
            <p className="mt-3 text-muted">No incomes recorded for this period. Add some using the form above!</p>
          )}

          {totalPages > 1 && (
            <div className="pagination-controls mt-4"> {/* Applied generic class */}
              <Button onClick={handlePreviousPage} className="pagination-button" disabled={currentPage === 1}> {/* Applied generic class */}
                <FontAwesomeIcon icon={faArrowCircleLeft} /> Previous
              </Button>
              <span>Page {currentPage} of {totalPages}</span>
              <Button onClick={handleNextPage} className="pagination-button" disabled={currentPage === totalPages}> {/* Applied generic class */}
                Next <FontAwesomeIcon icon={faArrowCircleRight} />
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Incomes;