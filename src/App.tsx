import { AppProvider, useApp } from './store/AppContext';
import HomeScreen from './components/HomeScreen';
import NotesScreen from './components/NotesScreen';
import CalendarScreen from './components/CalendarScreen';
import ProductivityScreen from './components/ProductivityScreen';
import BrowseScreen from './components/BrowseScreen';
import BottomNav from './components/BottomNav';
import CreateTaskModal from './components/CreateTaskModal';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import { useState } from 'react';

function AppContent() {
  const { state } = useApp();
  const { activeTab } = state;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'task' | 'note' | 'event'>('task');

  const openModal = (type: 'task' | 'note' | 'event') => {
    setModalType(type);
    setModalOpen(true);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'browse':
        return <BrowseScreen />;
      case 'notes':
        return <NotesScreen />;
      case 'calendar':
        return <CalendarScreen />;
      case 'productivity':
        return <ProductivityScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main App Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl overflow-hidden border border-white/50"
        style={{ 
          height: 'calc(100vh - 48px)',
          maxHeight: '900px'
        }}
      >
        {/* Status Bar Area */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white/50 to-transparent z-10 pointer-events-none" />
        
        {/* Screen Content */}
        <div className="h-full overflow-y-auto hide-scrollbar pt-6 px-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Action Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => openModal('task')}
          className="absolute bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg z-40 hover:shadow-xl transition-shadow"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </motion.button>

        {/* Bottom Navigation */}
        <BottomNav />

        {/* Bottom Safe Area */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/50 to-transparent pointer-events-none" />
      </motion.div>

      {/* Create Modal */}
      <CreateTaskModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        type={modalType}
      />

      {/* Toast Notifications */}
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '16px',
            padding: '16px',
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
