import { motion } from 'framer-motion';
import { ChevronLeft, Search, Users, TrendingUp, Calendar, Zap } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useState } from 'react';
import { format } from 'date-fns';

const timeRanges = ['Weekly', 'Daily', 'Monthly'];

export default function ProductivityScreen() {
  const { state, dispatch } = useApp();
  const { weeklyGoal, dailyActivity } = state;
  const [activeRange, setActiveRange] = useState('Weekly');
  const [showGoalDetails, setShowGoalDetails] = useState(false);

  const progressPercentage = Math.round((weeklyGoal.completed / weeklyGoal.total) * 100);

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

  const maxCompleted = Math.max(...dailyActivity.map(d => d.completed));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-full pb-24"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </motion.button>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Users className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1 variants={itemVariants} className="text-2xl font-bold text-gray-900 mb-6">
        Productivity & Goal
      </motion.h1>

      {/* Time Range Tabs */}
      <motion.div variants={itemVariants} className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-2xl">
        {timeRanges.map((range) => (
          <motion.button
            key={range}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveRange(range)}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeRange === range 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {range === 'Weekly' && <TrendingUp className="w-4 h-4" />}
            {range === 'Daily' && <Calendar className="w-4 h-4" />}
            {range === 'Monthly' && <Zap className="w-4 h-4" />}
            {range}
          </motion.button>
        ))}
      </motion.div>

      {/* Weekly Goal Card */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        onClick={() => setShowGoalDetails(!showGoalDetails)}
        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 mb-6 border border-purple-100 cursor-pointer"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Weekly Goal</h3>
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: 'TOGGLE_ALL_TASKS', payload: true });
              }}
              className="text-xs font-medium text-purple-500 hover:text-purple-600 bg-white px-3 py-1 rounded-full shadow-sm"
            >
              Complete All
            </button>
            <motion.div
              animate={{ rotate: showGoalDetails ? 180 : 0 }}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center"
            >
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </motion.div>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{weeklyGoal.title}</p>
        
        <div className="flex items-end justify-between mb-3">
          <div>
            <span className="text-3xl font-bold text-gray-900">Task {weeklyGoal.completed}/{weeklyGoal.total}</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-purple-500">{progressPercentage}%</span>
            <p className="text-xs text-gray-400">Completed</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full rounded-full gradient-purple"
          />
        </div>
        
        {/* Expandable Details */}
        <motion.div
          initial={false}
          animate={{ height: showGoalDetails ? 'auto' : 0, opacity: showGoalDetails ? 1 : 0 }}
          className="overflow-hidden"
        >
          <div className="pt-4 mt-4 border-t border-purple-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-2xl p-3">
                <p className="text-2xl font-bold text-purple-500">12</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
              <div className="bg-white rounded-2xl p-3">
                <p className="text-2xl font-bold text-pink-500">5</p>
                <p className="text-xs text-gray-500">In Progress</p>
              </div>
              <div className="bg-white rounded-2xl p-3">
                <p className="text-2xl font-bold text-blue-500">28</p>
                <p className="text-xs text-gray-500">Remaining</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Daily Activity */}
      <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Daily Activity</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(), 'MMM d, yyyy')}</span>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Completed Task</p>
            <p className="text-2xl font-bold text-gray-900">{weeklyGoal.completed}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Total Task</p>
            <p className="text-2xl font-bold text-gray-900">{weeklyGoal.total}</p>
          </div>
        </div>
        
        {/* Bar Chart */}
        <div className="flex items-end justify-between gap-3 h-32">
          {dailyActivity.map((day, index) => {
            const height = maxCompleted > 0 ? (day.completed / maxCompleted) * 100 : 0;
            return (
              <motion.div
                key={day.day}
                className="flex-1 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-full relative">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                    className="w-full rounded-t-xl min-h-[4px]"
                    style={{ backgroundColor: day.color }}
                  />
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-600 opacity-0 hover:opacity-100 transition-opacity">
                    {day.completed}
                  </div>
                </div>
                <span className="text-xs text-gray-500 font-medium">{day.day}</span>
              </motion.div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-100">
          {dailyActivity.map((day) => (
            <div key={day.day} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: day.color }}
              />
              <span className="text-xs text-gray-500">{day.day}: {day.completed}/{day.total}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Motivation Card */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-medium text-white/90">Keep it up!</span>
          </div>
          <p className="text-lg font-semibold">You&apos;re doing great! {progressPercentage}% of your weekly goals are completed.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}