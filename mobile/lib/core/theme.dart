import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class OrkaTheme {
  // Neo-Tactile Shared System Color Tokens
  static const Color background = Color(0xFF080B10);
  static const Color backgroundDarker = Color(0xFF0B0F15);
  static const Color surfaceCard = Color(0xFF10151D);
  static const Color glassSurface = Color(0x14FFFFFF);
  static const Color glassBorder = Color(0x20FFFFFF);
  static const Color glassBorderStrong = Color(0x35FFFFFF);

  static const Color primary = Color(0xFF3B82F6); // Core Electric Blue
  static const Color primarySecondary = Color(0xFF2563EB);
  static const Color primaryBright = Color(0xFF4F8CFF);

  static const Color cyanGlow = Color(0xFF22D3EE); // Core Cyan AI Energy
  static const Color cyanBright = Color(0xFF67E8F9);

  static const Color textPrimary = Color(0xFFF8FAFC);
  static const Color textSecondary = Color(0xFFCBD5E1);
  static const Color textMuted = Color(0xFF94A3B8);
  static const Color textDisabled = Color(0xFF64748B);

  static const Color success = Color(0xFF34D399); // Restrained Green
  static const Color warning = Color(0xFFFBBF24); // Restrained Warning
  static const Color error = Color(0xFFFB7185); // Restrained Error

  // Glass Card Box Decoration
  static BoxDecoration get neoGlassCard => BoxDecoration(
        color: const Color(0x12FFFFFF),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0x25FFFFFF), width: 1.2),
        boxShadow: const [
          BoxShadow(
            color: Color(0x60000000),
            blurRadius: 30,
            offset: Offset(0, 15),
          ),
          BoxShadow(
            color: Color(0x2522D3EE),
            blurRadius: 20,
            spreadRadius: -4,
          ),
        ],
      );

  // Tactile Primary Electric Blue Button Decoration
  static BoxDecoration get neoPrimaryButton => BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF3B82F6), Color(0xFF2563EB)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [
          BoxShadow(
            color: Color(0x603B82F6),
            blurRadius: 20,
            offset: Offset(0, 8),
          ),
        ],
      );

  // Tactile Light Pill Button Decoration
  static BoxDecoration get neoLightButton => BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFFFFFFF), Color(0xFFE2E8F0)],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [
          BoxShadow(
            color: Color(0x40000000),
            blurRadius: 15,
            offset: Offset(0, 6),
          ),
        ],
      );

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: background,
      primaryColor: primary,
      colorScheme: const ColorScheme.dark(
        primary: primary,
        secondary: cyanGlow,
        surface: surfaceCard,
        error: error,
      ),
      textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme).copyWith(
        displayLarge: GoogleFonts.inter(fontSize: 32, fontWeight: FontWeight.bold, color: textPrimary),
        titleLarge: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.bold, color: textPrimary),
        titleMedium: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: textPrimary),
        bodyLarge: GoogleFonts.inter(fontSize: 14, color: textPrimary),
        bodyMedium: GoogleFonts.inter(fontSize: 12, color: textSecondary),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: background,
        elevation: 0,
        centerTitle: false,
      ),
      cardTheme: CardThemeData(
        color: surfaceCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: const BorderSide(color: glassBorder, width: 1.2),
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Color(0xFF06080D),
        selectedItemColor: primary,
        unselectedItemColor: textMuted,
        type: BottomNavigationBarType.fixed,
        elevation: 20,
      ),
    );
  }
}
