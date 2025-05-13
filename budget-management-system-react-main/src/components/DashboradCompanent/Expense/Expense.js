import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from 'react-bootstrap';
import { fetchData } from '../../utils/api'; // API fonksiyonun burada olsun

const ExpenseCard = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const data = await fetchData("http://localhost:8095/api/v1/expense/all");

        // Giderleri kategorilere göre grupla
        const grouped = data.reduce((acc, curr) => {
          const category = curr.category || "Other";
          acc[category] = (acc[category] || 0) + parseFloat(curr.amount);
          return acc;
        }, {});

        // Recharts formatına çevir
        const formatted = Object.entries(grouped).map(([name, value]) => ({
          name,
          pv: value,
        }));

        setChartData(formatted);
      } catch (error) {
        console.error("Expense data fetch error:", error);
      }
    };

    fetchExpenseData();
  }, []);

  return (
      <Card style={{ padding: '20px', borderRadius: '12px' }}>
        <h2 className="panel-title">Expenses Sources</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 10, bottom: 20 }}
              barSize={20}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="pv" fill="#000066" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
  );
};

export default ExpenseCard;
