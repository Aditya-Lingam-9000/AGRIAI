// src/pages/CropPlan.jsx
import { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { useToast } from '../components/ui/Toast';
import './CropPlan.css';

export default function CropPlan({ user }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  const handleLoadPlan = async () => {
    setLoading(true);
    try {
      const token = user.accessToken;
      const res = await fetch('http://127.0.0.1:8000/plan', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPlan(data);
        toast.success('Crop plan loaded successfully!');
      } else {
        toast.error(data.detail || 'Failed to load plan');
      }
    } catch (err) {
      toast.error('Failed to load plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cropIcons = {
    paddy: '🌾',
    cotton: '🌿',
    maize: '🌽',
    groundnut: '🥜',
  };

  return (
    <div className="plan-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-title-icon">📋</span>
          Crop Plan
        </h1>
        <p className="page-subtitle">Generate and view your personalized farming plan</p>
      </div>

      {/* Generate Button */}
      {!plan && (
        <Card variant="gradient" padding="xl" className="generate-card">
          <div className="generate-content">
            <div className="generate-icon">📋</div>
            <h2 className="generate-title">Generate Your Crop Plan</h2>
            <p className="generate-description">
              Based on your field details, we'll create a complete farming plan 
              with fertilizer schedules, cost estimates, and yield predictions.
            </p>
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleLoadPlan}
              loading={loading}
            >
              Generate Plan
            </Button>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="plan-loading">
          <Loader variant="orbital" size="lg" />
          <p>Generating your personalized plan...</p>
        </div>
      )}

      {/* Plan Results */}
      {plan && !loading && (
        <div className="plan-results">
          {/* Plan Summary */}
          <Card variant="default" padding="xl" className="summary-card">
            <div className="plan-summary">
              <div className="summary-crop">
                <span className="summary-icon">{cropIcons[plan.crop] || '🌱'}</span>
                <div className="summary-info">
                  <h2 className="summary-title">{plan.crop}</h2>
                  <p className="summary-subtitle">{plan.land_area_acres} acres</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLoadPlan}>
                Refresh
              </Button>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="plan-stats">
            <div className="plan-stat plan-stat-duration">
              <span className="stat-emoji">📅</span>
              <span className="stat-number">{plan.duration_days}</span>
              <span className="stat-label">Days Duration</span>
            </div>
            <div className="plan-stat plan-stat-cost">
              <span className="stat-emoji">💰</span>
              <span className="stat-number">₹{plan.estimated_total_cost?.toLocaleString()}</span>
              <span className="stat-label">Estimated Cost</span>
            </div>
            <div className="plan-stat plan-stat-yield">
              <span className="stat-emoji">📊</span>
              <span className="stat-number">{plan.expected_total_yield_tons}</span>
              <span className="stat-label">Tons Yield</span>
            </div>
          </div>

          {/* Fertilizer Schedule */}
          <Card variant="default" padding="xl" className="schedule-card">
            <CardHeader>
              <CardTitle>🧪 Fertilizer Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="schedule-timeline">
                {plan.fertilizer_schedule?.map((item, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-dot">
                      <span>{index + 1}</span>
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <span className="timeline-week">Week {item.week}</span>
                        <span className="timeline-fertilizer">{item.fertilizer}</span>
                      </div>
                      <div className="timeline-details">
                        <span className="timeline-quantity">
                          {item.total_quantity_kg} kg total
                        </span>
                        <span className="timeline-per-acre">
                          ({item.quantity_per_acre_kg} kg/acre)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card variant="default" padding="lg" className="tips-card">
            <div className="tip-content">
              <span className="tip-icon">💡</span>
              <p className="tip-text">
                <strong>Pro Tip:</strong> Apply fertilizers in the early morning or late evening 
                for best absorption. Avoid application during heavy rain.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
