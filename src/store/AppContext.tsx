import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Task, Note, CalendarEvent, User, Tab, WeeklyGoal, DailyActivity } from '../types';
import { BackendService } from '../utils/BackendService';

interface AppState {
  tasks: Task[];
  notes: Note[];
  events: CalendarEvent[];
  user: User;
  activeTab: Tab;
  weeklyGoal: WeeklyGoal;
  dailyActivity: DailyActivity[];
  selectedDate: Date;
}

type Action =
  | { type: 'SET_TAB'; payload: Tab }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'ADD_EVENT'; payload: CalendarEvent }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'SET_SELECTED_DATE'; payload: Date }
  | { type: 'UPDATE_GOAL'; payload: WeeklyGoal }
  | { type: 'TOGGLE_ALL_TASKS'; payload: boolean }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'LOAD_DATA'; payload: AppState };

const initialState: AppState = {
  user: {
    name: 'H.J Snow',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    email: 'hjsnow@example.com',
    profileCompletion: 80,
  },
  activeTab: 'home',
  tasks: [
    {
      id: '1',
      title: 'Sketch One UIScreen',
      description: 'Four app project unfinished. Need to complete the UI design for the dashboard.',
      date: '2027-01-13',
      priority: 'high',
      category: 'Design',
      completed: false,
      tags: ['High Priority', 'Productivity'],
      assignees: ['https://i.pravatar.cc/150?img=1', 'https://i.pravatar.cc/150?img=2', 'https://i.pravatar.cc/150?img=3'],
    },
    {
      id: '2',
      title: "Review yesterday's designs",
      description: 'There are many questions about the new layout structure.',
      date: '2027-01-11',
      priority: 'medium',
      category: 'Review',
      completed: false,
      tags: ['Productivity'],
      assignees: ['https://i.pravatar.cc/150?img=4', 'https://i.pravatar.cc/150?img=5'],
    },
    {
      id: '3',
      title: 'Read 10 mins a design article',
      description: 'Stay updated with latest design trends and practices.',
      date: '2027-01-15',
      priority: 'low',
      category: 'Learning',
      completed: true,
      tags: ['Learning'],
    },
  ],
  notes: [
    {
      id: '1',
      title: 'Meeting Notes',
      content: 'Discussed the new feature roadmap for Q1 2027...',
      date: '2027-01-11',
      category: 'Work',
      color: 'purple',
      tags: ['Important'],
      pinned: true,
    },
    {
      id: '2',
      title: 'Design Ideas',
      content: 'Color palette ideas for the new project...',
      date: '2027-01-10',
      category: 'Design',
      color: 'yellow',
      tags: ['Ideas'],
      pinned: false,
    },
    {
      id: '3',
      title: 'Personal Goals',
      content: '1. Exercise daily\n2. Read more books\n3. Learn new skills',
      date: '2027-01-09',
      category: 'Personal',
      color: 'pink',
      tags: ['Goals'],
      pinned: false,
    },
    {
      id: '4',
      title: 'Project Ideas',
      content: 'New app concepts to explore...',
      date: '2027-01-08',
      category: 'Work',
      color: 'blue',
      tags: ['Ideas'],
      pinned: false,
    },
  ],
  events: [
    {
      id: '1',
      title: '60min Push-up & Stretching Exercise',
      description: 'Morning workout routine',
      startTime: '08:30',
      endTime: '09:30',
      date: '2027-01-17',
      color: 'pink',
      type: 'task',
    },
    {
      id: '2',
      title: 'Schedule Client Meeting',
      description: 'Discuss project requirements',
      startTime: '11:31',
      endTime: '13:00',
      date: '2027-01-17',
      color: 'blue',
      type: 'meeting',
    },
    {
      id: '3',
      title: 'Break Time',
      description: 'Quick rest and snack',
      startTime: '13:00',
      endTime: '14:00',
      date: '2027-01-17',
      color: 'yellow',
      type: 'reminder',
    },
    {
      id: '4',
      title: 'Share Concepts with Dev Team',
      description: 'Present design concepts',
      startTime: '14:30',
      endTime: '16:30',
      date: '2027-01-17',
      color: 'purple',
      type: 'meeting',
    },
  ],
  weeklyGoal: {
    total: 45,
    completed: 30,
    title: 'Stay consistent and measure your progress every single day',
  },
  dailyActivity: [
    { day: 'Sat', completed: 10, total: 12, color: '#f472b6' },
    { day: 'Sun', completed: 8, total: 12, color: '#60a5fa' },
    { day: 'Mon', completed: 11, total: 12, color: '#fbbf24' },
    { day: 'Tue', completed: 0, total: 12, color: '#a78bfa' },
    { day: 'Wed', completed: 9, total: 12, color: '#fb923c' },
  ],
  selectedDate: new Date('2027-01-17'),
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, activeTab: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload ? { ...task, completed: !task.completed } : task
        ),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes] };
    case 'DELETE_NOTE':
      return { ...state, notes: state.notes.filter((n) => n.id !== action.payload) };
    case 'ADD_EVENT':
      return { ...state, events: [action.payload, ...state.events] };
    case 'DELETE_EVENT':
      return { ...state, events: state.events.filter((e) => e.id !== action.payload) };
    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload };
    case 'UPDATE_GOAL':
      return { ...state, weeklyGoal: action.payload };
    case 'TOGGLE_ALL_TASKS':
      const allCompleted = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((task) => ({ ...task, completed: allCompleted })),
        weeklyGoal: {
          ...state.weeklyGoal,
          completed: allCompleted ? state.weeklyGoal.total : 0
        }
      };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Sync with localStorage/Backend
  React.useEffect(() => {
    const sync = async () => {
      const saved = await BackendService.fetchData();
      if (saved) {
        dispatch({ type: 'LOAD_DATA', payload: saved });
      }
    };
    sync();
  }, []);

  React.useEffect(() => {
    BackendService.saveData(state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}