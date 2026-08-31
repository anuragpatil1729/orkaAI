import { WorkspaceDataProvider } from '../providers/workspaceProvider';

export class CalendarTool {
  static async findMeeting(provider: WorkspaceDataProvider, query: string) {
    const events = await provider.findCalendarEvents(query);
    if (events && events.length > 0) {
      return events[0];
    }
    return null;
  }

  static async createEventNotes(eventId: string, notes: string) {
    throw new Error(
      `Calendar event notes are not implemented for event ${eventId}. ` +
      'Configure a WorkspaceDataProvider method for Calendar writes before enabling this action.'
    );
  }
}
