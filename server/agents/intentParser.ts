import { geminiService } from '../ai/geminiService';
import { IntentParseResult } from '../../src/types/agent';

export async function parseUserIntent(prompt: string): Promise<IntentParseResult> {
  return await geminiService.parseIntent(prompt);
}
