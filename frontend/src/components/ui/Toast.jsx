// src/components/ui/Toast.jsx
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import './Toast.css';

// Toast Context
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const toast = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    info: (message, duration) => addToast(message, 'info', duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          {...toast} 
          onClose={() => onRemove(toast.id)} 
        />
      ))}
    </div>
  );
}

function ToastItem({ id, message, type, duration, onClose }) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
    }, duration - 300);

    const removeTimer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [duration, onClose]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(onClose, 300);
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`toast toast-${type} ${isLeaving ? 'toast-leaving' : ''}`}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={handleClose}>
        ✕
      </button>
      <div className="toast-progress" style={{ animationDuration: `${duration}ms` }} />
    </div>
  );
}

// Simple standalone toast (for backward compatibility)
export default function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`toast toast-${type} ${!visible ? 'toast-leaving' : ''}`}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
    </div>
  );
}
