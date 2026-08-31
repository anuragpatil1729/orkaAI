import { ACMEMOCK_DATA } from '../data/demoStore';

export class CalendarTool {
  static async findMeeting(query: string) {
    return ACMEMOCK_DATA.meeting;
  }

  static async createEventNotes(eventId: string, notes: string) {
    return {
      eventId,
      status: 'updated',
      notesAttached: true
    };
  }
}
