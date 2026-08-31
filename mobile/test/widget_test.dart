import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:orka/main.dart';
import 'package:orka/providers/workflow_provider.dart';

void main() {
  testWidgets('OrkaApp smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => WorkflowProvider()),
        ],
        child: const OrkaApp(),
      ),
    );
    expect(find.text('OrkaAI'), findsOneWidget);
  });
}
