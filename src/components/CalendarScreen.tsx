import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MoreHorizontal, Plus, Clock } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { useMemo } from 'react';

const colorMap: Record<string, string> = {
  pink: 'bg-pink-100 border-pink-200 text-pink-700',
  blue: 'bg-blue-100 border-blue-200 text-blue-700',
  yellow: 'bg-yellow-100 border-yellow-200 text-yellow-700',
  purple: 'bg-purple-100 border-purple-200 text-purple-700',
};

const timeColors: Record<string, string> = {
  pink: '#f472b6',
  blue: '#60a5fa',
  yellow: '#fbbf24',
  purple: '#a78bfa',
};

export default function CalendarScreen() {
  const { state, dispatch } = useApp();
  const { events, selectedDate, user } = state;

  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [selectedDate]);

  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const filteredEvents = useMemo(() => {
    return events.filter((event) => 
      isSameDay(new Date(event.date), selectedDate)
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [events, selectedDate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
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
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
            <CalendarIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </motion.div>

      {/* Calendar Title */}
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Calendar</h1>
        <p className="text-gray-500 text-sm">{format(selectedDate, 'MMMM d, yyyy')}</p>
      </motion.div>

      {/* Week View */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => dispatch({ type: 'SET_SELECTED_DATE', payload: addDays(selectedDate, -7) })}
            className="w-8 h-8 rounded-full hover:bg-white/50 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 flex justify-center">
            <div className="flex gap-2">
              {weekDays.map((day, index) => {
                const isSelected = isSameDay(day, selectedDate);
                return (
                  <motion.button
                    key={day.toISOString()}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => dispatch({ type: 'SET_SELECTED_DATE', payload: day })}
                    className={`flex flex-col items-center gap-1 p-2 rounded-2xl min-w-[48px] transition-all ${
                      isSelected ? 'gradient-purple text-white shadow-glow' : 'hover:bg-white/50'
                    }`}
                  >
                    <span className={`text-xs font-medium ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                      {dayNames[index]}
                    </span>
                    <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                      {format(day, 'd')}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
          <button 
            onClick={() => dispatch({ type: 'SET_SELECTED_DATE', payload: addDays(selectedDate, 7) })}
            className="w-8 h-8 rounded-full hover:bg-white/50 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </motion.div>

      {/* Events List */}
      <motion.div variants={itemVariants} className="space-y-4">
        {filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/50 flex items-center justify-center">
              <CalendarIcon className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500">No events for this day</p>
            <p className="text-sm text-gray-400 mt-1">Tap + to add a new event</p>
          </motion.div>
        ) : (
          filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              {/* Time Indicator */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center min-w-[60px]">
                  <span className="text-sm font-semibold text-gray-900">{event.startTime}</span>
                  <span className="text-xs text-gray-400">{event.endTime}</span>
                </div>
                
                {/* Event Card */}
                <div className={`flex-1 ${colorMap[event.color]} rounded-2xl p-4 border relative overflow-hidden`}>
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{ backgroundColor: timeColors[event.color] }}
                  />
                  <div className="pl-3">
                    <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{event.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                  </div>
                  
                  {/* FAB for this event */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-3 right-3 w-8 h-8 gradient-purple rounded-full flex items-center justify-center shadow-md"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Quick Add Event Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-6 w-14 h-14 gradient-purple rounded-full flex items-center justify-center shadow-glow z-40"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>
    </motion.div>
  );
}