// src/components/ui/Button.jsx
import "./Button.css";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) {
  const classes = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && "btn-full",
    loading && "btn-loading",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner">
          <span className="spinner-dot"></span>
          <span className="spinner-dot"></span>
          <span className="spinner-dot"></span>
        </span>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="btn-icon">{icon}</span>
          )}
          <span className="btn-text">{children}</span>
          {icon && iconPosition === "right" && (
            <span className="btn-icon">{icon}</span>
          )}
        </>
      )}
      <span className="btn-ripple"></span>
    </button>
  );
}
