// src/components/Toast.jsx
import { useEffect } from "react";

export default function Toast({ message, type = "info", duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Optionally: add dismiss logic here
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return <div className={`toast toast-${type}`}>{message}</div>;
}