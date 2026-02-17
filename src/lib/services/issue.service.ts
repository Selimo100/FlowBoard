import { IssueRepo, type Issue } from '../repositories/issue.repo';

export const IssueService = {
  async getAllIssues() {
    return await IssueRepo.findAll();
  },

  async getIssueById(id: string) {
    return await IssueRepo.findById(id);
  },

  async createIssue(projectId: string, title: string, status: Issue['status'] = 'todo', description?: string) {
    if (!title) throw new Error('Issue title is required');
    if (!projectId) throw new Error('Project ID is required');

    return await IssueRepo.create({
      projectId,
      title,
      status,
      description
    });
  },

  async updateIssue(id: string, data: Partial<Issue>) {
    return await IssueRepo.update(id, data);
  },

  async deleteIssue(id: string) {
    return await IssueRepo.delete(id);
  }
};
