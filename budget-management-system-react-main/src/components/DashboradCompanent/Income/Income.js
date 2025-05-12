// Income.js
import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';




const Income = ({ incomeSources }) => {
    // Group income by category
    const groupedIncomes = incomeSources.reduce((acc, item) => {
        const category = item.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
    }, {});

    return (
        <Card className="income-card">
            <Card.Header>Incomes Source</Card.Header>
            <ListGroup variant="flush">
                {Object.keys(groupedIncomes).map((category) => (
                    <ListGroup.Item key={category}>
                        <strong>{category}</strong>: $
                        {groupedIncomes[category]
                            .reduce((sum, item) => sum + parseFloat(item.amount), 0)
                            .toFixed(2)}
                        <ul>
                            {groupedIncomes[category].map((item, index) => (
                                <li key={index}>{item.name}: ${item.amount}</li>
                            ))}
                        </ul>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Card>
    );
};

export default Income;