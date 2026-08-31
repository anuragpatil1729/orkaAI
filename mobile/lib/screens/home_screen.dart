import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/workflow_provider.dart';
import '../core/theme.dart';
import '../widgets/tactile_widgets.dart';

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
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: OrkaTheme.primary.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: OrkaTheme.primary.withValues(alpha: 0.4)),
                          boxShadow: const [
                            BoxShadow(color: Color(0x303B82F6), blurRadius: 12),
                          ],
                        ),
                        child: const Icon(Icons.auto_awesome, color: OrkaTheme.cyanGlow, size: 22),
                      ),
                      const SizedBox(width: 12),
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('OrkaAI', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w800)),
                          Text('AI Execution OS', style: TextStyle(color: OrkaTheme.cyanGlow, fontSize: 11, fontWeight: FontWeight.w600)),
                        ],
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: OrkaTheme.cyanGlow.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: OrkaTheme.cyanGlow.withValues(alpha: 0.4)),
                      boxShadow: const [
                        BoxShadow(color: Color(0x2522D3EE), blurRadius: 10),
                      ],
                    ),
                    child: Text(
                      provider.operatingMode,
                      style: const TextStyle(color: OrkaTheme.cyanGlow, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.8),
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
                  height: 1.25,
                ),
              ),
              const SizedBox(height: 20),

              // Neo-Tactile Command Center Box
              GlassCardWidget(
                padding: const EdgeInsets.all(18),
                child: Column(
                  children: [
                    TextField(
                      controller: _inputController,
                      style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w500),
                      maxLines: 3,
                      decoration: const InputDecoration(
                        hintText: 'What outcome should I take care of?',
                        hintStyle: TextStyle(color: OrkaTheme.textMuted, fontSize: 14),
                        border: InputBorder.none,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          decoration: BoxDecoration(
                            color: provider.isListening ? OrkaTheme.cyanGlow.withValues(alpha: 0.2) : const Color(0x1AFFFFFF),
                            shape: BoxShape.circle,
                            border: Border.all(color: provider.isListening ? OrkaTheme.cyanGlow : const Color(0x20FFFFFF)),
                            boxShadow: provider.isListening
                                ? [BoxShadow(color: OrkaTheme.cyanGlow.withValues(alpha: 0.6), blurRadius: 12)]
                                : null,
                          ),
                          child: IconButton(
                            icon: Icon(
                              provider.isListening ? Icons.mic : Icons.mic_none,
                              color: provider.isListening ? OrkaTheme.cyanGlow : OrkaTheme.textSecondary,
                            ),
                            onPressed: () {
                              provider.toggleVoiceListening((recognizedText) {
                                _inputController.text = recognizedText;
                              });
                            },
                          ),
                        ),
                        TactileButtonWidget(
                          label: 'Execute',
                          icon: Icons.arrow_forward_rounded,
                          isLoading: provider.isLoading,
                          onPressed: () => _submitGoal(_inputController.text),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // Quick Suggested Outcome Chips
              const Text('SUGGESTED OUTCOMES', style: TextStyle(color: OrkaTheme.textMuted, fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1.2)),
              const SizedBox(height: 14),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: [
                  _buildChip('Prepare me for my meeting tomorrow', Icons.business_center_outlined),
                  _buildChip('Give me my daily brief', Icons.today_outlined),
                  _buildChip('Find what needs my attention today', Icons.notification_important_outlined),
                  _buildChip('Follow up with people waiting on me', Icons.mark_email_unread_outlined),
                ],
              ),
              const SizedBox(height: 28),

              // How Orka Works Card (Neo-Tactile Glass)
              GlassCardWidget(
                padding: const EdgeInsets.all(18),
                child: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.layers_outlined, color: OrkaTheme.cyanGlow, size: 18),
                        SizedBox(width: 8),
                        Text('HOW ORKA WORKS', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
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
    return InkWell(
      onTap: () {
        _inputController.text = text;
        _submitGoal(text);
      },
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: const Color(0x12FFFFFF),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0x25FFFFFF)),
          boxShadow: const [
            BoxShadow(color: Color(0x20000000), blurRadius: 10, offset: Offset(0, 4)),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 15, color: OrkaTheme.primary),
            const SizedBox(width: 8),
            Text(text, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }
}
