import { OrkaClient } from '../api/orkaClient';
import { theme, symbols, createTable } from '../ui/theme';
import { promptApproval } from '../ui/approvalPrompt';

export async function runOutcomeCommand(prompt: string, mode: 'COPILOT' | 'AUTOPILOT' = 'COPILOT') {
  if (!prompt || !prompt.trim()) {
    console.log(theme.rose('✕ Please specify an outcome goal. Example: orka "prepare me for my Acme meeting tomorrow"'));
    return;
  }

  console.log('\n' + theme.bold(theme.brand('  ORKA')) + ' ' + theme.dim('AI Execution Agent'));
  console.log(theme.slate('  ────────────────────────────────────────────────────────────'));
  console.log(`  ${theme.bold('Goal:')} ${theme.cyan(prompt.trim())}\n`);

  try {
    console.log(theme.dim('  Parsing intent & generating policy-checked execution plan...'));
    const { intent, workflow } = await OrkaClient.executeOutcome(prompt.trim(), mode);
    
    console.log(theme.emerald(`  ✓ Intent Parsed: ${intent.goal}`));
    console.log(theme.slate(`  Plan compiled with ${workflow.steps.length} sequential steps:\n`));

    let activeWorkflow = workflow;
    let keepRunning = true;

    while (keepRunning) {
      // Print dynamic steps state
      printStepGraph(activeWorkflow.steps, activeWorkflow.currentStepId);

      if (activeWorkflow.status === 'waiting_approval' && activeWorkflow.approvalRequest) {
        const choice = await promptApproval(activeWorkflow.approvalRequest);
        if (choice.action === 'reject') {
          console.log(theme.rose('\n✕ Action rejected by user. Aborting sensitive workflow step.'));
          break;
        }

        console.log(theme.emerald('\n✓ Approval granted. Continuing execution loop...'));
        activeWorkflow = await OrkaClient.approveStep(activeWorkflow.id, activeWorkflow.approvalRequest.stepId, choice.customPayload);
        continue;
      }

      if (activeWorkflow.status === 'completed' || activeWorkflow.status === 'failed') {
        keepRunning = false;
        break;
      }

      // Advance next step
      await new Promise(r => setTimeout(r, 400));
      activeWorkflow = await OrkaClient.advanceWorkflow(activeWorkflow.id);
    }

    if (activeWorkflow.status === 'completed' && activeWorkflow.result) {
      printExecutionResult(activeWorkflow.result);
    }
  } catch (err: any) {
    console.log(theme.rose(`\n✕ Orka CLI Execution Error: ${err.message}`));
  }
}

function printStepGraph(steps: any[], currentStepId?: string) {
  process.stdout.write('\x1Bc'); // Clear terminal screen for clean live animation
  console.log('\n' + theme.bold(theme.brand('  ORKA')) + ' ' + theme.dim('AI Execution Agent'));
  console.log(theme.slate('  ────────────────────────────────────────────────────────────\n'));

  steps.forEach((s, idx) => {
    let symbol = symbols.pending;
    let nameText = theme.slate(s.name);
    let desc = theme.dim(s.reasoningSnippet || s.description);

    if (s.status === 'completed') {
      symbol = symbols.completed;
      nameText = theme.bold(theme.emerald(s.name));
    } else if (s.status === 'running') {
      symbol = symbols.running;
      nameText = theme.bold(theme.brand(s.name));
    } else if (s.status === 'waiting_approval') {
      symbol = symbols.approval;
      nameText = theme.bold(theme.amber(`${s.name} (APPROVAL REQUIRED)`));
    } else if (s.status === 'failed') {
      symbol = symbols.failed;
      nameText = theme.bold(theme.rose(s.name));
    }

    const why = s.whyExplanation ? theme.muted(` [Why: ${s.whyExplanation}]`) : '';
    console.log(`  ${symbol} ${nameText} ${desc}${why}`);
  });
  console.log('');
}

function printExecutionResult(result: any) {
  console.log(theme.emerald('─'.repeat(60)));
  console.log(theme.bold(theme.emerald('✓ YOU\'RE READY — OUTCOME COMPLETED')));
  console.log(theme.emerald('─'.repeat(60)));

  console.log(`\n${theme.bold('EXECUTIVE SUMMARY:')}`);
  console.log(theme.slate(result.brief.summary));

  if (result.brief.unresolvedItems && result.brief.unresolvedItems.length > 0) {
    console.log(`\n${theme.bold(theme.amber('OPEN ITEMS & COMMITMENTS:'))}`);
    result.brief.unresolvedItems.forEach((item: string, i: number) => {
      console.log(`  ${i + 1}. ${item}`);
    });
  }

  if (result.draftEmail) {
    console.log(`\n${theme.bold(theme.cyan('FOLLOW-UP EMAIL DRAFT PREPARED:'))}`);
    console.log(`  ${theme.bold('To:')}      ${result.draftEmail.to}`);
    console.log(`  ${theme.bold('Subject:')} ${result.draftEmail.subject}`);
  }

  // Print Execution Receipt
  if (result.receipt) {
    console.log('\n' + theme.brand('─'.repeat(60)));
    console.log(theme.bold(theme.brand('ORKA EXECUTION RECEIPT')));
    console.log(theme.brand('─'.repeat(60)));

    const table = createTable(['Field', 'Details']);
    table.push(
      ['Receipt ID', result.receipt.receiptId],
      ['Goal', result.receipt.goal],
      ['Actions Executed', `${result.receipt.actionsTotal} Total`],
      ['API Verified', `✓ ${result.receipt.actionsVerified} Verified`],
      ['Approvals', `${result.receipt.approvalsGranted} / ${result.receipt.approvalsRequired} Granted`],
      ['Execution Time', `${result.receipt.executionTimeSeconds}s`]
    );
    console.log(table.toString());
  }

  console.log(`\n${theme.italic(theme.dim('"Go into the meeting prepared."'))}\n`);
}
