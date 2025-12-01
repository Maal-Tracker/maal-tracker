// src/components/Analysis.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#00C49F', '#FF8042']; 

export default function Analysis({ transactions = [] }) {
  const totalIncome = transactions
    .filter(t => t.transaction_type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.transaction_type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalBalance = totalIncome - totalExpense;

  const data = [];
  if (totalIncome > 0) data.push({ name: 'Income', value: totalIncome });
  if (totalExpense > 0) data.push({ name: 'Expense', value: totalExpense });

  if (data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h3 style={{ color: '#555' }}>Financial Analysis</h3>
        <p>No financial data to analyze yet.</p>
        <p style={{ fontWeight: 'bold' }}>Current Balance: $0.00</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', padding: '10px' }}>
      <div style={{ backgroundColor: '#343a40', color: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '15px', borderBottom: '1px solid #6c757d', paddingBottom: '10px' }}>Summary</h3>
        <p style={{ fontSize: '1.2em', margin: '10px 0' }}>Total Income: <span style={{ color: '#00C49F', fontWeight: 'bold' }}>${totalIncome.toFixed(2)}</span></p>
        <p style={{ fontSize: '1.2em', margin: '10px 0' }}>Total Expense: <span style={{ color: '#FF8042', fontWeight: 'bold' }}>${totalExpense.toFixed(2)}</span></p>
        <hr style={{ margin: '15px 0', borderTop: '1px solid #6c757d' }} />
        <p style={{ fontSize: '1.5em', fontWeight: 'bold', margin: '15px 0', color: totalBalance >= 0 ? '#00C49F' : '#dc3545' }}>Net Balance: ${totalBalance.toFixed(2)}</p>
      </div>

      <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', height: '350px' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Income vs Expense</h3>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}