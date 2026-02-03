// src/components/LandingPage.jsx
import { useState, useEffect } from 'react';
import Button from './ui/Button';
import './LandingPage.css';

export default function LandingPage({ onGetStarted }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const features = [
    {
      icon: '🌾',
      title: 'Smart Crop Planning',
      description: 'Get personalized crop plans based on your land, water availability, and investment level.',
    },
    {
      icon: '📊',
      title: 'Fertilizer Schedules',
      description: 'Receive detailed week-by-week fertilizer schedules optimized for maximum yield.',
    },
    {
      icon: '💰',
      title: 'Cost Estimation',
      description: 'Know your expected costs and yields before you start farming.',
    },
    {
      icon: '🤖',
      title: 'AI Assistant',
      description: 'Ask questions and get instant answers about farming practices.',
    },
  ];

  const stats = [
    { value: '4+', label: 'Crop Types' },
    { value: '100%', label: 'Free to Use' },
    { value: '24/7', label: 'AI Support' },
    { value: '∞', label: 'Plans Generated' },
  ];

  return (
    <div className={`landing ${loaded ? 'landing-loaded' : ''}`}>
      {/* Animated Background */}
      <div className="landing-bg">
        <div className="bg-gradient"></div>
        <div className="bg-grid"></div>
        <div className="bg-particles">
          {[...Array(20)].map((_, i) => (
            <span 
              key={i} 
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>
        <div className="bg-glow bg-glow-3"></div>
      </div>

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <span className="logo-icon">🌱</span>
          <span className="logo-text">AgriAI</span>
        </div>
        <Button variant="outline" size="sm" onClick={onGetStarted}>
          Login
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            AI-Powered Agriculture
          </div>
          
          <h1 className="hero-title">
            <span className="title-line">Smart Farming</span>
            <span className="title-line title-gradient">Made Simple</span>
          </h1>
          
          <p className="hero-description">
            Transform your farming with intelligent crop planning, personalized fertilizer 
            schedules, and AI-powered assistance. Get started in minutes.
          </p>
          
          <div className="hero-actions">
            <Button variant="primary" size="lg" onClick={onGetStarted}>
              Get Started Free
              <span className="btn-arrow">→</span>
            </Button>
            <Button variant="ghost" size="lg">
              Learn More
            </Button>
          </div>

          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card visual-card-1">
            <div className="visual-icon">🌾</div>
            <div className="visual-text">Paddy</div>
            <div className="visual-bar">
              <div className="bar-fill" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div className="visual-card visual-card-2">
            <div className="visual-icon">🌽</div>
            <div className="visual-text">Maize</div>
            <div className="visual-bar">
              <div className="bar-fill" style={{ width: '70%' }}></div>
            </div>
          </div>
          <div className="visual-card visual-card-3">
            <div className="visual-icon">🥜</div>
            <div className="visual-text">Groundnut</div>
            <div className="visual-bar">
              <div className="bar-fill" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div className="visual-center">
            <div className="center-ring"></div>
            <div className="center-ring"></div>
            <div className="center-ring"></div>
            <div className="center-icon">🌱</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <div className="features-header">
          <span className="section-label">Features</span>
          <h2 className="section-title">Everything You Need</h2>
          <p className="section-description">
            Powerful tools designed specifically for modern farmers
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-glow"></div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Farm?</h2>
          <p className="cta-description">
            Join thousands of farmers already using AgriAI to optimize their yields.
          </p>
          <Button variant="primary" size="xl" onClick={onGetStarted}>
            Start Planning Now
          </Button>
        </div>
        <div className="cta-bg"></div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-icon">🌱</span>
            <span className="logo-text">AgriAI</span>
          </div>
          <p className="footer-text">
            © 2025 AgriAI. Empowering Farmers with Technology.
          </p>
        </div>
      </footer>
    </div>
  );
}
