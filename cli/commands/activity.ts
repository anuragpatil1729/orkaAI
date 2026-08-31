import { OrkaClient } from '../api/orkaClient';
import { theme, symbols, createTable } from '../ui/theme';

export async function activityCommand() {
  console.log('\n' + theme.bold(theme.brand('RECENT AUDITABLE WORKFLOW ACTIVITY')));
  console.log(theme.slate('────────────────────────────────────────────────────────────'));

  try {
    const activities = await OrkaClient.getActivity();
    if (activities.length === 0) {
      console.log(theme.dim('\nNo recent execution activity logged.\n'));
      return;
    }

    const table = createTable(['Timestamp', 'Outcome Goal', 'Actions', 'Status']);
    activities.forEach(act => {
      table.push([
        act.timestamp || 'Today',
        act.goal,
        `${act.actionsCount} actions`,
        act.status === 'Completed' ? symbols.completed + ' Completed' : act.status
      ]);
    });

    console.log(table.toString() + '\n');
  } catch (err: any) {
    console.log(theme.rose(`\n✕ ${err.message}\n`));
  }
}
