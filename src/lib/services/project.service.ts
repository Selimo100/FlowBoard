// Explanation: This service layer handles the business logic for projects.
// It acts as an intermediary between the API/Page and the Repository.
// It validates input (like ensuring a name exists) before asking the repository to save data.

import { ProjectRepo, type Project } from '../repositories/project.repo';

export const ProjectService = {
  async getAllProjects() {
    return await ProjectRepo.findAll();
  },

  async getProjectById(id: string) {
    return await ProjectRepo.findById(id);
  },

  async createProject(name: string, description?: string, repositoryUrl?: string) {
    if (!name) throw new Error('Project name is required');
    return await ProjectRepo.create({ name, description, repositoryUrl });
  },

  async updateProject(id: string, data: Partial<Project>) {
    return await ProjectRepo.update(id, data);
  },

  async deleteProject(id: string) {
    return await ProjectRepo.delete(id);
  }
};
