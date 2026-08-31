import 'package:flutter/material.dart';
import '../api/orka_api_client.dart';
import '../models/activity.dart';
import '../widgets/tactile_widgets.dart';
import '../core/theme.dart';

class ActivityScreen extends StatefulWidget {
  const ActivityScreen({super.key});

  @override
  State<ActivityScreen> createState() => _ActivityScreenState();
}

class _ActivityScreenState extends State<ActivityScreen> {
  late Future<List<ActivityLogItem>> _activityFuture;

  @override
  void initState() {
    super.initState();
    _activityFuture = OrkaApiClient.getActivity();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ACTIVITY AUDIT LOG', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white, fontFamily: 'monospace')),
      ),
      body: FutureBuilder<List<ActivityLogItem>>(
        future: _activityFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: OrkaTheme.primary));
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}', style: const TextStyle(color: OrkaTheme.error)));
          }

          final activities = snapshot.data ?? [];
          if (activities.isEmpty) {
            return const Center(child: Text('No activity logged.', style: TextStyle(color: OrkaTheme.textMuted)));
          }

          return ListView.builder(
            padding: const EdgeInsets.all(20),
            itemCount: activities.length,
            itemBuilder: (context, index) {
              final act = activities[index];
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: GlassCardWidget(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      const Icon(Icons.check_circle_outline, color: OrkaTheme.success, size: 20),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(act.goal, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 4),
                            Text('${act.timestamp} • ${act.actionsCount} actions completed', style: const TextStyle(color: OrkaTheme.textSecondary, fontSize: 11)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
