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
                          color: OrkaTheme.primary.withValues(alpha: 0.25),
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(color: OrkaTheme.primary.withValues(alpha: 0.4)),
                          boxShadow: const [
                            BoxShadow(color: Color(0x403B82F6), blurRadius: 15),
                          ],
                        ),
                        child: const Icon(Icons.auto_awesome, color: OrkaTheme.cyanGlow, size: 22),
                      ),
                      const SizedBox(width: 12),
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('OrkaAI', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w900)),
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
                        BoxShadow(color: Color(0x3042DFF5), blurRadius: 12),
                      ],
                    ),
                    child: Text(
                      provider.operatingMode,
                      style: const TextStyle(color: OrkaTheme.cyanGlow, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.8),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Hero Heading (Target Image 2 Typography)
              const Text(
                'Prepare me\nfor tomorrow.',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 32,
                  fontWeight: FontWeight.w900,
                  height: 1.15,
                ),
              ),
              const SizedBox(height: 20),

              // Command Center Glass Surface
              GlassCardWidget(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    TextField(
                      controller: _inputController,
                      style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w600),
                      maxLines: 3,
                      decoration: const InputDecoration(
                        hintText: 'What outcome should I take care of?',
                        hintStyle: TextStyle(color: OrkaTheme.textMuted, fontSize: 14),
                        border: InputBorder.none,
                      ),
                    ),
                    const SizedBox(height: 14),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          decoration: BoxDecoration(
                            color: provider.isListening ? OrkaTheme.cyanGlow.withValues(alpha: 0.25) : const Color(0x20FFFFFF),
                            shape: BoxShape.circle,
                            border: Border.all(color: provider.isListening ? OrkaTheme.cyanGlow : const Color(0x30FFFFFF)),
                            boxShadow: provider.isListening
                                ? [BoxShadow(color: OrkaTheme.cyanGlow.withValues(alpha: 0.7), blurRadius: 15)]
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
              const SizedBox(height: 24),

              // Active Workflow Progress Gauge Card (Image 2 Radial Arc Gauge)
              GlassCardWidget(
                padding: const EdgeInsets.all(18),
                child: Row(
                  children: [
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('ACTIVE WORKFLOW', style: TextStyle(color: OrkaTheme.cyanGlow, fontSize: 10, fontWeight: FontWeight.bold, fontFamily: 'monospace')),
                          SizedBox(height: 6),
                          Text('Prepare me for tomorrow\'s sync', style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                          SizedBox(height: 4),
                          Text('Gmail ✓ • Calendar ✓ • Drive ●', style: TextStyle(color: OrkaTheme.textSecondary, fontSize: 11)),
                        ],
                      ),
                    ),
                    const ProgressGaugeWidget(progress: 0.68, title: 'Progress'),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Suggested Outcome Chips
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
      borderRadius: BorderRadius.circular(24),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: const Color(0x20FFFFFF),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: const Color(0x30FFFFFF)),
          boxShadow: const [
            BoxShadow(color: Color(0x20000000), blurRadius: 10, offset: Offset(0, 4)),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 16, color: OrkaTheme.primaryBright),
            const SizedBox(width: 8),
            Text(text, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }
}
