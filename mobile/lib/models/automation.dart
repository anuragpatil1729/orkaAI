class AutomationRule {
  final String id;
  final String title;
  final String trigger;
  final String condition;
  bool active;

  AutomationRule({
    required this.id,
    required this.title,
    required this.trigger,
    required this.condition,
    required this.active,
  });

  factory AutomationRule.fromJson(Map<String, dynamic> json) {
    return AutomationRule(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      trigger: json['trigger'] ?? '',
      condition: json['condition'] ?? '',
      active: json['active'] ?? true,
    );
  }
}
