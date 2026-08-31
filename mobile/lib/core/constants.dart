import 'dart:io';
import 'package:flutter/foundation.dart';

class AppConstants {
  static const String appName = 'OrkaAI';
  static const String tagline = 'Tell it the outcome. It handles the work.';

  /// Resolves the Orka backend API base URL automatically:
  /// - Android Emulator: 10.0.2.2:3001
  /// - Desktop / Web / iOS simulator: localhost:3001
  static String get apiBaseUrl {
    if (kIsWeb) {
      return 'http://localhost:3001';
    } else if (Platform.isAndroid) {
      return 'http://10.0.2.2:3001';
    }
    return 'http://localhost:3001';
  }
}
