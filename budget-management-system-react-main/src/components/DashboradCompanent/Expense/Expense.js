
import { Card } from 'react-bootstrap';
import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Utility',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Rent',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Groceries',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Entertainment',
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
  static demoUrl = 'https://codesandbox.io/p/sandbox/bar-chart-has-no-padding-2hlnt8';

  render() {
    return (
           
      <ResponsiveContainer width="90%" height={250}>
        <h2 className="panel-title">Expenses Sources</h2>
     <BarChart
      data={data}
     margin={{
      top: 5,
      right: 20,
      left: 10,
      bottom: 20,
    }}
    barSize={15}
    >
    <XAxis dataKey="name" scale="point" padding={{ left: 5, right: 5 }} />
    <YAxis />
    <Tooltip />
    <Legend />
    <CartesianGrid strokeDasharray="3 3" />
    <Bar dataKey="pv" fill="#000066" background={{ fill: '#eee' }} />
     </BarChart>
    </ResponsiveContainer>
    );
  }
}
