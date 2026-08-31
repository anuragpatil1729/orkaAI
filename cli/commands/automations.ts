import { OrkaClient } from '../api/orkaClient';
import { theme, symbols, createTable } from '../ui/theme';

export async function automationsCommand() {
  console.log('\n' + theme.bold(theme.brand('ACTIVE AUTOMATION RULES & PATTERNS')));
  console.log(theme.slate('────────────────────────────────────────────────────────────'));

  try {
    const { automations, discoveredPattern } = await OrkaClient.getAutomations();

    const table = createTable(['Rule Title', 'Trigger', 'Condition', 'Status']);
    automations.forEach(auto => {
      table.push([
        auto.title,
        auto.trigger,
        auto.condition,
        auto.active ? symbols.completed + ' ACTIVE' : theme.dim('DISABLED')
      ]);
    });
    console.log(table.toString());

    if (discoveredPattern) {
      console.log('\n' + theme.bold(theme.cyan('AI DISCOVERED PATTERN:')));
      console.log(`  ${theme.bold(discoveredPattern.title)}`);
      console.log(`  ${theme.slate(discoveredPattern.description)}`);
      console.log(`  ${theme.dim('Suggested Trigger:')} ${discoveredPattern.suggestedWorkflow.when}`);
    }
    console.log('');
  } catch (err: any) {
    console.log(theme.rose(`\n✕ ${err.message}\n`));
  }
}
