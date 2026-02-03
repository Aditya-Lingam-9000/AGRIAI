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
    let unsubscribe;

    // Handle redirect result first (for mobile browsers)
    const checkRedirect = async () => {
      try {
        console.log("App: Checking redirect result...");
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log("App: Redirect user found:", result.user.email);
          setUser(result.user);
          setShowLogin(false);
          setLoading(false);
        }
      } catch (error) {
        console.log("App: Redirect check error:", error.message);
      }
    };

    checkRedirect();

    // Set up auth state listener
    unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("App: Auth state changed:", currentUser?.email || "no user");
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        setShowLogin(false);
      }
    });

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Show loader while checking auth
  if (loading) {
    return <PageLoader />;
  }

  // Authenticated: show dashboard
  if (user) {
    console.log("App: Rendering Dashboard for user:", user.email);
    return <DashboardLayout />;
  }

  // Not authenticated: show landing or login
  if (showLogin) {
    return <LoginScreen onBack={() => setShowLogin(false)} />;
  }

  return <LandingPage onGetStarted={() => setShowLogin(true)} />;
}