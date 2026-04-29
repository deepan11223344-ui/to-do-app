import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Plus, BookOpen, Camera, Mic, Calendar, CheckCircle2 } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { format } from 'date-fns';
import { toast } from 'sonner';

const actionButtons = [
  { icon: BookOpen, label: 'Notebook', color: 'bg-pink-100 text-pink-500' },
  { icon: Camera, label: 'Camera', color: 'bg-purple-100 text-purple-500' },
  { icon: Mic, label: 'Audio', color: 'bg-blue-100 text-blue-500' },
  { icon: Calendar, label: 'Events', color: 'bg-orange-100 text-orange-500' },
];

export default function HomeScreen() {
  const { state, dispatch } = useApp();
  const { user } = state;
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredTasks = state.tasks.filter(task => {
    if (activeFilter === 'Active') return !task.completed;
    if (activeFilter === 'Completed') return task.completed;
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-full pb-24"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Hi, {user.name} 👋</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
          </button>
        </div>
      </motion.div>

      {/* Title Section */}
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Evernote</h1>
        <p className="text-gray-500 text-sm">Today {format(new Date(), 'MMMM d, yyyy')}</p>
      </motion.div>

      {/* Create Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-6">
        <button 
          onClick={() => dispatch({ type: 'SET_TAB', payload: 'notes' })}
          className="gradient-purple rounded-3xl p-5 text-left relative overflow-hidden group hover:shadow-glow transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <p className="text-white/80 text-xs font-medium">Create</p>
            <p className="text-white font-semibold text-lg">New Note</p>
          </div>
        </button>
        
        <button 
          onClick={() => dispatch({ type: 'SET_TAB', payload: 'calendar' })}
          className="gradient-yellow rounded-3xl p-5 text-left relative overflow-hidden group hover:shadow-lg transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <p className="text-white/80 text-xs font-medium">Create</p>
            <p className="text-white font-semibold text-lg">New Task</p>
          </div>
        </button>
      </motion.div>

      {/* Progress Section */}
      <motion.div variants={itemVariants} className="bg-white rounded-3xl p-5 mb-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-900 font-semibold">Complete Your</p>
            <p className="text-gray-900 font-semibold">Profile Setup</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-purple-500">{user.profileCompletion}%</p>
            <p className="text-gray-400 text-xs">Done</p>
          </div>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${user.profileCompletion}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full gradient-purple"
          />
        </div>
      </motion.div>

      {/* Actions Section */}
      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
        <div className="grid grid-cols-4 gap-3">
          {actionButtons.map((action, index) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center shadow-sm`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-xs text-gray-600 font-medium">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Quick Tasks Preview */}
      <motion.div variants={itemVariants} className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Today&apos;s Tasks</h3>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                const anyIncomplete = state.tasks.some(t => !t.completed);
                dispatch({ type: 'TOGGLE_ALL_TASKS', payload: anyIncomplete });
                toast.success(anyIncomplete ? 'All tasks marked as complete!' : 'All tasks marked as incomplete');
              }}
              className="text-sm text-green-500 font-medium hover:text-green-600 px-2 py-1 rounded-lg hover:bg-green-50 transition-colors"
            >
              Complete All
            </button>
            <button 
              onClick={() => dispatch({ type: 'SET_TAB', payload: 'calendar' })}
              className="text-sm text-purple-500 font-medium hover:text-purple-600 px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors"
            >
              View All
            </button>
          </div>
        </div>

        {/* Task Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar pb-1">
          {['All', 'Active', 'Completed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-xs px-4 py-2 rounded-xl font-medium transition-all ${
                activeFilter === filter 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              whileHover={{ scale: 1.02 }}
              layout
              className={`bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 cursor-pointer ${
                task.completed ? 'opacity-60' : ''
              }`}
              onClick={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                task.completed ? 'bg-purple-500 border-purple-500' : 'border-gray-300'
              }`}>
                {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                  {task.title}
                </p>
                <p className="text-xs text-gray-400">{task.category}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                task.priority === 'high' ? 'bg-red-100 text-red-500' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                'bg-green-100 text-green-600'
              }`}>
                {task.priority}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}