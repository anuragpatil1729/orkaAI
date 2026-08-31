import { theme } from '../ui/theme';

export function configCommand(key?: string, value?: string) {
  console.log('\n' + theme.bold(theme.brand('ORKA CONFIGURATION')));
  console.log(theme.slate('────────────────────────────────────────────────────────────'));

  if (key === 'mode' && (value === 'copilot' || value === 'autopilot')) {
    const uppercaseMode = value.toUpperCase();
    console.log(theme.emerald(`\n✓ Operating mode updated to: ${theme.bold(uppercaseMode)}`));
    if (uppercaseMode === 'COPILOT') {
      console.log(theme.slate('  COPILOT: High-risk write actions require explicit human sign-off.'));
    } else {
      console.log(theme.emerald('  AUTOPILOT: Safe automated routines execute automatically.'));
    }
  } else {
    console.log(`\n  Current Policy Mode: ${theme.bold(theme.cyan('COPILOT'))}`);
    console.log(`  Backend API URL:    ${theme.mono('http://localhost:3001')}`);
    console.log(`\n  To change operating mode:`);
    console.log(`    orka config mode copilot`);
    console.log(`    orka config mode autopilot`);
  }
  console.log('');
}
