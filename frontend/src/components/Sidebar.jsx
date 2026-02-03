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
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (pageId) => {
    onNavigate(pageId);
    // Close sidebar on mobile after navigation
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay - only visible when sidebar is open */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🌱</span>
            <span className="logo-text">AgriAI</span>
          </div>
          <button 
            className="sidebar-close"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'nav-item-active' : ''}`}
              onClick={() => handleNavClick(item.id)}
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

      {/* Mobile Toggle Button - hamburger menu */}
      <button 
        className="mobile-toggle"
        onClick={() => setIsOpen(true)}
      >
        ☰
      </button>
    </>
  );
}
