import React, { useState, useEffect } from 'react';
import { Button, Form, ListGroup, Container, Row, Col, Card, InputGroup, FormControl } from 'react-bootstrap';
import SidebarNav from '../SidebarNav/SidebarNav';
import BreadcrumbAndProfile from '../BreadcrumbAndProfile/BreadcrumbAndProfile';
import * as XLSX from 'xlsx';
import './incomes.css';
import 'chartjs-adapter-date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faArrowCircleLeft, faPlusCircle, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { fetchData } from '../utils/api';
import axios from "axios";
import Cookies from 'js-cookie';
import { useNavigate} from 'react-router-dom';
import Table from 'react-bootstrap/Table';

function Incomes() {

  const [Username1, setUsername] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentIncome, setCurrentIncome] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [incomesPerPage] = useState(5);
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [incomesData, setIncomesData] = useState([]);
  const categories = ['Salary', 'Freelance', 'Investment', 'Other'];
  
  
  
  //localStorage.setItem('incomes', JSON.stringify(totalAmount));
  useEffect(() => {
    const storedName = localStorage.getItem('username');
    if (storedName) {
      const parsedName = JSON.parse(storedName);
      setUsername(parsedName.firstName); 
    }
  }, [incomesData]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(incomesData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Incomes");
    XLSX.writeFile(wb, "Incomes.xlsx");
  };

  //new
  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await fetchData("http://localhost:8095/api/v1/income/my-incomes");
        setIncomesData(response);


      } catch (error) {
        console.error("Error fetching incomes:", error.response?.data || error.message);
      }
    };
    fetchIncomes(); 
  }, []);
   
  const totalAmount = incomesData.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      const isConfirmed = window.confirm("Are you sure you want to update this income?");
      if (!isConfirmed) {
        return;
      }
      const updatedIncome = {
        id: currentIncome.id,
        name,
        amount,
        date,
        description,
        category,
      };
      const token = Cookies.get('token');
      try {
        const response = await axios.put(
          `http://localhost:8095/api/v1/income/update/${currentIncome.id}`,
          updatedIncome,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Success:', response.data);
        setIncomesData(incomesData.map(income => 
          income.id === currentIncome.id ? { ...income, ...response.data } : income
        ));
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
      }
      resetForm();
     // setEditing(false);
    } else {
      
      
    if (!name || !amount || !date || !description || !category) {
      alert("All fields are required, including the category.");
      return;
    }
    const isConfirmed = window.confirm(editing ? "Are you sure you want to update this income?" : "Are you sure you want to add this income?");
    if (!isConfirmed) {
      return;
    }
    const incomeData = {
    //  id: editing ? currentIncome.id : Date.now(),
      name,
      amount,
      date,
      description,
     // status: isPaid ? "PAID" : "DUE",
      category,
    };
    const token = Cookies.get('token');
     
     const list = await axios.get(
          "http://localhost:8095/api/v1/income/my-incomes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
         
        );
        setIncomesData(list.data);

       try {
            const response = await axios.post(
              "http://localhost:8095/api/v1/income/create",
              incomeData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );    
            setIncomesData([...incomesData, response.data]);
            
          } catch (error) {
            console.error('Error while sending expense data:', error);
          }



    resetForm();
  };
}

  const resetForm = () => {
    setName('');
    setAmount('');
    setDate('');
    setDescription('');
    setIsPaid(false);
    setEditing(false);
    setCurrentIncome(null);
    setCategory('');
  };



  const indexOfLastIncome = currentPage * incomesPerPage;
  const indexOfFirstIncome = indexOfLastIncome - incomesPerPage;
 // const currentIncomes = filteredIncomes.slice(indexOfFirstIncome, indexOfLastIncome);

  // Change page function
  const handlePreviousPage = () => {
    setCurrentPage(prev => prev > 1 ? prev - 1 : prev);
  };

  const handleNextPage = () => {
  //  setCurrentPage(prev => prev * incomesPerPage < filteredIncomes.length ? prev + 1 : prev);
  };


  
  const handleRemove = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to remove this expense?");
    const token = Cookies.get('token');
     
    try {
      const response = await axios.delete(`http://localhost:8095/api/v1/income/DeleteIncome/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log('Success:', response.data);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
     
    if (isConfirmed) {
      setIncomesData(incomesData.filter(expense => expense.id !== id));
    }
  };

  

  const handleEdit = async (income) => {
    setCurrentIncome(income);
    setName(income.name);
    setAmount(income.amount);
    setDate(income.date);
    setDescription(income.description);
    setIsPaid(income.status === "PAID");
    setCategory(income.category);
    setEditing(true);

  }
  const chartOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Income (€)',
        },
      },
    },
  };

  
  return (
    <Container fluid>
      <Row>
        <Col md={2} className="sidebar">
          <SidebarNav />
        </Col>
        <Col md={10} className="main">
        <BreadcrumbAndProfile 
           username={Username1} 
          role="Freelancer React Developer" 
          pageTitle="Incomes"
          breadcrumbItems={[
          { name: 'Dashboard', path: '/dashboard', active: false },
          { name: 'Incomes', path: '/incomes', active: true }
          ]}
          />
          <InputGroup className="mb-3">
            <FormControl
               placeholder="Search by date, name, or category..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>


          <Row>

          {searchQuery.trim() !== '' && (
    <Table className="circular-corners"  striped bordered hover responsive isHovered >
      <thead>
        <tr >
          <th >Name</th>
          <th >Description</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        {incomesData
          .filter((item) => item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.amount.toString().includes(searchQuery) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.amount} €</td>
              <td>{item.date}</td>
              <td>{item.category}</td>
            </tr>
          ))}
      </tbody>
    </Table>
)}
          <Col md={6}>
  <motion.div
    initial={{ opacity: 0, y: 20 }} // Initial state: transparent and slightly below its final position
    animate={{ opacity: 1, y: 0 }} // Animate to: fully opaque and in its final position
    transition={{ duration: 0.5, delay: 0.2 }} // Customize the duration and add a delay if desired
  >
    <Card className="mt-3 total">
      <Card.Body>
        <Card.Title>Total Income</Card.Title>
        <Card.Text>
         {totalAmount} €
        </Card.Text>
      </Card.Body>
    </Card>
  </motion.div>
</Col>

    <Col md={6}>
    <div className="chart-container">
      
    </div>
  </Col>
</Row>

<Form onSubmit={handleSubmit}>
  <Row className="grid-row">
    <Col md={4}>
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Income Name" required />
      </Form.Group>
    </Col>
    <Col md={4}>
      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" required />
      </Form.Group>
    </Col>
    <Col md={4}>
      <Form.Group>
        <Form.Label>Amount</Form.Label>
        <Form.Control type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Income Amount in Euros" required />
      </Form.Group>
    </Col>
  </Row>
  <Row className="grid-row">
    <Col md={4}>
      <Form.Group>
        <Form.Label>Date</Form.Label>
        <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </Form.Group>
    </Col>
    <Col md={4}>
      <Form.Group>
        <Form.Label>Category</Form.Label>
        <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select a category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </Form.Select>
      </Form.Group>
    </Col>
    <Col md={4} className="d-flex align-items-center">
      <Form.Group>
        <Form.Check type="checkbox" label="Paid" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} />
      </Form.Group>
    </Col>
  </Row>
  <Button type="submit" className="mt-3 primary-button">{editing ? "Update Income" : "Add Income"}<FontAwesomeIcon icon={faPlusCircle} className="icon-right"/></Button>
</Form>


<ListGroup className="mt-3">
  {incomesData.map((IncomesData) => (
    <ListGroup.Item key={IncomesData.id} className="list-group-item">
      <div className="expense-details">
        {` ${IncomesData.id}-Name: ${IncomesData.name} - Amount: €${IncomesData.amount} - Date: ${IncomesData.date} - Type: ${IncomesData.description} - Category: ${IncomesData.category || 'Not specified'} - Status: ${IncomesData.status}`}
      </div>
      <div className="button-group">
        <Button className="edit" size="sm" onClick={() => handleEdit(IncomesData)} style={{backgroundColor:'#004883', color: 'white', marginRight: '5px' }}>
          <FontAwesomeIcon icon={faPenToSquare} className="icon-left"/>Edit
        </Button>
        <Button variant="danger" size="sm"  onClick={() => handleRemove(IncomesData.id)} style={{backgroundColor:'#ff4d4d', color: 'white'}}>
          <FontAwesomeIcon icon={faTrashCan} className="icon-left"/>Remove
        </Button>
      </div>
    </ListGroup.Item>
  ))}
</ListGroup>

        <Button onClick={exportToExcel} className="mt-3 excel-button">
          <FontAwesomeIcon icon={faFileExcel} className="icon-left" /> Export to Excel
      </Button>

                    {/* Pagination Controls */}
            <div className="d-flex justify-content-between mt-3">
            <Button onClick={handlePreviousPage} className="page" disabled={currentPage === 1}><FontAwesomeIcon icon={faArrowCircleLeft} /></Button>
           
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Incomes;
