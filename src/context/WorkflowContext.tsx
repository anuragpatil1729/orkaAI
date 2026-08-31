import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkflowExecution } from '../types/agent';
import { GoogleWorkspaceStatus } from '../types/tools';

interface WorkflowContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mode: 'COPILOT' | 'AUTOPILOT';
  setMode: (mode: 'COPILOT' | 'AUTOPILOT') => void;
  currentWorkflow: WorkflowExecution | null;
  setCurrentWorkflow: (wf: WorkflowExecution | null) => void;
  workspaceStatus: GoogleWorkspaceStatus;
  geminiConfigured: boolean;
  isExecuting: boolean;
  startWorkflow: (prompt: string) => Promise<void>;
  approveCurrentStep: () => Promise<void>;
  resetWorkflow: () => void;
  launchDemoScenario: () => Promise<void>;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mode, setMode] = useState<'COPILOT' | 'AUTOPILOT'>('COPILOT');
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowExecution | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [workspaceStatus] = useState<GoogleWorkspaceStatus>({
    connected: true,
    userEmail: 'alex.v@actionos.ai',
    services: { gmail: true, calendar: true, drive: true }
  });
  const [geminiConfigured, setGeminiConfigured] = useState(false);

  useEffect(() => {
    fetch('/api/auth/status')
      .then(res => res.json())
      .then(data => {
        if (data.gemini?.configured) {
          setGeminiConfigured(true);
        }
      })
      .catch(() => {});
  }, []);

  const startWorkflow = async (prompt: string) => {
    setIsExecuting(true);
    setActiveTab('execution');
    try {
      const res = await fetch('/api/agent/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode })
      });
      const data = await res.json();
      if (data.workflow) {
        setCurrentWorkflow(data.workflow);
        // Start advancing execution steps automatically
        runStepLoop(data.workflow.id);
      }
    } catch (err) {
      console.error('Failed to start workflow:', err);
      setIsExecuting(false);
    }
  };

  const runStepLoop = async (workflowId: string) => {
    let active = true;
    while (active) {
      try {
        const res = await fetch(`/api/agent/workflow/${workflowId}/advance`, {
          method: 'POST'
        });
        const data = await res.json();
        if (data.workflow) {
          setCurrentWorkflow(data.workflow);

          if (data.workflow.status === 'waiting_approval' || data.workflow.status === 'completed' || data.workflow.status === 'failed') {
            active = false;
            setIsExecuting(false);
            break;
          }
        }
        await new Promise(r => setTimeout(r, 900)); // Smooth step animation timing for demo
      } catch (err) {
        console.error('Step loop error:', err);
        active = false;
        setIsExecuting(false);
      }
    }
  };

  const approveCurrentStep = async () => {
    if (!currentWorkflow || !currentWorkflow.approvalRequest) return;
    setIsExecuting(true);
    try {
      const res = await fetch(`/api/agent/workflow/${currentWorkflow.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId: currentWorkflow.approvalRequest.stepId })
      });
      const data = await res.json();
      if (data.workflow) {
        setCurrentWorkflow(data.workflow);
        if (data.workflow.status !== 'completed') {
          runStepLoop(data.workflow.id);
        } else {
          setIsExecuting(false);
        }
      }
    } catch (err) {
      console.error('Approval failed:', err);
      setIsExecuting(false);
    }
  };

  const launchDemoScenario = async () => {
    await startWorkflow('Prepare me for my Acme meeting tomorrow.');
  };

  const resetWorkflow = () => {
    setCurrentWorkflow(null);
    setIsExecuting(false);
    setActiveTab('dashboard');
  };

  return (
    <WorkflowContext.Provider
      value={{
        activeTab,
        setActiveTab,
        mode,
        setMode,
        currentWorkflow,
        setCurrentWorkflow,
        workspaceStatus,
        geminiConfigured,
        isExecuting,
        startWorkflow,
        approveCurrentStep,
        resetWorkflow,
        launchDemoScenario
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) throw new Error('useWorkflow must be used within WorkflowProvider');
  return context;
};
