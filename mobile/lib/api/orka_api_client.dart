// ignore_for_file: use_null_aware_elements
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../core/constants.dart';
import '../models/workflow.dart';
import '../models/result.dart';
import '../models/activity.dart';
import '../models/automation.dart';

class OrkaApiClient {
  static final String _baseUrl = AppConstants.apiBaseUrl;

  static Future<Map<String, dynamic>> getStatus() async {
    final response = await http.get(Uri.parse('$_baseUrl/api/auth/status'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    throw Exception('Failed to connect to Orka backend: ${response.statusCode}');
  }

  static Future<WorkflowExecution> executeOutcome(String prompt, {String mode = 'COPILOT'}) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/api/agent/execute'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'prompt': prompt, 'mode': mode}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return WorkflowExecution.fromJson(data['workflow']);
    }
    throw Exception('Execution failed: ${response.body}');
  }

  static Future<WorkflowExecution> advanceWorkflow(String workflowId) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/api/agent/workflow/$workflowId/advance'),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return WorkflowExecution.fromJson(data['workflow']);
    }
    throw Exception('Failed to advance step: ${response.body}');
  }

  static Future<WorkflowExecution> approveStep(
    String workflowId,
    String stepId, {
    String? to,
    String? subject,
    String? body,
  }) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/api/agent/workflow/$workflowId/approve'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'stepId': stepId,
        if (to != null) 'to': to,
        if (subject != null) 'subject': subject,
        if (body != null) 'body': body,
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return WorkflowExecution.fromJson(data['workflow']);
    }
    throw Exception('Failed to approve step: ${response.body}');
  }

  static Future<ExecutionResult?> getResult(String workflowId) async {
    // For demo/real parity, fetching execution state brings full result payload
    final response = await http.post(
      Uri.parse('$_baseUrl/api/agent/workflow/$workflowId/advance'),
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['workflow']['result'] != null) {
        return ExecutionResult.fromJson(data['workflow']['result']);
      }
    }
    return null;
  }

  static Future<List<ActivityLogItem>> getActivity() async {
    final response = await http.get(Uri.parse('$_baseUrl/api/activity'));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return (data['activities'] as List? ?? [])
          .map((a) => ActivityLogItem.fromJson(a))
          .toList();
    }
    return [];
  }

  static Future<List<AutomationRule>> getAutomations() async {
    final response = await http.get(Uri.parse('$_baseUrl/api/automations'));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return (data['automations'] as List? ?? [])
          .map((a) => AutomationRule.fromJson(a))
          .toList();
    }
    return [];
  }
}
