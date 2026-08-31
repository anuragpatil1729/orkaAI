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
    return {
      eventId,
      status: 'updated',
      notesAttached: true
    };
  }
}
