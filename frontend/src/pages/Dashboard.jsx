import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/stats/StatsCard';
import { statsApi, franchiseApi } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalFranchises: 0,
    totalBranches: 0,
    totalProducts: 0,
    recentFranchises: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await statsApi.getDashboard();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Dashboard</h2>
        <p className="dashboard-subtitle">Welcome to your franchise management system</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          }
          title="Total Franchises"
          value={stats.totalFranchises}
          color="blue"
          onClick={() => navigate('/franchises')}
        />

        <StatsCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          }
          title="Total Branches"
          value={stats.totalBranches}
          color="green"
        />

        <StatsCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          }
          title="Total Products"
          value={stats.totalProducts}
          color="purple"
        />
      </div>

      {/* Recent Franchises Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h3 className="section-title">Recent Franchises</h3>
            <p className="section-subtitle">Latest franchises added to the system</p>
          </div>
        </div>

        <div className="franchises-list">
          {stats.recentFranchises.length > 0 ? (
            stats.recentFranchises.map((franchise) => (
              <div key={franchise.id} className="franchise-item">
                <div className="franchise-info">
                  <h4 className="franchise-name">{franchise.name}</h4>
                  <p className="franchise-meta">ID: {franchise.id}</p>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigate(`/franchises/${franchise.id}/branches`)}
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No franchises yet. Create your first franchise to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h3 className="section-title">Quick Actions</h3>
        <div className="quick-actions">
          <button
            className="quick-action-card"
            onClick={() => navigate('/franchises')}
          >
            <span className="quick-action-label">Manage Franchises</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;