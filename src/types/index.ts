export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  completed: boolean;
  tags: string[];
  assignees?: string[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  color: string;
  tags: string[];
  pinned: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date: string;
  color: string;
  type: 'task' | 'meeting' | 'reminder';
}

export interface User {
  name: string;
  avatar: string;
  email: string;
  profileCompletion: number;
}

export type Tab = 'home' | 'notes' | 'calendar' | 'productivity' | 'browse';

export interface WeeklyGoal {
  total: number;
  completed: number;
  title: string;
}

export interface DailyActivity {
  day: string;
  completed: number;
  total: number;
  color: string;
}