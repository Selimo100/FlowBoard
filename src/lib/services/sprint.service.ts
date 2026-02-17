import { SprintRepo, type Sprint } from '../repositories/sprint.repo';

export const SprintService = {
  async getAllSprints() {
    return await SprintRepo.findAll();
  },

  async getSprintById(id: string) {
    return await SprintRepo.findById(id);
  },

  async createSprint(projectId: string, name: string, startDate: Date, endDate: Date) {
    if (!name) throw new Error('Sprint name is required');
    return await SprintRepo.create({
      projectId,
      name,
      startDate,
      endDate,
      status: 'future'
    });
  },

  async updateSprint(id: string, data: Partial<Sprint>) {
    return await SprintRepo.update(id, data);
  },

  async deleteSprint(id: string) {
    return await SprintRepo.delete(id);
  }
};
