import type { Task } from '../types';
import { BackendService } from '../utils/BackendService';

export class TaskModel {
  static async getAllTasks(): Promise<Task[]> {
    const data = await BackendService.fetchData();
    return data?.tasks || [];
  }

  static async addTask(task: Task): Promise<void> {
    await BackendService.updateTask(task);
  }

  static calculateProgress(tasks: Task[]): number {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  }
}
