// src/components/DashboradCompanent/DashedLineChart/DashedLineChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define blue colors
const primaryBlue = "#0052CC"; // Main blue
const secondaryBlue = "#5E9DFF"; // Lighter, distinct blue

function DashedLineChart({ chartData }) {

  if (!chartData || chartData.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>Loading chart data...</div>;
  }

  return (
    // This outer div is centered by align-items-center in Dashboard.js
    // Its internal flex ensures title is above chart
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h3 className="panel-title" style={{ textAlign: 'center', marginBottom: '15px', width: '100%', color: '#333' }}>
        Yearly Income & Expenses Overview
      </h3>
      {/* Responsive container keeps chart flexible but centered due to parent */}
      <ResponsiveContainer width="95%" height="85%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 12 }} axisLine={{ stroke: '#ccc' }} tickLine={{ stroke: '#ccc' }} />
          <YAxis tick={{ fill: '#666', fontSize: 12 }} axisLine={{ stroke: '#ccc' }} tickLine={{ stroke: '#ccc' }} tickFormatter={(value) => `$${value/1000}k`} /> {/* Example: Format Y-axis ticks */}
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '5px', border: '1px solid #ddd', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
            formatter={(value, name) => [`$${value.toFixed(2)}`, name]} // Format value and show name
            labelStyle={{ fontWeight: 'bold', color: '#333' }}
            itemStyle={{ color: '#555' }}
          />
          <Legend wrapperStyle={{ paddingTop: '15px' }} />

          {/* Income Line - Solid Primary Blue */}
          <Line
            type="monotone"
            dataKey="income"
            name="Income"
            stroke={primaryBlue}
            strokeWidth={2.5} // Slightly thicker
            dot={{ fill: primaryBlue, r: 3, strokeWidth: 1 }} // Smaller dots
            activeDot={{ r: 6, strokeWidth: 1, stroke: '#000' }}
          />

          {/* Expense Line - Dashed Secondary Blue */}
          <Line
            type="monotone"
            dataKey="expense"
            name="Expense"
            stroke={secondaryBlue}
            strokeWidth={2.5}
            strokeDasharray="6 4" // Different dash pattern
            dot={{ fill: secondaryBlue, r: 3, strokeWidth: 1 }}
            activeDot={{ r: 6, strokeWidth: 1, stroke: '#000' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DashedLineChart;