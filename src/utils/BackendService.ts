import type { Task, Note, CalendarEvent, User, WeeklyGoal, DailyActivity } from './types';

import { supabase } from './supabaseClient';

export class BackendService {
  private static STORAGE_KEY = 'todo_app_data';

  static async fetchData(): Promise<{
    tasks: Task[];
    notes: Note[];
    events: CalendarEvent[];
    user: User;
    weeklyGoal: WeeklyGoal;
    dailyActivity: DailyActivity[];
  } | null> {
    console.log('[Supabase] Fetching all data...');
    
    // Try to get from Supabase first
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .single();

      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*');

      const { data: notes, error: notesError } = await supabase
        .from('notes')
        .select('*');

      if (!profileError && profile) {
        return {
          user: profile.user_data,
          tasks: tasks || [],
          notes: notes || [],
          events: profile.events || [],
          weeklyGoal: profile.weekly_goal || {},
          dailyActivity: profile.daily_activity || [],
        };
      }
    } catch (e) {
      console.error('[Supabase] Error fetching data, falling back to local storage', e);
    }

    // Fallback to local storage
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  }

  static async saveData(data: any): Promise<void> {
    console.log('[Supabase] Saving state...', data);
    
    // Save to LocalStorage for offline support
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));

    // Try to sync with Supabase
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: 'default_user', // In a real app, this would be the auth user id
          user_data: data.user,
          events: data.events,
          weekly_goal: data.weeklyGoal,
          daily_activity: data.dailyActivity
        });

      // Sync tasks and notes individually if needed
      // For now, we'll focus on the profile blob for speed
      if (error) throw error;
    } catch (e) {
      console.warn('[Supabase] Sync failed, will retry later', e);
    }
  }

  static async updateTask(task: Task): Promise<void> {
    console.log('[Supabase] Updating task...', task);
    try {
      await supabase
        .from('tasks')
        .upsert({ id: task.id, ...task });
    } catch (e) {
      console.error('[Supabase] Task update failed', e);
    }
  }
}
