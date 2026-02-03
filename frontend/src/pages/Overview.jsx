// src/pages/Overview.jsx
import { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import './Overview.css';

export default function Overview({ user }) {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const quickStats = [
    { icon: '🌾', label: 'Active Crops', value: '4', color: '#10b981' },
    { icon: '📊', label: 'Total Fields', value: '1', color: '#06b6d4' },
    { icon: '💧', label: 'Water Status', value: 'Good', color: '#8b5cf6' },
    { icon: '📅', label: 'Next Task', value: 'Fertilizer', color: '#f59e0b' },
  ];

  const recentActivities = [
    { icon: '🌱', text: 'Created crop plan for Paddy', time: 'Just now' },
    { icon: '📝', text: 'Updated field details', time: '2 hours ago' },
    { icon: '💬', text: 'Asked AI about fertilizers', time: 'Yesterday' },
  ];

  const tips = [
    { icon: '💡', title: 'Optimal Planting', text: 'Best time to plant paddy is during monsoon season.' },
    { icon: '🌡️', title: 'Weather Alert', text: 'Check weather forecast before applying fertilizers.' },
    { icon: '💧', title: 'Water Tip', text: 'Paddy requires consistent water levels during growth.' },
  ];

  return (
    <div className="overview-page">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <div className="welcome-text">
            <span className="welcome-greeting">{greeting},</span>
            <h1 className="welcome-name">{user?.displayName || 'Farmer'}! 👋</h1>
            <p className="welcome-subtitle">Here's what's happening with your farm today</p>
          </div>
          <div className="welcome-illustration">
            <div className="illustration-circle">
              <span>🌾</span>
            </div>
          </div>
        </div>
        <div className="welcome-bg"></div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        {quickStats.map((stat, index) => (
          <div 
            key={index} 
            className="stat-card"
            style={{ '--stat-color': stat.color, animationDelay: `${index * 100}ms` }}
          >
            <div className="stat-icon" style={{ background: `${stat.color}20` }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="overview-grid">
        {/* Recent Activity */}
        <Card variant="default" padding="lg" className="activity-card">
          <CardHeader>
            <CardTitle>📋 Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="activity-list">
              {recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <span className="activity-icon">{activity.icon}</span>
                  <div className="activity-content">
                    <span className="activity-text">{activity.text}</span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card variant="default" padding="lg" className="actions-card">
          <CardHeader>
            <CardTitle>⚡ Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="action-buttons">
              <button className="action-btn">
                <span className="action-icon">📋</span>
                <span>Generate Plan</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">🌾</span>
                <span>Add Field</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">🤖</span>
                <span>Ask AI</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">📊</span>
                <span>View Report</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Farming Tips */}
        <Card variant="default" padding="lg" className="tips-card">
          <CardHeader>
            <CardTitle>🌟 Farming Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="tips-list">
              {tips.map((tip, index) => (
                <div key={index} className="tip-item">
                  <span className="tip-icon">{tip.icon}</span>
                  <div className="tip-content">
                    <span className="tip-title">{tip.title}</span>
                    <span className="tip-text">{tip.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
