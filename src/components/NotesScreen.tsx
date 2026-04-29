import { motion } from 'framer-motion';
import { Search, MoreHorizontal, Plus, Star, Tag, Clock, Users, Pin } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useState } from 'react';

const categories = [
  { icon: Star, label: 'Shortcut', color: 'bg-purple-100 text-purple-500' },
  { icon: Tag, label: 'Tags', color: 'bg-blue-100 text-blue-500' },
  { icon: Clock, label: 'Recent', color: 'bg-yellow-100 text-yellow-500' },
  { icon: Users, label: 'Shared', color: 'bg-pink-100 text-pink-500' },
];

const colorMap: Record<string, string> = {
  purple: 'bg-purple-50 border-purple-100',
  yellow: 'bg-yellow-50 border-yellow-100',
  pink: 'bg-pink-50 border-pink-100',
  blue: 'bg-blue-50 border-blue-100',
};

const tagColors: Record<string, string> = {
  'High Priority': 'bg-red-100 text-red-500',
  'Productivity': 'bg-pink-100 text-pink-500',
  'Learning': 'bg-blue-100 text-blue-500',
  'Important': 'bg-purple-100 text-purple-500',
  'Ideas': 'bg-yellow-100 text-yellow-600',
  'Goals': 'bg-green-100 text-green-600',
};

export default function NotesScreen() {
  const { state } = useApp();
  const { notes, user } = state;
  const [activeCategory, setActiveCategory] = useState('Recent');
  const [showAllNotes, setShowAllNotes] = useState(false);

  const displayedNotes = showAllNotes ? notes : notes.slice(0, 3);

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
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </motion.div>

      {/* Browse Title */}
      <motion.h1 variants={itemVariants} className="text-2xl font-bold text-gray-900 mb-4">
        Browse
      </motion.h1>

      {/* Categories */}
      <motion.div variants={itemVariants} className="flex gap-3 mb-6 overflow-x-auto hide-scrollbar">
        {categories.map((cat) => (
          <motion.button
            key={cat.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(cat.label)}
            className={`flex flex-col items-center gap-2 min-w-[70px] p-3 rounded-2xl transition-all ${
              activeCategory === cat.label ? 'bg-gray-100' : ''
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center shadow-sm`}>
              <cat.icon className="w-5 h-5" />
            </div>
            <span className="text-xs text-gray-600 font-medium whitespace-nowrap">{cat.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Daily Notes Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Daily Notes</h2>
          <p className="text-sm text-gray-500">{notes.length} Notes</p>
        </div>
        <button 
          onClick={() => setShowAllNotes(!showAllNotes)}
          className="text-sm text-purple-500 font-medium hover:text-purple-600"
        >
          {showAllNotes ? 'Show Less' : 'See All'}
        </button>
      </motion.div>

      {/* Notes List */}
      <motion.div variants={itemVariants} className="space-y-4">
        {displayedNotes.map((note, index) => (
          <motion.div
            key={note.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02, x: 4 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${colorMap[note.color]} rounded-3xl p-5 border relative overflow-hidden cursor-pointer group`}
          >
            {note.pinned && (
              <div className="absolute top-4 right-4">
                <Pin className="w-4 h-4 text-purple-400" />
              </div>
            )}
            
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-lg">
                {index % 2 === 0 ? '🎨' : '📝'}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{note.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{note.content}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-3 py-1 rounded-full font-medium ${tagColors[tag] || 'bg-gray-100 text-gray-600'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/150?img=${i + 10}`}
                    alt=""
                    className="w-7 h-7 rounded-full border-2 border-white"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Floating Action Button */}
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