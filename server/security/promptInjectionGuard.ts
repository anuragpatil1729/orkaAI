export class PromptInjectionGuard {
  /**
   * Sanitizes untrusted email content to ensure it is treated strictly as DATA,
   * never as system instructions.
   */
  public static sanitizeEmailBody(rawBody: string): string {
    if (!rawBody) return '';

    // Strip suspicious instruction overrides
    let sanitized = rawBody
      .replace(/ignore\s+(all\s+)?(previous\s+)?instructions/gi, '[INSTRUCTION_OVERRIDE_REMOVED]')
      .replace(/disregard\s+(all\s+)?(prior\s+)?rules/gi, '[INSTRUCTION_OVERRIDE_REMOVED]')
      .replace(/you\s+are\s+now\s+a/gi, '[ROLE_OVERRIDE_REMOVED]')
      .replace(/system\s+prompt\s+override/gi, '[SYSTEM_OVERRIDE_REMOVED]');

    // Truncate excessively long payloads
    if (sanitized.length > 8000) {
      sanitized = sanitized.substring(0, 8000) + '... [TRUNCATED]';
    }

    return sanitized;
  }

  /**
   * Evaluates whether an email intent contains malicious instruction override patterns
   */
  public static isMaliciousPayload(emailSubject: string, emailBody: string): boolean {
    const combined = (emailSubject + ' ' + emailBody).toLowerCase();
    const maliciousPatterns = [
      'ignore all previous instructions',
      'send credentials',
      'upload secrets',
      'delete the repository',
      'rm -rf',
      'chmod 777',
      'sudo'
    ];

    return maliciousPatterns.some(pattern => combined.includes(pattern));
  }
}
