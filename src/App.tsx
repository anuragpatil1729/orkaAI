import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { WorkflowProvider, useWorkflow } from './context/WorkflowContext';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { ExecutionPage } from './pages/ExecutionPage';
import { AutomationsPage } from './pages/AutomationsPage';
import { ActivityPage } from './pages/ActivityPage';
import { IntegrationsPage } from './pages/IntegrationsPage';

const AppContent: React.FC = () => {
  const { activeTab } = useWorkflow();

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
      <WorkflowProvider>
        <AppContent />
      </WorkflowProvider>
    </ThemeProvider>
  );
};

export default App;
