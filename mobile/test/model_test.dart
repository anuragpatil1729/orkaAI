import 'package:flutter_test/flutter_test.dart';
import 'package:orka/models/workflow.dart';
import 'package:orka/models/activity.dart';
import 'package:orka/models/automation.dart';

void main() {
  group('Orka Mobile Data Models Unit Tests', () {
    test('WorkflowStep JSON parsing', () {
      final json = {
        'id': 'step_1',
        'name': 'Find Calendar Event',
        'tool': 'find_calendar_event',
        'description': 'Searching calendar',
        'risk': 'READ',
        'requiresApproval': false,
        'status': 'completed',
        'verified': true,
        'whyExplanation': 'Verifies meeting details'
      };

      final step = WorkflowStep.fromJson(json);
      expect(step.id, 'step_1');
      expect(step.name, 'Find Calendar Event');
      expect(step.tool, 'find_calendar_event');
      expect(step.status, 'completed');
      expect(step.verified, true);
    });

    test('ActivityLogItem JSON parsing', () {
      final json = {
        'id': 'act_101',
        'timestamp': '10:00 AM',
        'goal': 'Prepare meeting brief',
        'actionsCount': 5,
        'status': 'Completed'
      };

      final activity = ActivityLogItem.fromJson(json);
      expect(activity.id, 'act_101');
      expect(activity.goal, 'Prepare meeting brief');
      expect(activity.actionsCount, 5);
      expect(activity.status, 'Completed');
    });

    test('AutomationRule JSON parsing', () {
      final json = {
        'id': 'rule_1',
        'title': 'Pre-Meeting Briefing',
        'description': 'Auto compile brief',
        'trigger': 'Calendar event',
        'condition': 'External attendees',
        'actions': ['Find calendar event', 'Generate brief'],
        'active': true,
        'executionsCount': 10,
        'approvalsRequiredCount': 5,
        'category': 'meeting'
      };

      final rule = AutomationRule.fromJson(json);
      expect(rule.id, 'rule_1');
      expect(rule.title, 'Pre-Meeting Briefing');
      expect(rule.active, true);
    });
  });
}
