// SidebarNav.js
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faHome, faWallet, faDollarSign ,faNewspaper } from '@fortawesome/free-solid-svg-icons';
import './SidebarNav.css';

function SidebarNav() {
  return (
    <Nav className="flex-column fixed">
      <Link to="/dashboard">
      <img src={`${process.env.PUBLIC_URL}/images/Logo/logo.png`} alt="Logo" className="logo-img" />
      </Link>
      <Nav.Link as={Link} to="/dashboard"><FontAwesomeIcon icon={faHome} className="nav-icon"/> Dashboard</Nav.Link>
      <Nav.Link as={Link} to="/incomes"><FontAwesomeIcon icon={faDollarSign} className="nav-icon" /> Incomes</Nav.Link>
      <Nav.Link as={Link} to="/expenses"><FontAwesomeIcon icon={faWallet} className="nav-icon" /> Expenses</Nav.Link>
      <Nav.Link as={Link} to="/news"><FontAwesomeIcon icon={faNewspaper} className="nav-icon" /> News</Nav.Link>
      {/* Exit Link */}
      <Nav.Link as={Link} to="/signout" className="exit-link"  onClick={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('expensesAmount');
        localStorage.removeItem('incomes');
        localStorage.removeItem('totalIncomes');
        localStorage.removeItem('totalExpenses');
        localStorage.removeItem('total');
        window.location.href = '/signout';
      }
      }>
       Sign Out
      </Nav.Link>
      <a href="https://github.com/igordinuzzi" className="github-link" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faGithub} /> made by Iskander
    </a>
    </Nav>
  );
}

export default SidebarNav;
