import React from 'react';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { Navbar } from './components/Navbar';
import { VisitorView } from './components/VisitorView';
import { AdminPanel } from './components/AdminPanel';
import { VideoModal } from './components/VideoModal';

const AppContent: React.FC = () => {
  const { currentView, deviceMode, activeVideoForModal, setActiveVideoForModal } = useProject();

  return (
    <div className={`min-h-screen bg-[#f4f9fd] text-slate-900 flex flex-col selection:bg-amber-100 selection:text-amber-900 font-sans ${deviceMode !== 'responsive' ? 'bg-slate-950 py-4 sm:py-8' : ''}`}>
      {deviceMode === 'responsive' && <Navbar />}

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {deviceMode === 'smartphone' ? (
          <div className="w-full max-w-[412px] bg-[#f4f9fd] rounded-[44px] border-[14px] border-slate-900 shadow-2xl overflow-hidden relative flex flex-col my-auto transition-all">
            {/* Phone Top Speaker & Camera Notch Simulator */}
            <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 text-center font-bold tracking-widest flex items-center justify-between shrink-0">
              <span className="text-sky-300 font-mono text-[10px]">12:52</span>
              <div className="w-16 h-3.5 bg-slate-800 rounded-full" />
              <span className="text-amber-400 font-bold text-[10px]">📱 Smartphone</span>
            </div>
            <div className="overflow-y-auto max-h-[82vh] flex-1 scrollbar-thin">
              <Navbar />
              {currentView === 'visitor' ? <VisitorView /> : <AdminPanel />}
            </div>
          </div>
        ) : deviceMode === 'tablet' ? (
          <div className="w-full max-w-[820px] bg-[#f4f9fd] rounded-3xl border-8 border-slate-800 shadow-2xl overflow-hidden relative flex flex-col my-auto transition-all">
            <div className="bg-slate-800 text-white text-xs py-1.5 px-4 text-center font-bold tracking-widest flex items-center justify-between shrink-0">
              <span className="text-emerald-400">💻 Modo Tablet / iPad</span>
              <span className="text-slate-400 text-[11px]">Feira das Nações 2026</span>
            </div>
            <div className="overflow-y-auto max-h-[88vh] flex-1 scrollbar-thin">
              <Navbar />
              {currentView === 'visitor' ? <VisitorView /> : <AdminPanel />}
            </div>
          </div>
        ) : (
          <div className="w-full flex-1 flex flex-col">
            {currentView === 'visitor' ? <VisitorView /> : <AdminPanel />}
          </div>
        )}
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
