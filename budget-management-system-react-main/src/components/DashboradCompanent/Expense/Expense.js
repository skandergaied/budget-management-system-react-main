// src/components/DashboradCompanent/Expense/Expense.js
import React, { useMemo } from 'react'; // Make sure React and useMemo are imported
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const defaultExpenseData = [
  { name: 'No Data', pv: 0 }, // Placeholder if no data
];

function ExpenseCard({ allExpenses, targetMonth, targetYear }) {

  const chartData = useMemo(() => {
    if (!allExpenses || allExpenses.length === 0) {
      return defaultExpenseData;
    }

    const aggregatedExpensesForChart = {};

    allExpenses.forEach(expense => {
      if (!expense.date || typeof expense.amount === 'undefined' || expense.amount === null || !expense.category) return;
      
      const expenseDate = new Date(expense.date);
      const amount = parseFloat(expense.amount);
      if (isNaN(amount)) return;

      // Filter for the targetMonth (0-indexed) and targetYear
      if (expenseDate.getFullYear() === targetYear && expenseDate.getMonth() === targetMonth) {
        const category = expense.category;
        aggregatedExpensesForChart[category] = (aggregatedExpensesForChart[category] || 0) + amount;
      }
    });

    if (Object.keys(aggregatedExpensesForChart).length === 0) {
        return defaultExpenseData;
    }

    return Object.entries(aggregatedExpensesForChart)
      .map(([catName, catAmount]) => ({
        name: catName,
        pv: parseFloat(catAmount.toFixed(2)), // 'pv' for the Bar dataKey
      }))
      .sort((a, b) => b.pv - a.pv); // Sort by amount descending
      
  }, [allExpenses, targetMonth, targetYear]);

  const hasActualData = chartData !== defaultExpenseData && chartData.length > 0 && chartData[0].name !== 'No Data';

  return (
    <>
      <h2 className="panel-title" style={{ textAlign: 'center', marginBottom: '1rem' }}>
        Expenses by Category ({new Date(targetYear, targetMonth).toLocaleString('default', { month: 'long', year: 'numeric' })})
      </h2>
      {hasActualData ? (
        <ResponsiveContainer width="95%" height={280}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 25,
              left: 10,
              bottom: 70, 
            }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name"
              scale="point" 
              padding={{ left: 15, right: 15 }} 
              interval={0}
              angle={-40}
              textAnchor="end"
              height={80}
              tick={{ fontSize: '0.8rem' }}
            />
            <YAxis tickFormatter={(value) => `${value}€`} />
            <Tooltip formatter={(value) => `${parseFloat(value || 0).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`} />
            <Legend wrapperStyle={{ paddingTop: '25px' }} />
            <Bar dataKey="pv" fill="rgb(20, 9, 172)" background={{ fill: '#eee' }} name="Amount" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p style={{ textAlign: 'center', marginTop: '50px', color: '#6c757d' }}>
          No expense data available for {new Date(targetYear, targetMonth).toLocaleString('default', { month: 'long' })} {targetYear} to display.
        </p>
      )}
    </>
  );
}

export default ExpenseCard;