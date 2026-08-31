import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkflowProvider, useWorkflow } from './context/WorkflowContext';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ExecutionPage } from './pages/ExecutionPage';
import { AutomationsPage } from './pages/AutomationsPage';
import { ActivityPage } from './pages/ActivityPage';
import { IntegrationsPage } from './pages/IntegrationsPage';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { activeTab } = useWorkflow();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#17233B] flex items-center justify-center text-white font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>Authenticating OrkaAI Session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'execution':
        return <ExecutionPage />;
      case 'automations':
        return <AutomationsPage />;
      case 'activity':
        return <ActivityPage />;
      case 'connected':
        return <IntegrationsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return <Layout>{renderTab()}</Layout>;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WorkflowProvider>
          <AppContent />
        </WorkflowProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
