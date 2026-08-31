import inquirer from 'inquirer';
import { printBanner, theme } from '../ui/theme';
import { runOutcomeCommand } from './run';
import { printStatus } from './status';

export async function startInteractiveShell() {
  printBanner();

  console.log(theme.cyan('Type any outcome request (or type "help", "status", "exit"):'));

  let active = true;
  while (active) {
    const { input } = await inquirer.prompt([
      {
        type: 'input',
        name: 'input',
        message: theme.brand('orka >')
      }
    ]);

    const cmd = input.trim();
    if (!cmd) continue;

    if (cmd === 'exit' || cmd === 'quit') {
      console.log(theme.dim('\nGoodbye!\n'));
      active = false;
      break;
    } else if (cmd === 'status') {
      await printStatus();
    } else if (cmd === 'help') {
      console.log(theme.slate('\nAvailable Commands in Shell:'));
      console.log('  prepare me for my Acme meeting tomorrow');
      console.log('  summarize today\'s work');
      console.log('  status');
      console.log('  exit / quit\n');
    } else {
      await runOutcomeCommand(cmd);
    }
  }
}
