// src/components/ui/Loader.jsx
import './Loader.css';

export default function Loader({ 
  size = 'md',
  variant = 'spinner',
  text,
  fullScreen = false,
  className = '' 
}) {
  const classes = [
    'loader',
    `loader-${size}`,
    fullScreen && 'loader-fullscreen',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {variant === 'spinner' && (
        <div className="loader-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
      )}
      
      {variant === 'dots' && (
        <div className="loader-dots">
          <span className="loader-dot"></span>
          <span className="loader-dot"></span>
          <span className="loader-dot"></span>
        </div>
      )}
      
      {variant === 'pulse' && (
        <div className="loader-pulse">
          <div className="pulse-circle"></div>
          <div className="pulse-circle"></div>
          <div className="pulse-circle"></div>
        </div>
      )}
      
      {variant === 'orbital' && (
        <div className="loader-orbital">
          <div className="orbital-center">
            <span className="orbital-icon">🌱</span>
          </div>
          <div className="orbital-ring">
            <span className="orbital-dot"></span>
            <span className="orbital-dot"></span>
            <span className="orbital-dot"></span>
          </div>
        </div>
      )}
      
      {variant === 'agri' && (
        <div className="loader-agri">
          <div className="agri-plant">
            <div className="agri-stem"></div>
            <div className="agri-leaf agri-leaf-1"></div>
            <div className="agri-leaf agri-leaf-2"></div>
            <div className="agri-leaf agri-leaf-3"></div>
          </div>
          <div className="agri-ground"></div>
        </div>
      )}
      
      {text && <span className="loader-text">{text}</span>}
    </div>
  );
}

// Page loader for route transitions
export function PageLoader() {
  return (
    <div className="page-loader">
      <Loader variant="orbital" size="lg" />
      <p className="page-loader-text">Loading...</p>
    </div>
  );
}

// Inline loader for buttons/small areas
export function InlineLoader({ size = 'sm' }) {
  return (
    <span className="inline-loader">
      <span className="inline-dot"></span>
      <span className="inline-dot"></span>
      <span className="inline-dot"></span>
    </span>
  );
}
