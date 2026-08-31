import 'package:flutter/material.dart';
import '../api/orka_api_client.dart';
import '../models/automation.dart';
import '../core/theme.dart';

class AutomationsScreen extends StatefulWidget {
  const AutomationsScreen({super.key});

  @override
  State<AutomationsScreen> createState() => _AutomationsScreenState();
}

class _AutomationsScreenState extends State<AutomationsScreen> {
  late Future<List<AutomationRule>> _automationsFuture;

  @override
  void initState() {
    super.initState();
    _automationsFuture = OrkaApiClient.getAutomations();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ACTIVE AUTOMATIONS', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white)),
      ),
      body: FutureBuilder<List<AutomationRule>>(
        future: _automationsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: OrkaTheme.primary));
          }

          final automations = snapshot.data ?? [];
          return ListView(
            padding: const EdgeInsets.all(20),
            children: [
              // Pattern Discovery Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: OrkaTheme.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: OrkaTheme.primary.withOpacity(0.3)),
                ),
                child: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.auto_awesome, color: OrkaTheme.primary, size: 18),
                        SizedBox(width: 8),
                        Text('AI DISCOVERED PATTERN', style: TextStyle(color: OrkaTheme.primary, fontSize: 11, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    SizedBox(height: 8),
                    Text('Frequent Manual Invoice Workflow Detected', style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                    SizedBox(height: 4),
                    Text('You\'ve manually processed 17 invoice emails from recurring vendors under ₹50,000 this month.', style: TextStyle(color: OrkaTheme.textSecondary, fontSize: 11)),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              const Text('AUTOMATION RULES', style: TextStyle(color: OrkaTheme.textMuted, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.1)),
              const SizedBox(height: 12),

              ...automations.map((auto) {
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: OrkaTheme.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: OrkaTheme.surfaceBorder),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        auto.active ? Icons.bolt : Icons.power_settings_new,
                        color: auto.active ? OrkaTheme.success : OrkaTheme.textMuted,
                        size: 22,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(auto.title, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 2),
                            Text('When ${auto.trigger} • IF ${auto.condition}', style: const TextStyle(color: OrkaTheme.textSecondary, fontSize: 11)),
                          ],
                        ),
                      ),
                      Switch(
                        value: auto.active,
                        onChanged: (val) {},
                        activeColor: OrkaTheme.primary,
                      ),
                    ],
                  ),
                );
              }).toList(),
            ],
          );
        },
      ),
    );
  }
}
