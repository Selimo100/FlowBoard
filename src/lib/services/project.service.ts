// Explanation: This service layer handles the business logic for projects.
// It acts as an intermediary between the API/Page and the Repository.
// It validates input (like ensuring a name exists) before asking the repository to save data.

import { ProjectRepo, type Project } from '../repositories/project.repo';

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    // Allow git@ format
    return /^git@[\w.-]+:[\w./-]+$/.test(url);
  }
};

export const ProjectService = {
  async getAllProjects(includeArchived = false) {
    return await ProjectRepo.findAll(includeArchived);
  },

  async getProjectById(id: string) {
    return await ProjectRepo.findById(id);
  },

  async createProject(name: string, description?: string, repositoryUrl?: string) {
    if (!name) throw new Error('Project name is required');
    if (repositoryUrl && !isValidUrl(repositoryUrl)) {
      throw new Error('Invalid repository URL');
    }
    return await ProjectRepo.create({ name, description, repositoryUrl });
  },

  async updateProject(id: string, data: Partial<Project>) {
    if (data.repositoryUrl && !isValidUrl(data.repositoryUrl)) {
      throw new Error('Invalid repository URL');
    }
    return await ProjectRepo.update(id, data);
  },

  async deleteProject(id: string) {
    return await ProjectRepo.delete(id);
  }
};
