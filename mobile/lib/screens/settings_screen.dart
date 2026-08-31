import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/workflow_provider.dart';
import '../api/orka_api_client.dart';
import '../core/theme.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  late Future<Map<String, dynamic>> _statusFuture;

  @override
  void initState() {
    super.initState();
    _statusFuture = OrkaApiClient.getStatus();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<WorkflowProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('SETTINGS & CONNECTIONS', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white)),
      ),
      body: FutureBuilder<Map<String, dynamic>>(
        future: _statusFuture,
        builder: (context, snapshot) {
          final data = snapshot.data ?? {};
          final workspace = data['workspace'] ?? {};
          final gemini = data['gemini'] ?? {};

          return ListView(
            padding: const EdgeInsets.all(20),
            children: [
              // Policy Mode Switcher
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: OrkaTheme.surface,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: OrkaTheme.surfaceBorder),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('OPERATING POLICY MODE', style: TextStyle(color: OrkaTheme.textMuted, fontSize: 10, fontWeight: FontWeight.bold)),
                        Text(provider.operatingMode, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 2),
                        Text(
                          provider.operatingMode == 'COPILOT'
                              ? 'Sensitive actions require approval'
                              : 'Safe routines execute automatically',
                          style: const TextStyle(color: OrkaTheme.textSecondary, fontSize: 11),
                        ),
                      ],
                    ),
                    Switch(
                      value: provider.operatingMode == 'AUTOPILOT',
                      onChanged: (val) => provider.toggleOperatingMode(),
                      activeColor: OrkaTheme.primary,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              const Text('CONNECTED WORKSPACE APPS', style: TextStyle(color: OrkaTheme.textMuted, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.1)),
              const SizedBox(height: 12),

              _buildServiceTile('Gmail API', workspace['services']?['gmail'] == true),
              _buildServiceTile('Google Calendar API', workspace['services']?['calendar'] == true),
              _buildServiceTile('Google Drive API', workspace['services']?['drive'] == true),

              const SizedBox(height: 24),
              const Text('SYSTEM & ENGINE INFO', style: TextStyle(color: OrkaTheme.textMuted, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.1)),
              const SizedBox(height: 12),

              _buildInfoTile('Workspace Mode', workspace['mode'] ?? 'DEMO WORKSPACE'),
              _buildInfoTile('Account', workspace['userEmail'] ?? 'alex.v@orka.ai'),
              _buildInfoTile('Gemini Model', gemini['model'] ?? 'gemini-1.5-flash'),
            ],
          );
        },
      ),
    );
  }

  Widget _buildServiceTile(String name, bool connected) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: OrkaTheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: OrkaTheme.surfaceBorder),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(name, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
          Row(
            children: [
              Icon(connected ? Icons.check_circle : Icons.cancel, color: connected ? OrkaTheme.success : OrkaTheme.error, size: 16),
              const SizedBox(width: 6),
              Text(connected ? 'Connected' : 'Disconnected', style: TextStyle(color: connected ? OrkaTheme.success : OrkaTheme.error, fontSize: 11, fontWeight: FontWeight.bold)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInfoTile(String label, String value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.black26,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: OrkaTheme.textMuted, fontSize: 12)),
          Text(value, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
