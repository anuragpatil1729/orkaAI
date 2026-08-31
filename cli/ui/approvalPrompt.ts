import inquirer from 'inquirer';
import { theme, symbols } from './theme';

export interface ApprovalChoiceResult {
  action: 'approve' | 'edit' | 'reject';
  customPayload?: {
    to?: string;
    subject?: string;
    body?: string;
  };
}

export async function promptApproval(req: {
  actionName: string;
  targetRecipient?: string;
  subject?: string;
  contentPreview: string;
  riskReason: string;
}): Promise<ApprovalChoiceResult> {
  console.log('\n' + theme.amber('─'.repeat(60)));
  console.log(`${symbols.approval}  ${theme.bold(theme.amber('APPROVAL REQUIRED'))}`);
  console.log(theme.amber('─'.repeat(60)));
  console.log(`${theme.bold('Action:')}  ${req.actionName}`);
  console.log(`${theme.bold('To:')}      ${theme.cyan(req.targetRecipient || 'Client Contact')}`);
  console.log(`${theme.bold('Subject:')} ${theme.bold(req.subject || 'Follow-up Email')}`);
  console.log(`${theme.bold('Why:')}     ${theme.dim(req.riskReason)}`);
  console.log(theme.dim('─'.repeat(60)));
  console.log(theme.italic(req.contentPreview));
  console.log(theme.amber('─'.repeat(60)) + '\n');

  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Select action for this sensitive operation:',
      choices: [
        { name: `${symbols.completed}  [a] Approve & Send Email`, value: 'approve' },
        { name: `✏️   [e] Edit Email Draft`, value: 'edit' },
        { name: `${symbols.failed}  [r] Reject Action`, value: 'reject' }
      ]
    }
  ]);

  if (choice === 'approve') {
    return { action: 'approve' };
  } else if (choice === 'reject') {
    return { action: 'reject' };
  }

  // Edit draft fields
  console.log(theme.cyan('\n✏️  Editing Email Draft:'));
  const edited = await inquirer.prompt([
    {
      type: 'input',
      name: 'to',
      message: 'To:',
      default: req.targetRecipient
    },
    {
      type: 'input',
      name: 'subject',
      message: 'Subject:',
      default: req.subject
    },
    {
      type: 'editor',
      name: 'body',
      message: 'Body:',
      default: req.contentPreview
    }
  ]);

  console.log(theme.emerald('\n✓ Draft updated. Transmitting...'));
  return {
    action: 'approve',
    customPayload: {
      to: edited.to,
      subject: edited.subject,
      body: edited.body
    }
  };
}
