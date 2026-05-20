import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { api } from '../api/client';

const StatCard = ({ title, value, unit }) => (
  <div className="stat-card">
    <p>{title}</p>
    <h3>{value}</h3>
    {unit && <span>{unit}</span>}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await api.get('/api/stats');
        const mapped = [
          { title: 'Total Retailers', value: data.totalRetailers },
          { title: 'Total Salesperson', value: data.totalSales },
          { title: 'Total Warehouse Managers', value: data.totalWarehouse },
          { title: 'Total Categories', value: data.totalCategories },
          { title: 'Total Brands', value: data.totalBrands },
          { title: 'Total Products', value: data.totalProducts },
          { title: 'Total Orders Completed', value: data.totalOrdersCompleted },
          { title: 'Total Revenue', value: data.totalRevenue, unit: 'Rs' },
        ];
        if (mounted) setStats(mapped);
      } catch (err) {
        // fallback to empty static values
        if (mounted) setStats([]);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

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