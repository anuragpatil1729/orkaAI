#!/usr/bin/env node
import { Command } from 'commander';
import { runOutcomeCommand } from './commands/run';
import { startInteractiveShell } from './commands/interactive';
import { authLoginCommand } from './commands/auth';
import { printStatus } from './commands/status';
import { activityCommand } from './commands/activity';
import { automationsCommand } from './commands/automations';
import { configCommand } from './commands/config';

const program = new Command();

program
  .name('orka')
  .description('OrkaAI — Autonomous AI Execution Agent for Productivity ("Tell it the outcome. It handles the work.")')
  .version('1.0.0')
  .argument('[goal]', 'Natural language outcome goal, e.g. "Prepare me for my meeting tomorrow"')
  .action(async (goal) => {
    if (goal) {
      await runOutcomeCommand(goal);
    } else {
      await startInteractiveShell();
    }
  });

program
  .command('auth')
  .alias('login')
  .description('Check Google Workspace OAuth status and connect account')
  .action(async () => {
    await authLoginCommand();
  });

program
  .command('status')
  .description('Show OrkaAI system status, Gemini model, and Workspace connections')
  .action(async () => {
    await printStatus();
  });

program
  .command('activity')
  .description('Show recent auditable workflow executions and receipts')
  .action(async () => {
    await activityCommand();
  });

program
  .command('automations')
  .description('Show active automation rules and AI discovered patterns')
  .action(async () => {
    await automationsCommand();
  });

program
  .command('config [key] [value]')
  .description('View or update Orka policy mode (copilot | autopilot)')
  .action((key, value) => {
    configCommand(key, value);
  });

program.parse(process.argv);
