import 'package:flutter/material.dart';
import '../core/theme.dart';

class NavBottomBar extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const NavBottomBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: currentIndex,
      onTap: onTap,
      backgroundColor: const Color(0xFF0F111A),
      selectedItemColor: OrkaTheme.primary,
      unselectedItemColor: OrkaTheme.textMuted,
      type: BottomNavigationBarType.fixed,
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.home_outlined),
          activeIcon: Icon(Icons.home),
          label: 'Home',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.history_outlined),
          activeIcon: Icon(Icons.history),
          label: 'Activity',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.bolt_outlined),
          activeIcon: Icon(Icons.bolt),
          label: 'Automations',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.settings_outlined),
          activeIcon: Icon(Icons.settings),
          label: 'Settings',
        ),
      ],
    );
  }
}
