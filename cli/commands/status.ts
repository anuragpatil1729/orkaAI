import { OrkaClient } from '../api/orkaClient';
import { theme, createTable } from '../ui/theme';

export async function printStatus() {
  console.log('\n' + theme.bold(theme.brand('ORKA SYSTEM STATUS')));
  console.log(theme.slate('────────────────────────────────────────────────────────────'));

  try {
    const status = await OrkaClient.getStatus();

    const table = createTable(['Component', 'Status / Details']);
    table.push(
      ['Backend API', '✓ Online (http://localhost:3001)'],
      ['Gemini Engine', status.gemini?.configured ? `✓ Live (${status.gemini.model})` : `⚠ Demo Mode (${status.gemini?.model || 'gemini-1.5-flash'})`],
      ['Workspace Mode', status.workspace?.mode || 'DEMO WORKSPACE'],
      ['Active Account', status.workspace?.userEmail || 'alex.v@orka.ai'],
      ['Gmail API', status.workspace?.services?.gmail ? '✓ Connected' : '✕ Disconnected'],
      ['Calendar API', status.workspace?.services?.calendar ? '✓ Connected' : '✕ Disconnected'],
      ['Drive API', status.workspace?.services?.drive ? '✓ Connected' : '✕ Disconnected'],
      ['Action Policy Mode', 'COPILOT (High-Risk Write Actions Require Approval)']
    );

    console.log(table.toString() + '\n');
  } catch (err: any) {
    console.log(theme.rose(`\n✕ ${err.message}\n`));
  }
}
