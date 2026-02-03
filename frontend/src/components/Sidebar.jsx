// src/components/Sidebar.jsx
import { useState } from 'react';
import './Sidebar.css';

const menuItems = [
  { id: 'overview', icon: '🏠', label: 'Overview' },
  { id: 'profile', icon: '👤', label: 'Profile' },
  { id: 'fields', icon: '🌾', label: 'Fields' },
  { id: 'plan', icon: '📋', label: 'Crop Plan' },
  { id: 'assistant', icon: '🤖', label: 'AI Assistant' },
];

export default function Sidebar({ activePage, onNavigate, user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${!collapsed ? 'sidebar-overlay-hidden' : ''}`}
        onClick={() => setCollapsed(false)}
      />

      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🌱</span>
            <span className="logo-text">AgriAI</span>
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'nav-item-active' : ''}`}
              onClick={() => onNavigate(item.id)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {activePage === item.id && <span className="nav-indicator" />}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} />
              ) : (
                <span>{user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}</span>
              )}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.displayName || 'User'}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
          <button className="logout-button" onClick={onLogout} title="Logout">
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Toggle */}
      <button 
        className="mobile-toggle"
        onClick={() => setCollapsed(!collapsed)}
      >
        ☰
      </button>
    </>
  );
}
