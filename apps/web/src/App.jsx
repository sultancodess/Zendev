import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar.jsx';
import { Header }  from './components/Header.jsx';
import { Overview }          from './pages/Overview.jsx';
import { Conversations }     from './pages/Conversations.jsx';
import { Leads }             from './pages/Leads.jsx';
import { Appointments }      from './pages/Appointments.jsx';
import { Services }          from './pages/Services.jsx';
import { Doctors }           from './pages/Doctors.jsx';
import { Faqs }              from './pages/Faqs.jsx';
import { Analytics }         from './pages/Analytics.jsx';
import { WhatsAppSimulator } from './pages/WhatsAppSimulator.jsx';
import { Settings }          from './pages/Settings.jsx';
import { AuthProvider }      from './context/AuthContext.jsx';
import { api }               from './services/api.js';

export function AppContent() {
  const [activeTab,     setActiveTab]     = useState('overview');
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [pendingHandoffs, setPendingHandoffs] = useState(0);

  useEffect(() => {
    async function check() {
      try {
        const d = await api.getAnalytics();
        setPendingHandoffs(d.overview?.pendingHandoffs || 0);
      } catch {}
    }
    check();
    const t = setInterval(check, 10000);
    return () => clearInterval(t);
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case 'overview':      return <Overview onNavigate={setActiveTab} />;
      case 'conversations': return <Conversations />;
      case 'leads':         return <Leads />;
      case 'appointments':  return <Appointments />;
      case 'services':      return <Services />;
      case 'doctors':       return <Doctors />;
      case 'faqs':          return <Faqs />;
      case 'analytics':     return <Analytics />;
      case 'simulator':     return <WhatsAppSimulator />;
      case 'settings':      return <Settings />;
      default:              return <Overview onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#f4f5f7' }}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        pendingHandoffCount={pendingHandoffs}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1" style={{ marginLeft: 0, paddingLeft: 0 }}>
        {/* Offset for fixed sidebar on desktop */}
        <div className="lg:pl-48 flex flex-col flex-1">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            activeTab={activeTab}
            onNavigate={setActiveTab}
            pendingHandoffCount={pendingHandoffs}
          />

          <main
            key={activeTab}
            className="flex-1 p-5 sm:p-6 page-enter"
            style={{ maxWidth: 1320, width: '100%', margin: '0 auto' }}
          >
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
