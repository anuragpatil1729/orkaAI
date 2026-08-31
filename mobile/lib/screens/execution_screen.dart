import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/workflow_provider.dart';
import '../models/workflow.dart';
import '../widgets/approval_bottom_sheet.dart';
import '../widgets/tactile_widgets.dart';
import '../core/theme.dart';

class ExecutionScreen extends StatelessWidget {
  const ExecutionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<WorkflowProvider>(context);
    final execution = provider.execution;

    if (execution == null) {
      return const Scaffold(
        body: Center(
          child: Text('No active execution workflow.', style: TextStyle(color: OrkaTheme.textMuted)),
        ),
      );
    }

    // Trigger bottom sheet if waiting approval
    if (execution.status == 'waiting_approval' && execution.approvalRequest != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        showModalBottomSheet(
          context: context,
          isScrollControlled: true,
          backgroundColor: Colors.transparent,
          builder: (ctx) => ApprovalBottomSheet(
            request: execution.approvalRequest!,
            onApprove: (to, subject, body) {
              Navigator.of(ctx).pop();
              provider.approveStep(to: to, subject: subject, body: body);
            },
            onReject: () {
              Navigator.of(ctx).pop();
            },
          ),
        );
      });
    }

    return Scaffold(
      appBar: AppBar(
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                AIActivityPulseWidget(active: true),
                SizedBox(width: 8),
                Text('ORKA IS WORKING', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: OrkaTheme.cyanGlow)),
              ],
            ),
            Text('Autonomous Execution Network', style: TextStyle(fontSize: 10, color: OrkaTheme.textSecondary)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.close, color: OrkaTheme.textMuted),
            onPressed: () => provider.resetWorkflow(),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Goal Banner
            GlassCardWidget(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  const Icon(Icons.bolt, color: OrkaTheme.primary, size: 22),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('EXECUTION GOAL', style: TextStyle(color: OrkaTheme.textMuted, fontSize: 10, fontWeight: FontWeight.bold, fontFamily: 'monospace')),
                        Text(execution.prompt, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            const Text('EXECUTION NODES', style: TextStyle(color: OrkaTheme.textMuted, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.1)),
            const SizedBox(height: 16),

            // Step Node List
            Expanded(
              child: ListView.builder(
                itemCount: execution.steps.length,
                itemBuilder: (context, index) {
                  final step = execution.steps[index];
                  return _buildStepNode(context, step, index + 1);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStepNode(BuildContext context, WorkflowStep step, int index) {
    IconData iconData = Icons.radio_button_unchecked;
    Color statusColor = OrkaTheme.textMuted;
    String statusLabel = 'Pending';
    BoxDecoration borderDecoration = BoxDecoration(
      color: OrkaTheme.glassSurface,
      borderRadius: BorderRadius.circular(20),
      border: Border.all(color: OrkaTheme.glassBorder),
    );

    if (step.status == 'completed') {
      iconData = Icons.check_circle;
      statusColor = OrkaTheme.success;
      statusLabel = step.verified ? '✓ VERIFIED' : 'Completed';
      borderDecoration = BoxDecoration(
        color: OrkaTheme.success.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: OrkaTheme.success.withValues(alpha: 0.3)),
      );
    } else if (step.status == 'running') {
      iconData = Icons.sync;
      statusColor = OrkaTheme.primary;
      statusLabel = 'RUNNING';
      borderDecoration = BoxDecoration(
        color: OrkaTheme.primary.withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: OrkaTheme.primary),
        boxShadow: [
          BoxShadow(color: OrkaTheme.primary.withValues(alpha: 0.4), blurRadius: 15),
        ],
      );
    } else if (step.status == 'waiting_approval') {
      iconData = Icons.shield_outlined;
      statusColor = OrkaTheme.warning;
      statusLabel = 'APPROVAL REQUIRED';
      borderDecoration = BoxDecoration(
        color: OrkaTheme.warning.withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: OrkaTheme.warning),
        boxShadow: [
          BoxShadow(color: OrkaTheme.warning.withValues(alpha: 0.4), blurRadius: 15),
        ],
      );
    } else if (step.status == 'failed') {
      iconData = Icons.error_outline;
      statusColor = OrkaTheme.error;
      statusLabel = 'FAILED';
      borderDecoration = BoxDecoration(
        color: OrkaTheme.error.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: OrkaTheme.error.withValues(alpha: 0.4)),
      );
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: borderDecoration,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(iconData, color: statusColor, size: 18),
                  const SizedBox(width: 8),
                  Text('Node #$index: ${step.name}', style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                decoration: BoxDecoration(
                  color: statusColor.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: statusColor.withValues(alpha: 0.3)),
                ),
                child: Text(statusLabel, style: TextStyle(color: statusColor, fontSize: 10, fontWeight: FontWeight.bold, fontFamily: 'monospace')),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(step.reasoningSnippet ?? step.description, style: const TextStyle(color: OrkaTheme.textSecondary, fontSize: 12)),
          if (step.whyExplanation != null) ...[
            const SizedBox(height: 6),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.black45,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0x20FFFFFF)),
              ),
              child: Text(
                'WHY ORKA DID THIS: ${step.whyExplanation}',
                style: const TextStyle(color: OrkaTheme.cyanGlow, fontSize: 10, fontStyle: FontStyle.italic),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
