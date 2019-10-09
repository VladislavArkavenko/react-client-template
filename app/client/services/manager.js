import api from '../utils/api';

class ManagerService {
  static getRadarScores(managerId) {
    return api.get(`/opinion/manager/${managerId}/radar_scores/`);
  }

  static getSatisfiedClients(managerId) {
    return api.get(`/opinion/manager/${managerId}/avg_satisfaction/`);
  }
}

export default ManagerService;
