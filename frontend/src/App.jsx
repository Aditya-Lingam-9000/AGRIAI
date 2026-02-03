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
    const handleAuth = async () => {
      console.log("App: handleAuth started");
      try {
        // Check if we're returning from a redirect (mobile)
        const result = await getRedirectResult(auth);
        console.log("App: redirect result", result?.user?.email || "no user");
        if (result?.user) {
          setUser(result.user);
          setShowLogin(false);
        }
      } catch (error) {
        // Ignore redirect errors; let onAuthStateChanged handle normal flow
        console.log("App: Redirect error:", error.message);
      }

      // Set up auth state listener
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log("App: onAuthStateChanged", user?.email || "no user");
        setUser(user);
        setLoading(false);
        if (user) setShowLogin(false);
      });
      return unsubscribe;
    };

    handleAuth();
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