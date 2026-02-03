// src/components/DashboardLayout.jsx
import { useState, useEffect } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Sidebar from './Sidebar';
import Overview from '../pages/Overview';
import Profile from '../pages/Profile';
import Fields from '../pages/Fields';
import CropPlan from '../pages/CropPlan';
import Assistant from '../pages/Assistant';
import { PageLoader } from './ui/Loader';
import { ToastProvider } from './ui/Toast';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('overview');
  const [pageTransition, setPageTransition] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleNavigate = (page) => {
    if (page === activePage) return;
    setPageTransition(true);
    setTimeout(() => {
      setActivePage(page);
      setPageTransition(false);
    }, 200);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) return <PageLoader />;

  const renderPage = () => {
    const props = { user };
    switch (activePage) {
      case 'overview':
        return <Overview {...props} />;
      case 'profile':
        return <Profile {...props} />;
      case 'fields':
        return <Fields {...props} />;
      case 'plan':
        return <CropPlan {...props} />;
      case 'assistant':
        return <Assistant {...props} />;
      default:
        return <Overview {...props} />;
    }
  };

  return (
    <ToastProvider>
      <div className="dashboard-layout">
        <Sidebar 
          activePage={activePage}
          onNavigate={handleNavigate}
          user={user}
          onLogout={handleLogout}
        />
        
        <main className={`dashboard-main ${pageTransition ? 'page-transitioning' : ''}`}>
          <div className="dashboard-content">
            {renderPage()}
          </div>
        </main>

        {/* Background Effects */}
        <div className="dashboard-bg">
          <div className="bg-gradient"></div>
        </div>
      </div>
    </ToastProvider>
  );
}
