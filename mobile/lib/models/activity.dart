class ActivityLogItem {
  final String id;
  final String timestamp;
  final String goal;
  final int actionsCount;
  final String status;

  ActivityLogItem({
    required this.id,
    required this.timestamp,
    required this.goal,
    required this.actionsCount,
    required this.status,
  });

  factory ActivityLogItem.fromJson(Map<String, dynamic> json) {
    return ActivityLogItem(
      id: json['id'] ?? '',
      timestamp: json['timestamp'] ?? 'Today',
      goal: json['goal'] ?? '',
      actionsCount: json['actionsCount'] ?? 0,
      status: json['status'] ?? 'Completed',
    );
  }
}
