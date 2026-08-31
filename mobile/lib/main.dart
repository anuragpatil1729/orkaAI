import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme.dart';
import 'providers/workflow_provider.dart';
import 'screens/home_screen.dart';
import 'screens/execution_screen.dart';
import 'screens/result_screen.dart';
import 'screens/activity_screen.dart';
import 'screens/automations_screen.dart';
import 'screens/settings_screen.dart';
import 'widgets/nav_bottom_bar.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => WorkflowProvider()),
      ],
      child: const OrkaApp(),
    ),
  );
}

class OrkaApp extends StatelessWidget {
  const OrkaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'OrkaAI',
      debugShowCheckedModeBanner: false,
      theme: OrkaTheme.darkTheme,
      home: const MainNavigationScreen(),
    );
  }
}

class MainNavigationScreen extends StatelessWidget {
  const MainNavigationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<WorkflowProvider>(context);

    // If an execution workflow is active or completed, route directly to Execution or Result screens
    Widget currentBody;
    if (provider.result != null) {
      currentBody = const ResultScreen();
    } else if (provider.execution != null) {
      currentBody = const ExecutionScreen();
    } else {
      switch (provider.currentTab) {
        case 0:
          currentBody = const HomeScreen();
          break;
        case 1:
          currentBody = const ActivityScreen();
          break;
        case 2:
          currentBody = const AutomationsScreen();
          break;
        case 3:
          currentBody = const SettingsScreen();
          break;
        default:
          currentBody = const HomeScreen();
      }
    }

    return Scaffold(
      body: currentBody,
      bottomNavigationBar: NavBottomBar(
        currentIndex: provider.currentTab,
        onTap: (index) {
          if (provider.execution != null) {
            provider.resetWorkflow();
          }
          provider.setTab(index);
        },
      ),
    );
  }
}
