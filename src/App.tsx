import React from 'react';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { Navbar } from './components/Navbar';
import { VisitorView } from './components/VisitorView';
import { AdminPanel } from './components/AdminPanel';
import { VideoModal } from './components/VideoModal';

const AppContent: React.FC = () => {
  const { currentView, activeVideoForModal, setActiveVideoForModal } = useProject();

  return (
    <div className="min-h-screen bg-[#f4f9fd] text-slate-900 flex flex-col selection:bg-amber-100 selection:text-amber-900 font-sans">
      <Navbar />

      <div className="flex-1">
        {currentView === 'visitor' ? <VisitorView /> : <AdminPanel />}
      </div>

      {/* Global YouTube Video Player Modal */}
      <VideoModal
        video={activeVideoForModal}
        onClose={() => setActiveVideoForModal(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  );
}
