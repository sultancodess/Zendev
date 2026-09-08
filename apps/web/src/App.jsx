import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar.jsx';
import { Header } from './components/Header.jsx';
import { Overview } from './pages/Overview.jsx';
import { Conversations } from './pages/Conversations.jsx';
import { Leads } from './pages/Leads.jsx';
import { Appointments } from './pages/Appointments.jsx';
import { Services } from './pages/Services.jsx';
import { Doctors } from './pages/Doctors.jsx';
import { Faqs } from './pages/Faqs.jsx';
import { Analytics } from './pages/Analytics.jsx';
import { WhatsAppSimulator } from './pages/WhatsAppSimulator.jsx';
import { Settings } from './pages/Settings.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { api } from './services/api.js';

export function AppContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingHandoffs, setPendingHandoffs] = useState(0);

  useEffect(() => {
    async function checkHandoffs() {
      try {
        const data = await api.getAnalytics();
        setPendingHandoffs(data.overview?.pendingHandoffs || 0);
      } catch (err) {
        // quiet error
      }
    }
    checkHandoffs();
    const interval = setInterval(checkHandoffs, 10000);
    return () => clearInterval(interval);
  }, []);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview onNavigate={(tab) => setActiveTab(tab)} />;
      case 'conversations':
        return <Conversations />;
      case 'leads':
        return <Leads />;
      case 'appointments':
        return <Appointments />;
      case 'services':
        return <Services />;
      case 'doctors':
        return <Doctors />;
      case 'faqs':
        return <Faqs />;
      case 'analytics':
        return <Analytics />;
      case 'simulator':
        return <WhatsAppSimulator />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex relative overflow-x-hidden">
      {/* Ambient Orbs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/4 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="fixed top-0 right-0 w-[400px] h-[400px] bg-emerald-600/3 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[350px] h-[350px] bg-teal-500/3 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 lg:pl-60 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          pendingHandoffCount={pendingHandoffs}
        />

        <main key={activeTab} className="flex-1 p-4 sm:p-5 max-w-[1380px] w-full mx-auto">
          {renderActivePage()}
        </main>
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
