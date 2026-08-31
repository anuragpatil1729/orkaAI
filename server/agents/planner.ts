import { geminiService } from '../ai/geminiService';
import { IntentParseResult, WorkflowStep } from '../../src/types/agent';

export async function createExecutionPlan(intent: IntentParseResult): Promise<WorkflowStep[]> {
  return await geminiService.createPlan(intent);
}
