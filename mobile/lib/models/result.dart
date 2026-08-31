class ExecutiveBrief {
  final String title;
  final String summary;
  final List<String> keyInsights;
  final List<String> unresolvedItems;

  ExecutiveBrief({
    required this.title,
    required this.summary,
    required this.keyInsights,
    required this.unresolvedItems,
  });

  factory ExecutiveBrief.fromJson(Map<String, dynamic> json) {
    return ExecutiveBrief(
      title: json['title'] ?? '',
      summary: json['summary'] ?? '',
      keyInsights: List<String>.from(json['keyInsights'] ?? []),
      unresolvedItems: List<String>.from(json['unresolvedItems'] ?? []),
    );
  }
}

class EmailDraft {
  final String id;
  final String to;
  final String subject;
  final String body;

  EmailDraft({
    required this.id,
    required this.to,
    required this.subject,
    required this.body,
  });

  factory EmailDraft.fromJson(Map<String, dynamic> json) {
    return EmailDraft(
      id: json['id'] ?? '',
      to: json['to'] ?? '',
      subject: json['subject'] ?? '',
      body: json['body'] ?? '',
    );
  }
}

class ExecutionReceipt {
  final String receiptId;
  final String goal;
  final double executionTimeSeconds;
  final int actionsTotal;
  final int actionsVerified;
  final int approvalsRequired;
  final int approvalsGranted;

  ExecutionReceipt({
    required this.receiptId,
    required this.goal,
    required this.executionTimeSeconds,
    required this.actionsTotal,
    required this.actionsVerified,
    required this.approvalsRequired,
    required this.approvalsGranted,
  });

  factory ExecutionReceipt.fromJson(Map<String, dynamic> json) {
    return ExecutionReceipt(
      receiptId: json['receiptId'] ?? '',
      goal: json['goal'] ?? '',
      executionTimeSeconds: (json['executionTimeSeconds'] ?? 4.2).toDouble(),
      actionsTotal: json['actionsTotal'] ?? 7,
      actionsVerified: json['actionsVerified'] ?? 6,
      approvalsRequired: json['approvalsRequired'] ?? 1,
      approvalsGranted: json['approvalsGranted'] ?? 1,
    );
  }
}

class ExecutionResult {
  final ExecutiveBrief brief;
  final EmailDraft? draftEmail;
  final List<String> tasks;
  final ExecutionReceipt? receipt;

  ExecutionResult({
    required this.brief,
    this.draftEmail,
    required this.tasks,
    this.receipt,
  });

  factory ExecutionResult.fromJson(Map<String, dynamic> json) {
    return ExecutionResult(
      brief: ExecutiveBrief.fromJson(json['brief'] ?? {}),
      draftEmail: json['draftEmail'] != null
          ? EmailDraft.fromJson(json['draftEmail'])
          : null,
      tasks: (json['tasks'] as List? ?? []).map((t) => t['title'].toString()).toList(),
      receipt: json['receipt'] != null
          ? ExecutionReceipt.fromJson(json['receipt'])
          : null,
    );
  }
}
