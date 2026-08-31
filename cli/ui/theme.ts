import chalk from 'chalk';
import Table from 'cli-table3';

export const theme = {
  brand: (text: string) => chalk.bold.hex('#6366f1')(text),
  cyan: (text: string) => chalk.hex('#06b6d4')(text),
  emerald: (text: string) => chalk.hex('#10b981')(text),
  amber: (text: string) => chalk.hex('#f59e0b')(text),
  rose: (text: string) => chalk.hex('#f43f5e')(text),
  slate: (text: string) => chalk.hex('#94a3b8')(text),
  muted: (text: string) => chalk.hex('#64748b')(text),
  dim: (text: string) => chalk.dim(text),
  bold: (text: string) => chalk.bold(text),
  mono: (text: string) => chalk.hex('#a5b4fc')(text),
  italic: (text: string) => chalk.italic(text)
};

export const symbols = {
  completed: chalk.hex('#10b981')('✓'),
  running: chalk.hex('#6366f1')('◉'),
  pending: chalk.hex('#64748b')('○'),
  approval: chalk.hex('#f59e0b')('⚠'),
  failed: chalk.hex('#f43f5e')('✕'),
  bullet: chalk.hex('#6366f1')('•')
};

export function printBanner() {
  const asciiArt = `
${theme.brand(`
  ██████╗ ██████╗ ██╗  ██╗ █████╗ 
 ██╔═══██╗██╔══██╗██║ ██╔╝██╔══██╗
 ██║   ██║██████╔╝█████╔╝ ███████║
 ██║   ██║██╔══██╗██╔═██╗ ██╔══██║
 ╚██████╔╝██║  ██║██║  ██╗██║  ██║
  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝`)}
${theme.cyan('  AI Autonomous Execution Agent for Productivity')}
${theme.slate('  "Tell it the outcome. It handles the work."')}
`;
  console.log(asciiArt);
}

export function createTable(head: string[]) {
  return new Table({
    head: head.map(h => theme.brand(h)),
    style: { head: [], border: ['slate'] },
    chars: {
      'top': '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
      'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
      'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
      'right': '│', 'right-mid': '┤', 'middle': '│'
    }
  });
}
