import 'package:flutter/material.dart';
import '../models/workflow.dart';
import '../core/theme.dart';

class ApprovalBottomSheet extends StatefulWidget {
  final ApprovalRequest request;
  final Function(String? to, String? subject, String? body) onApprove;
  final VoidCallback onReject;

  const ApprovalBottomSheet({
    super.key,
    required this.request,
    required this.onApprove,
    required this.onReject,
  });

  @override
  State<ApprovalBottomSheet> createState() => _ApprovalBottomSheetState();
}

class _ApprovalBottomSheetState extends State<ApprovalBottomSheet> {
  bool _isEditing = false;
  late TextEditingController _toController;
  late TextEditingController _subjectController;
  late TextEditingController _bodyController;

  @override
  void initState() {
    super.initState();
    _toController = TextEditingController(text: widget.request.targetRecipient ?? 'rahul.sharma@acmecorp.com');
    _subjectController = TextEditingController(text: widget.request.subject ?? 'Acme Integration Follow-up');
    _bodyController = TextEditingController(text: widget.request.contentPreview);
  }

  @override
  void dispose() {
    _toController.dispose();
    _subjectController.dispose();
    _bodyController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: Color(0xFF0F111A),
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
        border: Border(top: BorderSide(color: OrkaTheme.warning, width: 1.5)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: OrkaTheme.warning.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.shield_outlined, color: OrkaTheme.warning, size: 20),
              ),
              const SizedBox(width: 12),
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'APPROVAL REQUIRED',
                    style: TextStyle(
                      color: OrkaTheme.warning,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.2,
                    ),
                  ),
                  Text(
                    'Orka Policy Engine Guardrail',
                    style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            widget.request.riskReason,
            style: const TextStyle(color: OrkaTheme.textSecondary, fontSize: 12),
          ),
          const SizedBox(height: 16),
          if (!_isEditing) ...[
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.black45,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: OrkaTheme.surfaceBorder),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Text('To: ', style: TextStyle(color: OrkaTheme.textMuted, fontSize: 12)),
                      Text(_toController.text, style: const TextStyle(color: OrkaTheme.secondary, fontSize: 12, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Subject: ${_subjectController.text}',
                    style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                  ),
                  const Divider(color: Colors.white10, height: 20),
                  Text(
                    _bodyController.text,
                    maxLines: 4,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(color: OrkaTheme.textSecondary, fontSize: 12, height: 1.4),
                  ),
                ],
              ),
            ),
          ] else ...[
            TextField(
              controller: _toController,
              style: const TextStyle(color: Colors.white, fontSize: 13),
              decoration: const InputDecoration(labelText: 'To', labelStyle: TextStyle(color: OrkaTheme.textMuted)),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _subjectController,
              style: const TextStyle(color: Colors.white, fontSize: 13),
              decoration: const InputDecoration(labelText: 'Subject', labelStyle: TextStyle(color: OrkaTheme.textMuted)),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _bodyController,
              maxLines: 4,
              style: const TextStyle(color: Colors.white, fontSize: 12),
              decoration: const InputDecoration(labelText: 'Body Text', labelStyle: TextStyle(color: OrkaTheme.textMuted)),
            ),
          ],
          const SizedBox(height: 20),
          Row(
            children: [
              TextButton(
                onPressed: () {
                  setState(() {
                    _isEditing = !_isEditing;
                  });
                },
                child: Text(_isEditing ? 'Save Edits' : 'Edit Email', style: const TextStyle(color: OrkaTheme.primary, fontSize: 12)),
              ),
              const Spacer(),
              OutlinedButton(
                onPressed: widget.onReject,
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: OrkaTheme.error),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('Reject', style: TextStyle(color: OrkaTheme.error, fontSize: 12)),
              ),
              const SizedBox(width: 8),
              ElevatedButton.icon(
                onPressed: () {
                  widget.onApprove(_toController.text, _subjectController.text, _bodyController.text);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: OrkaTheme.success,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                icon: const Icon(Icons.send_rounded, size: 16),
                label: const Text('Approve & Send', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
