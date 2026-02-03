// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input, { Select } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import './Profile.css';

export default function Profile({ user }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    location: '',
    preferred_language: 'English',
  });

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.displayName || '',
      }));
    }
  }, [user]);

  const handleSave = async () => {
    if (!profile.name || !profile.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = user.accessToken;
      const res = await fetch('http://127.0.0.1:8000/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Profile saved successfully!');
      } else {
        toast.error(data.detail || 'Failed to save profile');
      }
    } catch (err) {
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const languageOptions = [
    { value: 'English', label: 'English' },
    { value: 'Hindi', label: 'हिंदी (Hindi)' },
    { value: 'Telugu', label: 'తెలుగు (Telugu)' },
    { value: 'Tamil', label: 'தமிழ் (Tamil)' },
    { value: 'Kannada', label: 'ಕನ್ನಡ (Kannada)' },
  ];

  return (
    <div className="profile-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-title-icon">👤</span>
          Profile Settings
        </h1>
        <p className="page-subtitle">Manage your personal information and preferences</p>
      </div>

      <div className="profile-grid">
        {/* Profile Card */}
        <Card variant="default" padding="xl" className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} />
              ) : (
                <span>{profile.name?.charAt(0) || '?'}</span>
              )}
            </div>
            <div className="profile-meta">
              <h2 className="profile-name">{profile.name || 'Your Name'}</h2>
              <p className="profile-email">{user?.email}</p>
            </div>
          </div>
        </Card>

        {/* Edit Form */}
        <Card variant="default" padding="xl" className="edit-card">
          <CardHeader>
            <CardTitle>✏️ Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="profile-form">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
              />
              
              <Input
                label="Location"
                placeholder="e.g., Hyderabad, Telangana"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                icon="📍"
                required
              />
              
              <Select
                label="Preferred Language"
                value={profile.preferred_language}
                onChange={(e) => setProfile({ ...profile, preferred_language: e.target.value })}
                options={languageOptions}
              />

              <div className="form-actions">
                <Button 
                  variant="primary" 
                  onClick={handleSave}
                  loading={loading}
                  fullWidth
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card variant="default" padding="xl" className="account-card">
          <CardHeader>
            <CardTitle>🔐 Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="account-info">
              <div className="info-row">
                <span className="info-label">Email</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Account Type</span>
                <span className="info-value info-badge">Free</span>
              </div>
              <div className="info-row">
                <span className="info-label">Member Since</span>
                <span className="info-value">
                  {user?.metadata?.creationTime 
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
