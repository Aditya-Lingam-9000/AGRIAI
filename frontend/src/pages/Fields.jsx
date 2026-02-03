// src/pages/Fields.jsx
import { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input, { Select } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import './Fields.css';

const cropOptions = [
  { value: 'paddy', label: '🌾 Paddy (Rice)', icon: '🌾' },
  { value: 'cotton', label: '🌿 Cotton', icon: '🌿' },
  { value: 'maize', label: '🌽 Maize (Corn)', icon: '🌽' },
  { value: 'groundnut', label: '🥜 Groundnut', icon: '🥜' },
];

const waterOptions = [
  { value: 'low', label: 'Low - Limited irrigation' },
  { value: 'medium', label: 'Medium - Seasonal availability' },
  { value: 'high', label: 'High - Year-round irrigation' },
];

const investmentOptions = [
  { value: 'low', label: 'Low - Basic inputs only' },
  { value: 'medium', label: 'Medium - Standard farming' },
  { value: 'high', label: 'High - Premium inputs' },
];

export default function Fields({ user }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [field, setField] = useState({
    land_area_acres: '',
    crop_selection: 'paddy',
    water_availability: 'medium',
    investment_level: 'medium',
  });

  const handleSave = async () => {
    if (!field.land_area_acres || parseFloat(field.land_area_acres) <= 0) {
      toast.error('Please enter a valid land area');
      return;
    }

    setLoading(true);
    try {
      const token = user.accessToken;
      const res = await fetch('https://agriai-backend-w5l3.onrender.com/fields', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...field,
          land_area_acres: parseFloat(field.land_area_acres),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Field details saved! Go to Crop Plan to generate your plan.');
      } else {
        toast.error(data.detail || 'Failed to save field details');
      }
    } catch (err) {
      toast.error('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedCrop = cropOptions.find(c => c.value === field.crop_selection);

  return (
    <div className="fields-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-title-icon">🌾</span>
          Field Details
        </h1>
        <p className="page-subtitle">Configure your field information for personalized crop planning</p>
      </div>

      <div className="fields-grid">
        {/* Crop Selection */}
        <Card variant="default" padding="xl" className="crop-selection-card">
          <CardHeader>
            <CardTitle>🌱 Select Your Crop</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="crop-grid">
              {cropOptions.map((crop) => (
                <button
                  key={crop.value}
                  className={`crop-option ${field.crop_selection === crop.value ? 'crop-option-active' : ''}`}
                  onClick={() => setField({ ...field, crop_selection: crop.value })}
                >
                  <span className="crop-icon">{crop.icon}</span>
                  <span className="crop-name">{crop.label.split(' ')[1]}</span>
                  {field.crop_selection === crop.value && (
                    <span className="crop-check">✓</span>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Field Configuration */}
        <Card variant="default" padding="xl" className="config-card">
          <CardHeader>
            <CardTitle>⚙️ Field Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="config-form">
              <Input
                type="number"
                label="Land Area (Acres)"
                placeholder="e.g., 5"
                value={field.land_area_acres}
                onChange={(e) => setField({ ...field, land_area_acres: e.target.value })}
                icon="📐"
                required
              />

              <Select
                label="Water Availability"
                value={field.water_availability}
                onChange={(e) => setField({ ...field, water_availability: e.target.value })}
                options={waterOptions}
              />

              <Select
                label="Investment Level"
                value={field.investment_level}
                onChange={(e) => setField({ ...field, investment_level: e.target.value })}
                options={investmentOptions}
              />

              <div className="form-actions">
                <Button 
                  variant="primary" 
                  onClick={handleSave}
                  loading={loading}
                  fullWidth
                >
                  Save Field Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card variant="gradient" padding="xl" className="preview-card">
          <CardHeader>
            <CardTitle>📊 Field Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="preview-content">
              <div className="preview-crop">
                <span className="preview-crop-icon">{selectedCrop?.icon}</span>
                <span className="preview-crop-name">
                  {selectedCrop?.label.split(' ').slice(1).join(' ')}
                </span>
              </div>
              
              <div className="preview-stats">
                <div className="preview-stat">
                  <span className="preview-label">Land Area</span>
                  <span className="preview-value">
                    {field.land_area_acres || '0'} acres
                  </span>
                </div>
                <div className="preview-stat">
                  <span className="preview-label">Water</span>
                  <span className="preview-value">{field.water_availability}</span>
                </div>
                <div className="preview-stat">
                  <span className="preview-label">Investment</span>
                  <span className="preview-value">{field.investment_level}</span>
                </div>
              </div>

              <p className="preview-hint">
                💡 Save your field details, then visit the <strong>Crop Plan</strong> page to generate your personalized farming plan.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
