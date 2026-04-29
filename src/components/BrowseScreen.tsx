import { motion } from 'framer-motion';
import { Search, MoreHorizontal, Star, Tag, Clock, Users, Bookmark, Folder } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useState } from 'react';

const categories = [
  { icon: Star, label: 'Shortcut', color: 'bg-purple-100 text-purple-500', count: 12 },
  { icon: Tag, label: 'Tags', color: 'bg-blue-100 text-blue-500', count: 8 },
  { icon: Clock, label: 'Recent', color: 'bg-yellow-100 text-yellow-500', count: 24 },
  { icon: Users, label: 'Shared', color: 'bg-pink-100 text-pink-500', count: 6 },
];

const folders = [
  { name: 'Work', color: 'bg-purple-500', count: 12 },
  { name: 'Personal', color: 'bg-pink-500', count: 8 },
  { name: 'Design', color: 'bg-blue-500', count: 15 },
  { name: 'Ideas', color: 'bg-yellow-500', count: 6 },
];

export default function BrowseScreen() {
  const { state, dispatch } = useApp();
  const { user } = state;
  const [searchQuery, setSearchQuery] = useState('');

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
          <span className="font-semibold text-gray-900">Browse</span>
        </div>
        <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </motion.div>

      {/* Search Bar */}
      <motion.div variants={itemVariants} className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search notes, tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border-none outline-none focus:ring-2 focus:ring-purple-200 text-gray-700 placeholder-gray-400 shadow-sm"
        />
      </motion.div>

      {/* Categories Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
        {categories.map((cat, index) => (
          <motion.button
            key={cat.label}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => dispatch({ type: 'SET_TAB', payload: 'notes' })}
            className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center shadow-sm`}>
              <cat.icon className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">{cat.label}</p>
              <p className="text-xs text-gray-500">{cat.count} items</p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Folders Section */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Folders</h3>
          <button className="text-sm text-purple-500 font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {folders.map((folder, index) => (
            <motion.button
              key={folder.name}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 ${folder.color} rounded-xl flex items-center justify-center`}>
                <Folder className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900">{folder.name}</p>
                <p className="text-xs text-gray-500">{folder.count} notes</p>
              </div>
              <Bookmark className="w-5 h-5 text-gray-300" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Recent Tags */}
      <motion.div variants={itemVariants} className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tags</h3>
        <div className="flex flex-wrap gap-2">
          {['Work', 'Personal', 'Design', 'Important', 'Ideas', 'Goals', 'Meeting', 'Urgent'].map((tag, index) => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="px-4 py-2 bg-white rounded-full text-sm text-gray-600 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              #{tag}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}