import React, { useState, useEffect } from 'react';
import {
  Globe,
  Settings,
  Eye,
  Menu,
  X,
  Compass,
  Sparkles,
  Layers,
  BookOpen,
  Users,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  Phone,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    deviceMode,
    setDeviceMode,
    profile
  } = useProject();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#inicio');

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.href.replace('#', ''));
      const scrollPosition = window.scrollY + 220;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection('#' + sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Início', href: '#inicio', id: 'nav-item-inicio' },
    { label: 'Opções', href: '#opcoes', id: 'nav-item-opcoes' },
    { label: 'Assuntos', href: '#assuntos', id: 'nav-item-assuntos' },
    { label: 'Dicas', href: '#dicas', id: 'nav-item-dicas' },
    { label: 'Integrantes', href: '#integrantes', id: 'nav-item-integrantes' },
    { label: 'Contato', href: '#contato', id: 'nav-item-contato' }
  ];

  const handleNavClick = (href: string) => {
    setActiveSection(href);
    setMobileMenuOpen(false);
    if (currentView !== 'visitor') {
      setCurrentView('visitor');
      // Allow DOM to render visitor view before scrolling
      setTimeout(() => {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#061d30] border-b border-sky-900 text-slate-100 shadow-md w-full overflow-hidden">
      {/* Top Institutional Strip with Uzbekistan Flag Colors */}
      <div className="bg-[#04121d] text-sky-200 text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 border-b border-sky-950">
        <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-sky-600 text-white uppercase tracking-wider">
            {profile.event}
          </span>
          <span className="font-semibold text-slate-200 text-[11px] sm:text-xs truncate">
            {profile.turma} • Estande Oficial: {profile.country}
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Brand / Logo */}
          <div
            id="brand-logo"
            onClick={() => handleNavClick('#inicio')}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group min-w-0 flex-1 sm:flex-initial"
          >
            <div className="relative w-11 h-8 sm:w-14 sm:h-9 rounded-lg overflow-hidden border border-sky-700 bg-slate-800 flex items-center justify-center shadow-xs group-hover:border-red-500 transition-colors shrink-0">
              <img
                src={profile.logoUrl || '/assets/uzbek_flag.svg'}
                alt="Bandeira do Uzbequistão"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm sm:text-lg font-black tracking-tight text-white group-hover:text-red-400 transition-colors truncate">
                  {profile.name}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-sky-950 text-sky-200 border border-sky-800 shrink-0">
                  {profile.turma}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-sky-300 font-medium tracking-wide truncate">
                {profile.subtitle}
              </span>
            </div>
          </div>

          {/* Desktop & Tablet Navigation Links (hidden if in smartphone simulation mode) */}
          {deviceMode !== 'smartphone' && (
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
              {navItems.map(item => {
                const isActive = activeSection === item.href;
                return (
                  <button
                    key={item.label}
                    id={item.id}
                    onClick={() => handleNavClick(item.href)}
                    className={`relative px-3 py-2 text-sm font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'text-white font-black'
                        : 'text-slate-300 hover:text-white hover:bg-sky-900/60 rounded-lg'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-1 left-2.5 right-2.5 h-1 bg-red-600 rounded-full animate-in fade-in" />
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Actions on the Right */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile Hamburger Toggle (always show if smartphone mode, otherwise lg:hidden) */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${deviceMode === 'smartphone' ? 'flex' : 'lg:hidden'} p-2 rounded-lg text-slate-200 hover:text-white hover:bg-sky-900 transition-colors border border-sky-800 shrink-0 cursor-pointer`}
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-navigation-drawer" className={`${deviceMode === 'smartphone' ? 'block' : 'lg:hidden'} bg-[#061d30] border-t border-sky-900 px-4 pt-4 pb-6 space-y-1.5 shadow-xl animate-in slide-in-from-top-2 duration-200 w-full`}>
          <div className="text-xs font-bold text-sky-400 uppercase tracking-wider px-3 mb-2">
            Navegação do Site
          </div>
          {navItems.map(item => {
            const isActive = activeSection === item.href;
            return (
              <button
                key={item.label}
                id={`mobile-${item.id}`}
                onClick={() => handleNavClick(item.href)}
                className={`w-full text-left px-4 py-3 rounded-lg text-base font-bold transition-all flex items-center justify-between border-l-4 ${
                  isActive
                    ? 'bg-sky-950 text-white border-red-500 font-black'
                    : 'text-white border-transparent hover:bg-sky-900/60 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {isActive ? (
                  <span className="text-xs font-bold text-white bg-sky-800 px-2.5 py-0.5 rounded">Ativo</span>
                ) : (
                  <span className="text-sky-300 text-sm">→</span>
                )}
              </button>
            );
          })}

          <div className="pt-4 border-t border-sky-900 flex flex-col gap-2">
            <button
              id="mobile-btn-admin-drawer"
              onClick={() => {
                setMobileMenuOpen(false);
                setCurrentView(currentView === 'visitor' ? 'admin' : 'visitor');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-base font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              {currentView === 'visitor' ? (
                <>
                  <Settings className="w-4 h-4" />
                  <span>Acessar Painel de Controle</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Voltar para o Modo Visitante</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
