// src/components/LoadingSpinner.jsx
export default function LoadingSpinner({ small = false }) {
  return (
    <div className={`loading-spinner ${small ? "small" : ""}`}>
      <div className="spinner"></div>
    </div>
  );
}