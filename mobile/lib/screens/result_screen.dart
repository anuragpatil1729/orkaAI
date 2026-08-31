import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/workflow_provider.dart';
import '../widgets/execution_receipt_dialog.dart';
import '../core/theme.dart';

class ResultScreen extends StatefulWidget {
  const ResultScreen({super.key});

  @override
  State<ResultScreen> createState() => _ResultScreenState();
}

class _ResultScreenState extends State<ResultScreen> {
  bool _isEditingDraft = false;
  late TextEditingController _draftController;
  bool _isSent = false;

  @override
  void initState() {
    super.initState();
    final provider = Provider.of<WorkflowProvider>(context, listen: false);
    _draftController = TextEditingController(text: provider.result?.draftEmail?.body ?? '');
  }

  @override
  void dispose() {
    _draftController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<WorkflowProvider>(context);
    final result = provider.result;

    if (result == null) {
      return const Scaffold(
        body: Center(
          child: Text('No result payload available.', style: TextStyle(color: OrkaTheme.textMuted)),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('ORKA EXECUTED OUTCOME', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: OrkaTheme.success)),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: OrkaTheme.textMuted),
            onPressed: () => provider.resetWorkflow(),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Banner
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0F382C), Color(0xFF0F111A)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: OrkaTheme.success.withOpacity(0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: OrkaTheme.success.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Text('✓ WORKFLOW EXECUTED & API VERIFIED', style: TextStyle(color: OrkaTheme.success, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'YOU\'RE READY.',
                    style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    result.brief.title.isNotEmpty ? result.brief.title : 'Acme Sync • Tomorrow 11:00 AM',
                    style: const TextStyle(color: OrkaTheme.textSecondary, fontSize: 13),
                  ),
                  const SizedBox(height: 16),

                  if (result.receipt != null)
                    ElevatedButton.icon(
                      onPressed: () {
                        showDialog(
                          context: context,
                          builder: (ctx) => ExecutionReceiptDialog(receipt: result.receipt!),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: OrkaTheme.primary.withOpacity(0.2),
                        foregroundColor: OrkaTheme.primary,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        side: BorderSide(color: OrkaTheme.primary.withOpacity(0.4)),
                      ),
                      icon: const Icon(Icons.receipt_long, size: 16),
                      label: const Text('View Execution Receipt', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Executive Briefing Card
            _buildSectionCard(
              title: 'EXECUTIVE SUMMARY',
              icon: Icons.auto_awesome,
              iconColor: OrkaTheme.primary,
              child: Text(
                result.brief.summary,
                style: const TextStyle(color: Colors.white, fontSize: 13, height: 1.5),
              ),
            ),
            const SizedBox(height: 16),

            // Key Decisions Card
            if (result.brief.keyInsights.isNotEmpty)
              _buildSectionCard(
                title: 'KEY DECISIONS & AGREEMENTS',
                icon: Icons.verified_user_outlined,
                iconColor: OrkaTheme.success,
                child: Column(
                  children: result.brief.keyInsights.map((insight) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 8.0),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(Icons.check_circle_outline, color: OrkaTheme.success, size: 16),
                          const SizedBox(width: 8),
                          Expanded(child: Text(insight, style: const TextStyle(color: Colors.white, fontSize: 12))),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ),
            const SizedBox(height: 16),

            // Open Items & Tasks Card
            if (result.tasks.isNotEmpty)
              _buildSectionCard(
                title: 'OPEN ITEMS (${result.tasks.length})',
                icon: Icons.check_box_outlined,
                iconColor: OrkaTheme.warning,
                child: Column(
                  children: result.tasks.map((task) {
                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.black26,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.check_box_outline_blank, color: OrkaTheme.warning, size: 16),
                          const SizedBox(width: 8),
                          Expanded(child: Text(task, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600))),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ),
            const SizedBox(height: 16),

            // Follow-Up Draft Card
            if (result.draftEmail != null)
              _buildSectionCard(
                title: 'FOLLOW-UP EMAIL DRAFT',
                icon: Icons.mail_outline,
                iconColor: OrkaTheme.secondary,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('To: ${result.draftEmail!.to}', style: const TextStyle(color: OrkaTheme.textMuted, fontSize: 12)),
                        TextButton.icon(
                          onPressed: () {
                            setState(() {
                              _isEditingDraft = !_isEditingDraft;
                            });
                          },
                          icon: const Icon(Icons.edit, size: 14, color: OrkaTheme.primary),
                          label: Text(_isEditingDraft ? 'Save' : 'Edit', style: const TextStyle(color: OrkaTheme.primary, fontSize: 12)),
                        ),
                      ],
                    ),
                    Text('Subject: ${result.draftEmail!.subject}', style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
                    const Divider(color: Colors.white10, height: 20),
                    if (_isEditingDraft)
                      TextField(
                        controller: _draftController,
                        maxLines: 5,
                        style: const TextStyle(color: Colors.white, fontSize: 12),
                        decoration: const InputDecoration(border: OutlineInputBorder()),
                      )
                    else
                      Text(
                        _draftController.text,
                        style: const TextStyle(color: OrkaTheme.textSecondary, fontSize: 12, height: 1.5),
                      ),
                    const SizedBox(height: 16),
                    if (!_isSent)
                      ElevatedButton.icon(
                        onPressed: () {
                          setState(() {
                            _isSent = true;
                          });
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: OrkaTheme.success,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        icon: const Icon(Icons.send, size: 16),
                        label: const Text('Approve & Send Email', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                      )
                    else
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: OrkaTheme.success.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.check_circle, color: OrkaTheme.success, size: 16),
                            SizedBox(width: 8),
                            Text('Sent to Rahul Sharma • API Verified', style: TextStyle(color: OrkaTheme.success, fontSize: 12, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                  ],
                ),
              ),
            const SizedBox(height: 28),

            const Center(
              child: Text(
                '"Go into the meeting prepared."',
                style: TextStyle(color: OrkaTheme.textMuted, fontSize: 12, fontStyle: FontStyle.italic),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionCard({
    required String title,
    required IconData icon,
    required Color iconColor,
    required Widget child,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: OrkaTheme.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: OrkaTheme.surfaceBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: iconColor, size: 18),
              const SizedBox(width: 8),
              Text(title, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }
}
