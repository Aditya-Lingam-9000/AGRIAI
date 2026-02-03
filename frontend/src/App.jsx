// src/App.jsx
import { useState, useEffect } from "react";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";
import { auth } from "./firebase";
import LandingPage from "./components/LandingPage";
import LoginScreen from "./components/LoginScreen";
import DashboardLayout from "./components/DashboardLayout";
import { PageLoader } from "./components/ui/Loader";
import "./design.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Handle redirect result (for mobile Google Sign-In)
    getRedirectResult(auth).catch(() => {
      // Ignore errors here; onAuthStateChanged will handle auth state
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) setShowLogin(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <PageLoader />;

  // Authenticated: show dashboard
  if (user) {
    return <DashboardLayout />;
  }

  // Not authenticated: show landing or login
  if (showLogin) {
    return <LoginScreen onBack={() => setShowLogin(false)} />;
  }

  return <LandingPage onGetStarted={() => setShowLogin(true)} />;
}