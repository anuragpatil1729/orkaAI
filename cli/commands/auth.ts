import { OrkaClient } from '../api/orkaClient';
import { theme, symbols, createTable } from '../ui/theme';

export async function authLoginCommand() {
  console.log('\n' + theme.bold(theme.brand('ORKA WORKSPACE AUTHENTICATION')));
  console.log(theme.slate('────────────────────────────────────────────────────────────'));

  try {
    const status = await OrkaClient.getStatus();
    console.log(theme.emerald(`\n${symbols.completed} Google Workspace Status:`));
    console.log(`  Connected Account: ${theme.cyan(status.workspace?.userEmail || 'Demo Account')}`);
    console.log(`  Mode: ${theme.bold(status.workspace?.mode || 'DEMO WORKSPACE')}`);

    const table = createTable(['Google Service', 'Connection Status']);
    table.push(
      ['Gmail API', status.workspace?.services?.gmail ? '✓ Connected' : '✕ Disconnected'],
      ['Google Calendar API', status.workspace?.services?.calendar ? '✓ Connected' : '✕ Disconnected'],
      ['Google Drive API', status.workspace?.services?.drive ? '✓ Connected' : '✕ Disconnected']
    );
    console.log(table.toString() + '\n');
  } catch (err: any) {
    console.log(theme.rose(`\n✕ Authentication Error: ${err.message}\n`));
  }
}
