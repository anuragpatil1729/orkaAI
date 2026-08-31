import 'package:flutter/material.dart';
import '../models/result.dart';
import '../widgets/tactile_widgets.dart';
import '../core/theme.dart';

class ExecutionReceiptDialog extends StatelessWidget {
  final ExecutionReceipt receipt;

  const ExecutionReceiptDialog({super.key, required this.receipt});

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: OrkaTheme.backgroundDarker,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(28),
        side: const BorderSide(color: Color(0x4010B981)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: OrkaTheme.success.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: OrkaTheme.success.withValues(alpha: 0.3)),
                  ),
                  child: const Icon(Icons.verified_outlined, color: OrkaTheme.success, size: 20),
                ),
                const SizedBox(width: 12),
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('OFFICIAL AUDIT REPORT', style: TextStyle(color: OrkaTheme.success, fontSize: 10, fontWeight: FontWeight.bold, fontFamily: 'monospace')),
                    Text('ORKA EXECUTION RECEIPT', style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.black,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white10),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('ID: ${receipt.receiptId}', style: const TextStyle(color: OrkaTheme.textMuted, fontSize: 10, fontFamily: 'monospace')),
                  const SizedBox(height: 8),
                  Text('GOAL: ${receipt.goal}', style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                  const Divider(color: Colors.white10, height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Actions Executed:', style: TextStyle(color: OrkaTheme.textSecondary, fontSize: 11)),
                      Text('${receipt.actionsTotal} Executed', style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('API Verified:', style: TextStyle(color: OrkaTheme.textSecondary, fontSize: 11)),
                      Text('✓ ${receipt.actionsVerified} Verified', style: const TextStyle(color: OrkaTheme.success, fontSize: 11, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Approvals:', style: TextStyle(color: OrkaTheme.textSecondary, fontSize: 11)),
                      Text('${receipt.approvalsGranted} / ${receipt.approvalsRequired} Granted', style: const TextStyle(color: OrkaTheme.cyanGlow, fontSize: 11, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Execution Time:', style: TextStyle(color: OrkaTheme.textSecondary, fontSize: 11)),
                      Text('${receipt.executionTimeSeconds}s', style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Align(
              alignment: Alignment.centerRight,
              child: TactileButtonWidget(
                label: 'Close Receipt',
                onPressed: () => Navigator.of(context).pop(),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
