import React, { useState } from 'react';
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
  Phone
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    profile
  } = useProject();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Início', href: '#inicio', id: 'nav-item-inicio' },
    { label: 'Opções', href: '#opcoes', id: 'nav-item-opcoes' },
    { label: 'Assuntos', href: '#assuntos', id: 'nav-item-assuntos' },
    { label: 'Dicas', href: '#dicas', id: 'nav-item-dicas' },
    { label: 'Integrantes', href: '#integrantes', id: 'nav-item-integrantes' },
    { label: 'Contato', href: '#contato', id: 'nav-item-contato' }
  ];

  const handleNavClick = (href: string) => {
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
    <header className="sticky top-0 z-50 bg-[#f8fcff] border-b border-sky-200 shadow-xs">
      {/* Top Institutional Strip with Uzbekistan Flag Colors */}
      <div className="bg-[#082a45] text-sky-200 text-sm py-2 px-4 sm:px-8 border-b border-sky-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-sky-500 text-white uppercase tracking-wider">
              {profile.event}
            </span>
            <span className="font-semibold text-slate-100 text-sm sm:text-base">
              {profile.turma} • Estande Oficial: {profile.country}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs sm:text-sm text-sky-300">
            <span className="hidden md:inline">Local: Bancada 8° B — Pátio Principal</span>
            <button
              id="top-admin-quick-link"
              onClick={() => setCurrentView(currentView === 'visitor' ? 'admin' : 'visitor')}
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm"
            >
              <Settings className="w-4 h-4" />
              <span>{currentView === 'visitor' ? 'Área Administrativa' : 'Voltar ao Site'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-22">
          {/* Brand / Logo */}
          <div
            id="brand-logo"
            onClick={() => handleNavClick('#inicio')}
            className="flex items-center gap-3.5 cursor-pointer group shrink-0"
          >
            <div className="relative w-14 h-9 sm:w-16 sm:h-10 rounded-lg overflow-hidden border border-sky-300 bg-white flex items-center justify-center shadow-xs group-hover:border-sky-500 transition-colors shrink-0">
              <img
                src={profile.logoUrl || '/assets/uzbek_flag.svg'}
                alt="Bandeira do Uzbequistão"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 group-hover:text-amber-700 transition-colors">
                  {profile.name}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                  {profile.turma}
                </span>
              </div>
              <span className="text-sm text-slate-500 font-medium tracking-wide">
                {profile.subtitle}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (Clean standard top menu: Início, Opções, Assuntos, Dicas, Integrantes, Contato) */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3">
            {navItems.map(item => (
              <button
                key={item.label}
                id={item.id}
                onClick={() => handleNavClick(item.href)}
                className="px-4 py-2.5 text-base font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions on the Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Toggle View Button */}
            <button
              id="btn-admin-toggle"
              onClick={() => setCurrentView(currentView === 'visitor' ? 'admin' : 'visitor')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm sm:text-base font-bold transition-all cursor-pointer shadow-xs ${
                currentView === 'visitor'
                  ? 'bg-slate-900 hover:bg-slate-800 text-white'
                  : 'bg-teal-700 hover:bg-teal-800 text-white'
              }`}
            >
              {currentView === 'visitor' ? (
                <>
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Painel de Controle</span>
                  <span className="sm:hidden">Painel</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Ver Site</span>
                </>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-navigation-drawer" className="lg:hidden bg-white border-t border-slate-200 px-4 pt-4 pb-6 space-y-1.5 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Navegação do Site
          </div>
          {navItems.map(item => (
            <button
              key={item.label}
              id={`mobile-${item.id}`}
              onClick={() => handleNavClick(item.href)}
              className="w-full text-left px-4 py-3 rounded-lg text-base font-bold text-slate-800 hover:text-slate-950 hover:bg-slate-100 transition-colors flex items-center justify-between"
            >
              <span>{item.label}</span>
              <span className="text-slate-400 text-sm">→</span>
            </button>
          ))}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
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
