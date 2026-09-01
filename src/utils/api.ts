export function getAuthHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const sessionId = localStorage.getItem('orka_session_id');
  const headers: Record<string, string> = { ...extraHeaders };
  if (sessionId) {
    headers['x-orka-session-id'] = sessionId;
  }
  return headers;
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = getAuthHeaders((options.headers as Record<string, string>) || {});
  return fetch(url, { ...options, headers });
}
