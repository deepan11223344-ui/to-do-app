import { motion } from 'framer-motion';
import { Home, StickyNote, Calendar, BarChart3, Plus, BookMarked } from 'lucide-react';
import { useApp } from '../store/AppContext';
import type { Tab } from '../types';

interface NavItem {
  id: Tab;
  icon: typeof Home;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'browse', icon: BookMarked, label: 'Browse' },
  { id: 'notes', icon: StickyNote, label: 'Notes' },
  { id: 'calendar', icon: Calendar, label: 'Calendar' },
  { id: 'productivity', icon: BarChart3, label: 'Stats' },
];

export default function BottomNav() {
  const { state, dispatch } = useApp();
  const { activeTab } = state;

  const handleTabChange = (tab: Tab) => {
    dispatch({ type: 'SET_TAB', payload: tab });
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-4 left-4 right-4 z-50"
    >
      <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-2 flex items-center justify-between shadow-2xl border border-white/10">
        {navItems.map((item, index) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          // Special Create button in the middle
          if (index === 2) {
            return (
              <div key={item.id} className="relative -mt-8">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleTabChange('notes')}
                  className="w-14 h-14 gradient-purple rounded-full flex items-center justify-center shadow-glow relative"
                >
                  <Plus className="w-6 h-6 text-white" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 opacity-50 blur-lg"></div>
                </motion.button>
                <motion.div
                  initial={false}
                  animate={{ 
                    opacity: activeTab === 'notes' ? 1 : 0,
                    y: activeTab === 'notes' ? 0 : 10
                  }}
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
                >
                  <span className="text-xs text-white/60 font-medium">Create</span>
                </motion.div>
              </div>
            );
          }
          
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-4 rounded-2xl transition-all ${
                isActive ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <motion.div
                animate={{ 
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Icon 
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-purple-400' : 'text-gray-400'
                  }`} 
                />
              </motion.div>
              <motion.span
                initial={false}
                animate={{ 
                  opacity: isActive ? 1 : 0.5,
                  y: isActive ? 0 : 2
                }}
                className={`text-[10px] mt-1 font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-gray-500'
                }`}
              >
                {item.label}
              </motion.span>
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-1 h-1 bg-purple-400 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}