import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  
];

export default class Example extends PureComponent {
  static demoUrl = 'https://codesandbox.io/p/sandbox/dashed-line-chart-9rttw2';

  render() {
    return (
      <ResponsiveContainer width="90%" height="80%" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 className="panel-title">Income & Expenses</h2>
      <LineChart
        width={100}
        height={100}
        data={data}
        margin={{
          top: 10,
          right: 20,
          left: 10,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="name" tick={{ fill: '#333333' }} />
        <YAxis tick={{ fill: '#333333' }} />
        <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '4px' }} />
        <Legend wrapperStyle={{ paddingTop: '10px' }} />
        <Line 
          type="monotone" 
          dataKey="pv" 
          stroke="#3366cc" 
          strokeWidth={2}
          strokeDasharray="5 5" 
          dot={{ fill: '#3366cc', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="uv" 
          stroke="#00e0d6" 
          strokeWidth={2}
          strokeDasharray="3 4 5 2" 
          dot={{ fill: '#00e0d6', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
    );
  }
}