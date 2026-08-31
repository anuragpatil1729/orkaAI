import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/workflow_provider.dart';
import '../core/theme.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _inputController = TextEditingController();

  void _submitGoal(String text) {
    if (text.trim().isEmpty) return;
    final provider = Provider.of<WorkflowProvider>(context, listen: false);
    provider.startExecution(text.trim());
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<WorkflowProvider>(context);

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Brand Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: OrkaTheme.primary.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.auto_awesome, color: OrkaTheme.primary, size: 24),
                      ),
                      const SizedBox(width: 12),
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('OrkaAI', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                          Text('Mobile Operator Engine', style: TextStyle(color: OrkaTheme.textSecondary, fontSize: 11)),
                        ],
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: OrkaTheme.primary.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: OrkaTheme.primary.withValues(alpha: 0.3)),
                    ),
                    child: Text(
                      provider.operatingMode,
                      style: const TextStyle(color: OrkaTheme.primary, fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 28),

              // Hero Heading
              const Text(
                'Tell it the outcome.\nIt handles the work.',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                  height: 1.2,
                ),
              ),
              const SizedBox(height: 20),

              // Command Control Input Box
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: OrkaTheme.surface,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: OrkaTheme.primary.withValues(alpha: 0.3)),
                  boxShadow: [
                    BoxShadow(
                      color: OrkaTheme.primary.withValues(alpha: 0.1),
                      blurRadius: 20,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    TextField(
                      controller: _inputController,
                      style: const TextStyle(color: Colors.white, fontSize: 14),
                      maxLines: 3,
                      decoration: const InputDecoration(
                        hintText: 'What outcome should I take care of?',
                        hintStyle: TextStyle(color: OrkaTheme.textMuted, fontSize: 14),
                        border: InputBorder.none,
                      ),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        IconButton(
                          icon: Icon(
                            provider.isListening ? Icons.mic : Icons.mic_none,
                            color: provider.isListening ? OrkaTheme.error : OrkaTheme.primary,
                          ),
                          onPressed: () {
                            provider.toggleVoiceListening((recognizedText) {
                              _inputController.text = recognizedText;
                            });
                          },
                        ),
                        ElevatedButton.icon(
                          onPressed: provider.isLoading
                              ? null
                              : () => _submitGoal(_inputController.text),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: OrkaTheme.primary,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                          ),
                          icon: provider.isLoading
                              ? const SizedBox(
                                  width: 16,
                                  height: 16,
                                  child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                )
                              : const Icon(Icons.arrow_forward, size: 18),
                          label: const Text('Execute', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Quick Suggested Outcome Chips
              const Text('SUGGESTED OUTCOMES', style: TextStyle(color: OrkaTheme.textMuted, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.1)),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  _buildChip('Prepare me for my meeting tomorrow', Icons.business_center_outlined),
                  _buildChip('Give me my daily brief', Icons.today_outlined),
                  _buildChip('Find what needs my attention today', Icons.notification_important_outlined),
                  _buildChip('Follow up with people waiting on me', Icons.mark_email_unread_outlined),
                ],
              ),
              const SizedBox(height: 28),

              // How Orka Works Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.02),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.white10),
                ),
                child: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.layers_outlined, color: OrkaTheme.secondary, size: 18),
                        SizedBox(width: 8),
                        Text('HOW ORKA WORKS', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    SizedBox(height: 8),
                    Text(
                      'GOAL → CONTEXT → PLAN → EXECUTE → VERIFY',
                      style: TextStyle(color: OrkaTheme.success, fontSize: 11, fontWeight: FontWeight.bold, fontFamily: 'monospace'),
                    ),
                    SizedBox(height: 4),
                    Text(
                      'Decomposes natural intent, scans Gmail & Drive context, executes tools, and verifies outcomes.',
                      style: TextStyle(color: OrkaTheme.textSecondary, fontSize: 11),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildChip(String text, IconData icon) {
    return ActionChip(
      avatar: Icon(icon, size: 16, color: OrkaTheme.primary),
      label: Text(text, style: const TextStyle(color: Colors.white, fontSize: 12)),
      backgroundColor: OrkaTheme.surface,
      side: const BorderSide(color: OrkaTheme.surfaceBorder),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      onPressed: () {
        _inputController.text = text;
        _submitGoal(text);
      },
    );
  }
}
