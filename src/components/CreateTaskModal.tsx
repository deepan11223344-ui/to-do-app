import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Calendar, Clock, Flag, Tag } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { toast } from 'sonner';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'task' | 'note' | 'event';
}

export default function CreateTaskModal({ isOpen, onClose, type }: CreateTaskModalProps) {
  const { dispatch } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [category, setCategory] = useState('General');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const id = Date.now().toString();
    const date = new Date().toISOString().split('T')[0];

    if (type === 'task' || type === 'event') {
      dispatch({
        type: 'ADD_TASK',
        payload: {
          id,
          title,
          description,
          date,
          priority,
          category,
          completed: false,
          tags: [priority === 'high' ? 'High Priority' : 'Productivity'],
        },
      });
      toast.success('Task created successfully!');
    } else {
      dispatch({
        type: 'ADD_NOTE',
        payload: {
          id,
          title,
          content: description,
          date,
          category,
          color: ['purple', 'yellow', 'pink', 'blue'][Math.floor(Math.random() * 4)],
          tags: ['New'],
          pinned: false,
        },
      });
      toast.success('Note created successfully!');
    }

    setTitle('');
    setDescription('');
    onClose();
  };

  const titles = {
    task: 'Create New Task',
    note: 'Create New Note',
    event: 'Create New Event',
  };

  const gradients = {
    task: 'from-purple-500 to-pink-500',
    note: 'from-yellow-400 to-orange-500',
    event: 'from-blue-500 to-cyan-500',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 z-50 max-w-sm mx-auto shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{titles[type]}</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title Input */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`Enter ${type} title...`}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-purple-200 text-gray-700 placeholder-gray-400"
                  autoFocus
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add details..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-purple-200 text-gray-700 placeholder-gray-400 resize-none"
                />
              </div>

              {/* Priority Selection */}
              {(type === 'task' || type === 'event') && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Priority</label>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium capitalize transition-all ${
                          priority === p
                            ? p === 'high'
                              ? 'bg-red-100 text-red-600'
                              : p === 'medium'
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        <Flag className="w-4 h-4 inline mr-1" />
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {['Work', 'Personal', 'Design', 'Learning'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                        category === cat
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <Tag className="w-3 h-3 inline mr-1" />
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date and Time Quick Select */}
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => toast.info('Date set to Today')}
                  className="flex-1 py-3 bg-gray-50 rounded-2xl flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Today</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => toast.info('Time set to Now')}
                  className="flex-1 py-3 bg-gray-50 rounded-2xl flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Now</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-4 bg-gradient-to-r ${gradients[type]} text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2`}
              >
                <Plus className="w-5 h-5" />
                Create {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}