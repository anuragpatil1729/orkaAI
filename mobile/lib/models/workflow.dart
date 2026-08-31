class WorkflowStep {
  final String id;
  final String name;
  final String tool;
  final String description;
  final String risk;
  final bool requiresApproval;
  final String status; // 'pending', 'running', 'completed', 'waiting_approval', 'failed'
  final String? reasoningSnippet;
  final String? whyExplanation;
  final bool verified;

  WorkflowStep({
    required this.id,
    required this.name,
    required this.tool,
    required this.description,
    required this.risk,
    required this.requiresApproval,
    required this.status,
    this.reasoningSnippet,
    this.whyExplanation,
    this.verified = false,
  });

  factory WorkflowStep.fromJson(Map<String, dynamic> json) {
    return WorkflowStep(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      tool: json['tool'] ?? '',
      description: json['description'] ?? '',
      risk: json['risk'] ?? 'READ',
      requiresApproval: json['requiresApproval'] ?? false,
      status: json['status'] ?? 'pending',
      reasoningSnippet: json['reasoningSnippet'],
      whyExplanation: json['whyExplanation'],
      verified: json['verified'] ?? false,
    );
  }
}

class ApprovalRequest {
  final String stepId;
  final String actionName;
  final String toolName;
  final String? targetRecipient;
  final String? subject;
  final String contentPreview;
  final String riskReason;

  ApprovalRequest({
    required this.stepId,
    required this.actionName,
    required this.toolName,
    this.targetRecipient,
    this.subject,
    required this.contentPreview,
    required this.riskReason,
  });

  factory ApprovalRequest.fromJson(Map<String, dynamic> json) {
    return ApprovalRequest(
      stepId: json['stepId'] ?? '',
      actionName: json['actionName'] ?? '',
      toolName: json['toolName'] ?? '',
      targetRecipient: json['targetRecipient'],
      subject: json['subject'],
      contentPreview: json['contentPreview'] ?? '',
      riskReason: json['riskReason'] ?? '',
    );
  }
}

class WorkflowExecution {
  final String id;
  final String prompt;
  final String mode;
  final String status; // 'idle', 'running', 'waiting_approval', 'completed', 'failed'
  final String? currentStepId;
  final List<WorkflowStep> steps;
  final ApprovalRequest? approvalRequest;

  WorkflowExecution({
    required this.id,
    required this.prompt,
    required this.mode,
    required this.status,
    this.currentStepId,
    required this.steps,
    this.approvalRequest,
  });

  factory WorkflowExecution.fromJson(Map<String, dynamic> json) {
    return WorkflowExecution(
      id: json['id'] ?? '',
      prompt: json['prompt'] ?? '',
      mode: json['mode'] ?? 'COPILOT',
      status: json['status'] ?? 'idle',
      currentStepId: json['currentStepId'],
      steps: (json['steps'] as List? ?? [])
          .map((s) => WorkflowStep.fromJson(s))
          .toList(),
      approvalRequest: json['approvalRequest'] != null
          ? ApprovalRequest.fromJson(json['approvalRequest'])
          : null,
    );
  }
}
