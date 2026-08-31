import { WorkspaceDataProvider } from '../providers/workspaceProvider';

export class DriveTool {
  static async searchDocuments(provider: WorkspaceDataProvider, query: string) {
    return await provider.searchDrive(query);
  }

  static async getDocumentContent(provider: WorkspaceDataProvider, docId: string) {
    return await provider.getDriveDocument(docId);
  }
}
