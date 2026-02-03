// src/components/LoginScreen.jsx
import { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../firebase";
import Button from "./ui/Button";
import Input from "./ui/Input";
import "./LoginScreen.css";

export default function LoginScreen({ onBack }) {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState({ google: false, otp: false, verify: false });
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const handleGoogleSignIn = async () => {
    console.log("LoginScreen: Google Sign-In started");
    setLoading({ ...loading, google: true });
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      // Use redirect for mobile, popup for desktop
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      console.log("LoginScreen: isMobile", isMobile);
      if (isMobile) {
        console.log("LoginScreen: Using redirect");
        await signInWithRedirect(auth, provider);
      } else {
        console.log("LoginScreen: Using popup");
        await signInWithPopup(auth, provider);
      }
    } catch (err) {
      console.log("LoginScreen: Error", err.message);
      setError(err.message);
    } finally {
      setLoading({ ...loading, google: false });
    }
  };

  const handleSendOtp = async () => {
    setLoading({ ...loading, otp: true });
    setError("");
    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
      const result = await signInWithPhoneNumber(auth, phone, recaptcha);
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({ ...loading, otp: false });
    }
  };

  const handleVerifyOtp = async () => {
    setLoading({ ...loading, verify: true });
    setError("");
    try {
      await confirmationResult.confirm(otp);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({ ...loading, verify: false });
    }
  };

  return (
    <div className="login-page">
      {/* Animated Background */}
      <div className="login-bg">
        <div className="login-gradient"></div>
        <div className="login-grid"></div>
        <div className="login-glow login-glow-1"></div>
        <div className="login-glow login-glow-2"></div>
      </div>

      <div className="login-container">
        {/* Back Button */}
        {onBack && (
          <button className="login-back" onClick={onBack}>
            ← Back
          </button>
        )}

        {/* Login Card */}
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="login-icon">
              <span className="icon-plant">🌱</span>
              <div className="icon-ring"></div>
              <div className="icon-ring"></div>
            </div>
            <h1 className="login-title">Welcome to AgriAI</h1>
            <p className="login-subtitle">
              Sign in to access your personalized farming assistant
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="login-error">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <Button 
            variant="secondary" 
            fullWidth 
            onClick={handleGoogleSignIn}
            loading={loading.google}
            disabled={loading.otp || loading.verify}
          >
            <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="login-divider">
            <span>or continue with phone</span>
          </div>

          {/* Phone OTP */}
          {!otpSent ? (
            <div className="login-form">
              <Input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                icon="📱"
              />
              <Button 
                variant="primary" 
                fullWidth 
                onClick={handleSendOtp}
                loading={loading.otp}
                disabled={!phone || loading.google}
              >
                Send OTP
              </Button>
            </div>
          ) : (
            <div className="login-form">
              <div className="otp-sent-message">
                <span className="otp-icon">✓</span>
                OTP sent to {phone}
              </div>
              <Input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                icon="🔐"
              />
              <Button 
                variant="primary" 
                fullWidth 
                onClick={handleVerifyOtp}
                loading={loading.verify}
                disabled={!otp}
              >
                Verify OTP
              </Button>
              <button 
                className="resend-button"
                onClick={() => setOtpSent(false)}
              >
                ← Change phone number
              </button>
            </div>
          )}

          <div id="recaptcha-container"></div>

          {/* Footer */}
          <p className="login-footer">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="login-decoration">
          <div className="deco-card deco-card-1">
            <span>🌾</span>
            <span>Paddy Planning</span>
          </div>
          <div className="deco-card deco-card-2">
            <span>📊</span>
            <span>Yield Analysis</span>
          </div>
          <div className="deco-card deco-card-3">
            <span>💧</span>
            <span>Water Schedule</span>
          </div>
        </div>
      </div>
    </div>
  );
}