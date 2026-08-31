import { ACMEMOCK_DATA } from '../data/demoStore';

export class DriveTool {
  static async searchDocuments(query: string) {
    return ACMEMOCK_DATA.documents;
  }

  static async getDocumentContent(docId: string) {
    const doc = ACMEMOCK_DATA.documents.find(d => d.id === docId) || ACMEMOCK_DATA.documents[0];
    return {
      docId: doc.id,
      title: doc.title,
      summary: doc.summary
    };
  }
}
