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
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // 1. Brand Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: OrkaTheme.primary.withValues(alpha: 0.25),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: OrkaTheme.primary.withValues(alpha: 0.4)),
                          boxShadow: const [
                            BoxShadow(color: Color(0x403B82F6), blurRadius: 12),
                          ],
                        ),
                        child: const Icon(Icons.auto_awesome, color: OrkaTheme.cyanGlow, size: 20),
                      ),
                      const SizedBox(width: 10),
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('OrkaAI', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900)),
                          Text('AI Execution OS', style: TextStyle(color: OrkaTheme.cyanGlow, fontSize: 10, fontWeight: FontWeight.w600)),
                        ],
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                    decoration: BoxDecoration(
                      color: OrkaTheme.cyanGlow.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: OrkaTheme.cyanGlow.withValues(alpha: 0.4)),
                      boxShadow: const [
                        BoxShadow(color: Color(0x3042DFF5), blurRadius: 10),
                      ],
                    ),
                    child: Text(
                      provider.operatingMode,
                      style: const TextStyle(color: OrkaTheme.cyanGlow, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.8),
                    ),
                  ),
                ],
              ),

              // 2. Hero Heading (Target Image 2 Typography)
              const Text(
                'Prepare me\nfor tomorrow.',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 28,
                  fontWeight: FontWeight.w900,
                  height: 1.15,
                ),
              ),

              // 3. Command Center Glass Surface
              GlassCardWidget(
                padding: const EdgeInsets.all(16),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: _inputController,
                      style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600),
                      maxLines: 2,
                      decoration: const InputDecoration(
                        hintText: 'What outcome should I take care of?',
                        hintStyle: TextStyle(color: OrkaTheme.textMuted, fontSize: 13),
                        border: InputBorder.none,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          decoration: BoxDecoration(
                            color: provider.isListening ? OrkaTheme.cyanGlow.withValues(alpha: 0.25) : const Color(0x20FFFFFF),
                            shape: BoxShape.circle,
                            border: Border.all(color: provider.isListening ? OrkaTheme.cyanGlow : const Color(0x30FFFFFF)),
                            boxShadow: provider.isListening
                                ? [BoxShadow(color: OrkaTheme.cyanGlow.withValues(alpha: 0.7), blurRadius: 12)]
                                : null,
                          ),
                          child: IconButton(
                            iconSize: 20,
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

              // 4. Active Workflow Progress Gauge Card (Image 2 Radial Arc Gauge)
              GlassCardWidget(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('ACTIVE WORKFLOW', style: TextStyle(color: OrkaTheme.cyanGlow, fontSize: 9, fontWeight: FontWeight.bold, fontFamily: 'monospace')),
                          SizedBox(height: 4),
                          Text('Prepare me for tomorrow\'s sync', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
                          SizedBox(height: 4),
                          Text('Gmail ✓ • Calendar ✓ • Drive ●', style: TextStyle(color: OrkaTheme.textSecondary, fontSize: 10)),
                        ],
                      ),
                    ),
                    const ProgressGaugeWidget(progress: 0.68, title: 'Progress'),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
