import React from 'react';
import './Dashboard.css';

const StatCard = ({ title, value, unit }) => (
  <div className="stat-card">
    <p>{title}</p>
    <h3>{value}</h3>
    {unit && <span>{unit}</span>}
  </div>
);

const Dashboard = () => {
  const stats = [
    { title: 'Total Retailers', value: '204' },
    { title: 'Total Salesperson', value: '56' },
    { title: 'Total Warehouse Managers', value: '99' },
    { title: 'Total Categories', value: '123' },
    { title: 'Total Brands', value: '835' },
    { title: 'Total Products', value: '908' },
    { title: 'Total Orders Completed', value: '835' },
    { title: 'Total Revenue', value: '835K', unit: 'Rs' },
  ];

  return (
    <div className="dashboard">
        <div className="dashboard-header">
            <h1>Dashboard</h1>
            
        </div>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatCard key={index} title={stat.title} value={stat.value} unit={stat.unit} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;