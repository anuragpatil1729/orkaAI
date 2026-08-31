import { RiskLevel } from './agent';

export interface ToolDefinition {
  id: string;
  name: string;
  category: 'calendar' | 'gmail' | 'drive' | 'tasks' | 'ai' | 'github';
  description: string;
  riskLevel: RiskLevel;
  parameters: Record<string, {
    type: string;
    description: string;
    required: boolean;
  }>;
}

export interface GoogleWorkspaceStatus {
  connected: boolean;
  userEmail?: string;
  services: {
    gmail: boolean;
    calendar: boolean;
    drive: boolean;
  };
}

export interface AcmeMockData {
  meeting: {
    id: string;
    title: string;
    company: string;
    startTime: string;
    endTime: string;
    attendees: string[];
    location: string;
  };
  emails: Array<{
    id: string;
    sender: string;
    recipient: string;
    subject: string;
    snippet: string;
    body: string;
    date: string;
  }>;
  documents: Array<{
    id: string;
    title: string;
    type: string;
    lastModified: string;
    summary: string;
  }>;
}
