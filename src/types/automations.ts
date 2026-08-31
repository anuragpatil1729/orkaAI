export interface AutomationRule {
  id: string;
  title: string;
  description: string;
  trigger: string; // e.g. "Invoice email arrives" or "Before important meeting"
  condition: string; // e.g. "Amount < ₹50,000"
  actions: string[]; // e.g. ["Extract invoice", "Update spreadsheet", "Send confirmation"]
  active: boolean;
  executionsCount: number;
  approvalsRequiredCount: number;
  category: 'invoice' | 'meeting' | 'inbox' | 'custom';
}

export interface DiscoveredPattern {
  id: string;
  title: string;
  description: string;
  occurrences: number;
  suggestedWorkflow: {
    when: string;
    if: string;
    do: string[];
  };
}
