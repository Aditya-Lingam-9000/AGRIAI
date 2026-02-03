// src/components/ui/Input.jsx
import './Input.css';

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className={`input-wrapper ${error ? 'input-error' : ''} ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          className={`input ${icon ? 'input-with-icon' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          {...props}
        />
        <span className="input-focus-border"></span>
      </div>
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
}

export function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className={`input-wrapper ${error ? 'input-error' : ''} ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-container">
        <select
          className="input select"
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="select-arrow">▾</span>
        <span className="input-focus-border"></span>
      </div>
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
}

export function Textarea({
  label,
  placeholder,
  value,
  onChange,
  error,
  rows = 4,
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className={`input-wrapper ${error ? 'input-error' : ''} ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-container">
        <textarea
          className="input textarea"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows}
          disabled={disabled}
          required={required}
          {...props}
        />
        <span className="input-focus-border"></span>
      </div>
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
}
