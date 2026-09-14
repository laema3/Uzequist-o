import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Lock, Mail, X, AlertCircle } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { showLoginModal, setShowLoginModal, loginAdmin } = useProject();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!showLoginModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = loginAdmin(email, password);
    if (!success) {
      setError('E-mail ou senha incorretos. Verifique as credenciais informadas.');
    } else {
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#0c2840] border border-sky-800/80 w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl relative text-slate-100">
        <button
          onClick={() => {
            setShowLoginModal(false);
            setError('');
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-sky-900/60 border border-sky-700/60 text-sky-300 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Acesso Restrito — Administração
          </h3>
          <p className="text-xs sm:text-sm text-sky-200/80 mt-1">
            Insira suas credenciais para gerenciar o conteúdo da Feira das Nações 2026.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sky-300 mb-1.5">
              E-mail de Acesso
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sky-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="laura@gmail.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sky-800 bg-[#061d30] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sky-300 mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sky-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sky-800 bg-[#061d30] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              Entrar no Painel
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-sky-900/60 text-center text-[11px] text-sky-300">
          Acesso exclusivo para administradores do projeto Uzbequistão 2026.
        </div>
      </div>
    </div>
  );
};
