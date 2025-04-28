import React from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faLaptop, faChartLine } from '@fortawesome/free-solid-svg-icons';

function Income({ Salary, Freelancer, Investment }) {
  const items = [
    { label: 'Salary', value: Salary, icon: faBriefcase },
    { label: 'Freelancer', value: Freelancer, icon: faLaptop },
    { label: 'Investment', value: Investment, icon: faChartLine },
  ];

  return (
    <Card
      style={{
        width: '20rem',
        backgroundColor: '#000f4d',
        borderRadius: '1rem',
        padding: '1.5rem',
        color: 'white',
      }}
    >
      <h5 className="text-center mb-3" style={{ color: '#00e0d6', fontWeight: 'bold',marginTop: '0', paddingTop: '0.5rem'  }} >
        Incomes Source
      </h5>
      {items.map((item, index) => (
        <div
          key={index}
          className="d-flex align-items-center justify-content-between mb-3 p-2"
          style={{
            backgroundColor: '#000f4d', // same dark blue
            border: '1px solid #00e0d6', // teal border to separate items
            borderRadius: '0.75rem',
          }}
        >
          <div className="d-flex align-items-center">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: '45px',
                height: '45px',
                backgroundColor: '#00e0d6',
                marginRight: '1rem',
              }}
            >
              <FontAwesomeIcon icon={item.icon} style={{ color: '#000f4d' }} />
            </div>
            <span style={{ fontSize: '1rem', fontWeight: '500', color: '#ffffff' }}>
              {item.label}
            </span>
          </div>
          <span style={{ fontSize: '1rem', fontWeight: '600', color: '#ffffff' }}>
            {item.value}
          </span>
        </div>
      ))}
    </Card>
  );
}

export default Income;
