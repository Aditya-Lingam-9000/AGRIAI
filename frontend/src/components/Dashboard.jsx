// src/components/Dashboard.jsx
import { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import LoadingSpinner from "./LoadingSpinner";
import Toast from "./Toast";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [field, setField] = useState({
    land_area_acres: "",
    crop_selection: "paddy",
    water_availability: "medium",
    investment_level: "low",
  });
  const [message, setMessage] = useState("");
  const [plan, setPlan] = useState(null);
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatAnswer, setChatAnswer] = useState("");
  const [loading, setLoading] = useState({ profile: false, field: false, plan: false, chat: false });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    const token = user.accessToken;
    fetch("http://127.0.0.1:8000/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.profile_id) setProfile(data);
      })
      .catch(() => {});
  }, [user]);

  const handleSaveProfile = async () => {
    setLoading({ ...loading, profile: true });
    const token = user.accessToken;
    try {
      const res = await fetch("http://127.0.0.1:8000/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile?.name || "",
          location: profile?.location || "",
          preferred_language: profile?.preferred_language || "English",
        }),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch {
      setMessage("Failed to save profile");
    } finally {
      setLoading({ ...loading, profile: false });
    }
  };

  const handleSaveField = async () => {
    setLoading({ ...loading, field: true });
    const token = user.accessToken;
    try {
      const res = await fetch("http://127.0.0.1:8000/fields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(field),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch {
      setMessage("Failed to save field");
    } finally {
      setLoading({ ...loading, field: false });
    }
  };

  const handleLoadPlan = async () => {
    setLoading({ ...loading, plan: true });
    const token = user.accessToken;
    try {
      const res = await fetch("http://127.0.0.1:8000/plan", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPlan(data);
        setMessage("Plan loaded");
      } else {
        setMessage(data.detail || "Failed to load plan");
      }
    } catch {
      setMessage("Failed to load plan");
    } finally {
      setLoading({ ...loading, plan: false });
    }
  };

  const handleChat = async () => {
    setLoading({ ...loading, chat: true });
    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: chatQuestion }),
      });
      const data = await res.json();
      setChatAnswer(data.answer);
    } catch {
      setChatAnswer("Failed to get answer");
    } finally {
      setLoading({ ...loading, chat: false });
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!user) return <LoadingSpinner />;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Welcome, {user?.displayName || user?.email}</h2>
        <button onClick={handleLogout} className="btn btn-outline">Logout</button>
      </header>

      {message && <Toast message={message} type="success" />}

      <section className="card">
        <h3>Profile</h3>
        <input placeholder="Name" value={profile?.name || ""} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="input" />
        <input placeholder="Location" value={profile?.location || ""} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="input" />
        <select value={profile?.preferred_language || "English"} onChange={(e) => setProfile({ ...profile, preferred_language: e.target.value })} className="input">
          <option>English</option>
          <option>Hindi</option>
          <option>Telugu</option>
        </select>
        <button onClick={handleSaveProfile} disabled={loading.profile} className="btn btn-primary">
          {loading.profile ? <LoadingSpinner small /> : "Save Profile"}
        </button>
      </section>

      <section className="card">
        <h3>Field Details</h3>
        <input type="number" placeholder="Land area (acres)" value={field.land_area_acres} onChange={(e) => setField({ ...field, land_area_acres: e.target.value })} className="input" />
        <select value={field.crop_selection} onChange={(e) => setField({ ...field, crop_selection: e.target.value })} className="input">
          <option value="paddy">Paddy</option>
          <option value="cotton">Cotton</option>
          <option value="maize">Maize</option>
          <option value="groundnut">Groundnut</option>
        </select>
        <select value={field.water_availability} onChange={(e) => setField({ ...field, water_availability: e.target.value })} className="input">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select value={field.investment_level} onChange={(e) => setField({ ...field, investment_level: e.target.value })} className="input">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={handleSaveField} disabled={loading.field} className="btn btn-primary">
          {loading.field ? <LoadingSpinner small /> : "Save Field"}
        </button>
      </section>

      <section className="card">
        <h3>Crop Plan</h3>
        <button onClick={handleLoadPlan} disabled={loading.plan} className="btn btn-secondary">
          {loading.plan ? <LoadingSpinner small /> : "Load Plan"}
        </button>
        {plan && (
          <div className="plan-result">
            <p><strong>Crop:</strong> {plan.crop}</p>
            <p><strong>Land Area:</strong> {plan.land_area_acres} acres</p>
            <p><strong>Duration:</strong> {plan.duration_days} days</p>
            <p><strong>Estimated Cost:</strong> {plan.estimated_total_cost}</p>
            <p><strong>Expected Yield:</strong> {plan.expected_total_yield_tons} tons</p>
            <div>
              <strong>Fertilizer Schedule:</strong>
              <ul>
                {plan.fertilizer_schedule.map((item, i) => (
                  <li key={i}>
                    Week {item.week}: {item.fertilizer} — {item.total_quantity_kg} kg
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      <section className="card">
        <h3>Ask a Question</h3>
        <input placeholder="e.g., Which fertilizer is used?" value={chatQuestion} onChange={(e) => setChatQuestion(e.target.value)} className="input" />
        <button onClick={handleChat} disabled={loading.chat} className="btn btn-secondary">
          {loading.chat ? <LoadingSpinner small /> : "Ask"}
        </button>
        {chatAnswer && (
          <div className="chat-answer">
            <strong>Answer:</strong> {chatAnswer}
          </div>
        )}
      </section>
    </div>
  );
}