import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Palette,
  Compass,
  Landmark,
  Users,
  UtensilsCrossed,
  Play,
  QrCode,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Award,
  Globe,
  Share2,
  Clock,
  Flame,
  Info,
  Heart,
  FileText,
  MessageSquare,
  Lightbulb,
  MapPin,
  Calendar,
  ShieldCheck,
  Check,
  Camera,
  FolderOpen,
  RefreshCw,
  Star
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { ProjectVideo, Topic } from '../types';
import { getYouTubeThumbnail } from '../utils/youtube';
import { processImageFile } from '../utils/imageUpload';

export const VisitorView: React.FC = () => {
  const {
    profile,
    topics,
    videos,
    members,
    updateMember,
    selectedTopicId,
    setSelectedTopicId,
    setActiveVideoForModal,
    setCurrentView
  } = useProject();

  // Team member photo upload state
  const [uploadingMemberId, setUploadingMemberId] = useState<string | null>(null);
  const [dragOverMemberId, setDragOverMemberId] = useState<string | null>(null);
  const [memberPhotoToast, setMemberPhotoToast] = useState<string | null>(null);

  const handleVisitorPhotoUpload = async (memberId: string, memberName: string, file: File) => {
    try {
      setUploadingMemberId(memberId);
      const dataUrl = await processImageFile(file);
      updateMember(memberId, { photoUrl: dataUrl });
      setMemberPhotoToast(`Foto de ${memberName} atualizada com sucesso pelo arquivo!`);
      setTimeout(() => setMemberPhotoToast(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Erro ao processar imagem do arquivo.');
    } finally {
      setUploadingMemberId(null);
    }
  };

  // Recipe checklist state
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  
  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // QR Code Modal
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Teacher and Visitor Evaluations state
  const [evaluations, setEvaluations] = useState<Array<{
    id: string;
    name: string;
    role: string;
    rating: number;
    comment: string;
    date: string;
  }>>(() => {
    try {
      const saved = localStorage.getItem('feiranacoes_evaluations_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'ev-1',
        name: 'Prof. Carlos Eduardo',
        role: 'Professor(a)',
        rating: 5,
        comment: 'Excelente apresentação! A pesquisa sobre a Rota da Seda e os detalhes dos monumentos de Samarcanda demonstraram muita dedicação da Turma 8° B.',
        date: '13/09/2026'
      },
      {
        id: 'ev-2',
        name: 'Profa. Mariana Souza',
        role: 'Professor(a)',
        rating: 5,
        comment: 'A degustação da Samsa estava impecável e o material visual superou as expectativas. Parabéns a todos os envolvidos!',
        date: '12/09/2026'
      }
    ];
  });

  const [evalForm, setEvalForm] = useState({
    name: '',
    role: 'Professor(a)',
    rating: 5,
    comment: ''
  });
  const [evalSubmittedToast, setEvalSubmittedToast] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('feiranacoes_evaluations_v1', JSON.stringify(evaluations));
    } catch (e) {}
  }, [evaluations]);

  const handleEvalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalForm.name.trim() || !evalForm.comment.trim()) {
      alert('Por favor, informe seu nome e sua avaliação.');
      return;
    }
    const newEval = {
      id: 'ev-' + Date.now(),
      name: evalForm.name.trim(),
      role: evalForm.role.trim() || 'Visitante',
      rating: Number(evalForm.rating) || 5,
      comment: evalForm.comment.trim(),
      date: new Date().toLocaleDateString('pt-BR')
    };
    setEvaluations([newEval, ...evaluations]);
    setEvalForm({ name: '', role: 'Professor(a)', rating: 5, comment: '' });
    setEvalSubmittedToast(true);
    setTimeout(() => setEvalSubmittedToast(false), 4000);
  };

  // Clean up any previously stored stand messages as recados are removed
  useEffect(() => {
    localStorage.removeItem('feiranacoes_visitor_messages_v3');
    localStorage.removeItem('feiranacoes_visitor_messages_v2');
  }, []);

  // Find currently selected topic
  const currentTopic = topics.find(t => t.id === selectedTopicId) || topics[0];

  // Filter videos for the current topic
  const currentTopicVideos = videos.filter(
    v => v.topicId === currentTopic?.id || (currentTopic?.id === 'estande' && v.topicId === 'culinaria')
  );

  const getTopicIcon = (category: Topic['category']) => {
    switch (category) {
      case 'apresentacao': return <Sparkles className="w-5 h-5 text-red-400" />;
      case 'socioeconomia': return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'cultura': return <Palette className="w-5 h-5 text-sky-600" />;
      case 'religiao': return <Compass className="w-5 h-5 text-indigo-600" />;
      case 'monumentos': return <Landmark className="w-5 h-5 text-blue-600" />;
      case 'figuras': return <Users className="w-5 h-5 text-rose-600" />;
      case 'culinaria': return <UtensilsCrossed className="w-5 h-5 text-red-400" />;
      default: return <BookOpen className="w-5 h-5 text-slate-200" />;
    }
  };

  const toggleIngredient = (item: string) => {
    setCheckedIngredients(prev => ({ ...prev, [item]: !prev[item] }));
  };

  // Quiz Questions based directly on document
  const quizQuestions = [
    {
      question: 'Qual o tempero tradicional e vegetal que dão o aroma inconfundível à Samsa?',
      options: ['Orégano e pimentão verde', 'Sementes de cominho (zira) e muita cebola picada', 'Manjericão e tomate seco'],
      correct: 1
    },
    {
      question: 'Quais são as três cores principais da bandeira do Uzbequistão?',
      options: ['Azul-celeste, branco e verde', 'Preto, amarelo e vermelho', 'Roxo, cinza e rosa'],
      correct: 0
    },
    {
      question: 'Em qual continente está localizado o Uzbequistão?',
      options: ['Ásia (Ásia Central)', 'América do Sul', 'Oceania'],
      correct: 0
    }
  ];

  const calculateQuizScore = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) score++;
    });
    return score;
  };

  return (
    <div id="visitor-view-root" className="bg-[#061d30] text-slate-100">
      {/* Uzbekistan National Flag Color Bar */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-sky-500" />
        <div className="w-1 bg-red-600" />
        <div className="flex-1 bg-[#0c2840]" />
        <div className="w-1 bg-red-600" />
        <div className="flex-1 bg-emerald-600" />
      </div>

      {/* ================================================================ */}
      {/* 1. SEÇÃO INÍCIO (#inicio) - Banner Institucional Harmonizado      */}
      {/* ================================================================ */}
      <section
        id="inicio"
        className="relative bg-gradient-to-b from-[#082a45] via-[#061d30] to-[#04121d] border-b border-sky-800/60/60 pt-12 pb-18 lg:pt-20 lg:pb-28 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="max-w-2xl text-center lg:text-left">
              {/* Event Badge with Uzbekistan Flag */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0c2840] border border-sky-800/60 text-slate-200 text-sm font-bold mb-6 shadow-xs">
                <div className="w-6 h-3.5 rounded overflow-hidden border border-sky-700/60 shrink-0">
                  <img src="/assets/uzbek_flag.svg" alt="Bandeira do Uzbequistão" className="w-full h-full object-cover" />
                </div>
                <span>{profile.event}</span>
                <span className="text-slate-300">•</span>
                <span className="text-white font-extrabold">{profile.turma}</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-400 font-semibold">{profile.country}</span>
              </div>

              {/* Main Headline with Flag */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                <span className="inline-flex flex-wrap items-center gap-3">
                  <span>As Belezas do Uzbequistão</span>
                  <span className="inline-block w-12 sm:w-16 h-7 sm:h-9 rounded-md overflow-hidden border border-sky-700/60 shadow-xs align-middle">
                    <img
                      src="/assets/uzbek_flag.svg"
                      alt="Bandeira do Uzbequistão"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </span>
                </span>
                <span className="block text-xl sm:text-3xl lg:text-4xl font-extrabold text-sky-300 mt-2">
                  Feira das Nações 2026 — Gastronomia & Cultura Tradicional
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-slate-200 leading-relaxed mb-8">
                {profile.standDescription}
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
                <a
                  href="#opcoes"
                  className="px-7 py-3.5 rounded-xl bg-sky-900 hover:bg-sky-950 text-white font-bold text-base shadow-sm transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <Compass className="w-5 h-5 text-red-400" />
                  Ver Opções do Estande
                </a>

                <a
                  href="#assuntos"
                  className="px-7 py-3.5 rounded-xl bg-[#0c2840] hover:bg-sky-50 text-slate-100 border border-sky-700/60 font-bold text-base transition-all flex items-center gap-2.5 cursor-pointer shadow-xs"
                >
                  <BookOpen className="w-5 h-5 text-emerald-700" />
                  Explorar Assuntos
                </a>

                <a
                  href="#dicas"
                  className="px-7 py-3.5 rounded-xl bg-red-950/50 hover:bg-red-950/50 text-red-400 border border-red-800 font-bold text-base transition-all flex items-center gap-2.5 cursor-pointer shadow-xs"
                >
                  <Lightbulb className="w-5 h-5 text-red-400" />
                  Dicas Culinárias
                </a>
              </div>
            </div>

            {/* Right Card / Visual Feature: Bandeira Oficial do Uzbequistão */}
            <div className="w-full max-w-md lg:max-w-lg">
              <div className="relative rounded-2xl overflow-hidden border border-sky-800/60 bg-[#0c2840] shadow-xl p-3 sm:p-4">
                {/* Bandeira Oficial em Vetor SVG de Alta Precisão */}
                <div className="relative rounded-xl overflow-hidden shadow-sm border border-slate-300 aspect-[2/1] w-full bg-[#0c2840]">
                  <svg
                    viewBox="0 0 600 300"
                    className="w-full h-full block"
                    role="img"
                    aria-label="Bandeira Oficial do Uzbequistão"
                  >
                    <defs>
                      {/* Estrela branca de 5 pontas */}
                      <polygon
                        id="flag-star-uz"
                        points="0,-6.5 1.9,-2 6.5,-2 2.8,0.9 4.1,5.5 0,2.6 -4.1,5.5 -2.8,0.9 -6.5,-2 -1.9,-2"
                        fill="#ffffff"
                      />
                      {/* Máscara de recorte do crescente lunar */}
                      <mask id="uz-crescent-mask">
                        <rect x="0" y="0" width="600" height="300" fill="white" />
                        <circle cx="106" cy="48" r="28" fill="black" />
                      </mask>
                    </defs>

                    {/* Faixa Superior: Azul-Celeste Oficial */}
                    <rect x="0" y="0" width="600" height="96" fill="#0099b5" />

                    {/* Filete Vermelho Superior */}
                    <rect x="0" y="96" width="600" height="6" fill="#ce1126" />

                    {/* Faixa Central: Branco da Paz */}
                    <rect x="0" y="102" width="600" height="96" fill="#ffffff" />

                    {/* Filete Vermelho Inferior */}
                    <rect x="0" y="198" width="600" height="6" fill="#ce1126" />

                    {/* Faixa Inferior: Verde Esmeralda */}
                    <rect x="0" y="204" width="600" height="96" fill="#1eb53a" />

                    {/* Lua Crescente no campo azul */}
                    <circle cx="92" cy="48" r="32" fill="#ffffff" mask="url(#uz-crescent-mask)" />

                    {/* 12 Estrelas em 3 fileiras (3 no topo, 4 ao meio, 5 na base) */}
                    {/* Linha Superior (3 estrelas) */}
                    <use href="#flag-star-uz" x="180" y="24" />
                    <use href="#flag-star-uz" x="204" y="24" />
                    <use href="#flag-star-uz" x="228" y="24" />

                    {/* Linha do Meio (4 estrelas) */}
                    <use href="#flag-star-uz" x="156" y="48" />
                    <use href="#flag-star-uz" x="180" y="48" />
                    <use href="#flag-star-uz" x="204" y="48" />
                    <use href="#flag-star-uz" x="228" y="48" />

                    {/* Linha da Base (5 estrelas) */}
                    <use href="#flag-star-uz" x="132" y="72" />
                    <use href="#flag-star-uz" x="156" y="72" />
                    <use href="#flag-star-uz" x="180" y="72" />
                    <use href="#flag-star-uz" x="204" y="72" />
                    <use href="#flag-star-uz" x="228" y="72" />
                  </svg>
                </div>

                {/* Descrição e Significado dos Elementos da Bandeira */}
                <div className="pt-4 pb-2 px-1">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-extrabold text-sky-800 uppercase tracking-wider bg-sky-100/80 px-2.5 py-0.5 rounded border border-sky-800/60">
                      Símbolo Oficial
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Proporção Oficial 1:2
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                    Bandeira Oficial do Uzbequistão
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    O <strong>azul-celeste</strong> representa o céu e as águas puras; o <strong>branco</strong> simboliza a paz e a retidão; o <strong>verde</strong> celebra a natureza viva e a fertilidade; os <strong>filetes rubros</strong> representam a força vital. A <strong>lua crescente</strong> e as <strong>12 estrelas</strong> consagram o renascimento e os ciclos dos meses do ano.
                  </p>
                </div>

                {/* Mini strip with stand highlights */}
                <div className="grid grid-cols-3 gap-2 p-3 text-center bg-sky-50/70 rounded-xl mt-2 border border-sky-900/60">
                  <div>
                    <span className="block text-xs sm:text-sm font-extrabold text-white">Bancada</span>
                    <span className="text-[11px] sm:text-xs text-slate-300 font-medium">Turma 8° B</span>
                  </div>
                  <div className="border-x border-sky-800/60">
                    <span className="block text-xs sm:text-sm font-extrabold text-red-400">Degustação</span>
                    <span className="text-[11px] sm:text-xs text-slate-300 font-medium">Samsa Folhada</span>
                  </div>
                  <div>
                    <span className="block text-xs sm:text-sm font-extrabold text-emerald-700">Artesanato</span>
                    <span className="text-[11px] sm:text-xs text-slate-300 font-medium">Pratos Lagans</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 2. SEÇÃO OPÇÕES (#opcoes) - Interatividade do Visitante           */}
      {/* ================================================================ */}
      <section id="opcoes" className="py-18 sm:py-24 bg-[#082a45] border-b border-sky-800/60/60 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-sky-800 bg-[#0c2840] px-3.5 py-1 rounded-full border border-sky-800/60 inline-block mb-3 shadow-xs">
              Atividades do Estande
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Opções para os Visitantes
            </h2>
            <p className="text-base sm:text-lg text-slate-300 mt-3">
              A Turma 8° B preparou diversas experiências interativas para você vivenciar a cultura do Uzbequistão durante a feira.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Opção 1: Degustação da Samsa */}
            <div className="bg-[#0c2840] rounded-2xl p-7 border border-sky-800/60 hover:border-red-800 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-xl bg-red-950/50 text-red-400 flex items-center justify-center mb-5">
                  <UtensilsCrossed className="w-7 h-7" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-red-400 uppercase tracking-wide">Gastronomia Oficial</span>
                <h3 className="text-xl font-bold text-white mt-1.5 mb-3">
                  Degustação da Samsa Folhada
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Experimente nossa Samsa quentinha servida na bancada em embalagens individuais e higiênicas preparadas pelas alunas.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-sky-900/60">
                <a
                  href="#secao-receita-detalhada"
                  onClick={() => setSelectedTopicId('culinaria')}
                  className="text-sm font-bold text-red-400 hover:text-red-400 flex items-center gap-2"
                >
                  <span>Ver Receita & Ingredientes</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Opção 2: Explorar Assuntos da Pesquisa */}
            <div className="bg-[#0c2840] rounded-2xl p-7 border border-sky-800/60 hover:border-sky-500 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center mb-5">
                  <BookOpen className="w-7 h-7" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-sky-700 uppercase tracking-wide">Trabalho Acadêmico</span>
                <h3 className="text-xl font-bold text-white mt-1.5 mb-3">
                  Explorar os Assuntos Oficiais
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Navegue pelos tópicos oficiais da pesquisa: cultura e artesanato dos Lagans, socioeconomia, religião, monumentos de Samarcanda, figuras históricas e gastronomia da Samsa.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-sky-900/60">
                <a
                  href="#assuntos"
                  className="text-sm font-bold text-sky-800 hover:text-sky-950 flex items-center gap-2"
                >
                  <span>Acessar Assuntos Interativos</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Opção 3: Cinema do Estande (Vídeos) */}
            <div className="bg-[#0c2840] rounded-2xl p-7 border border-sky-800/60 hover:border-red-400 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-xl bg-red-100 text-red-800 flex items-center justify-center mb-5">
                  <Play className="w-7 h-7 fill-current" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-red-700 uppercase tracking-wide">Multimídia</span>
                <h3 className="text-xl font-bold text-white mt-1.5 mb-3">
                  Vídeos Culturais no YouTube
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Assista a {videos.length} vídeos selecionados sobre monumentos de Samarcanda, a dança Lazgi e o passo a passo da receita tradicional.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-sky-900/60">
                <button
                  id="btn-open-first-video"
                  onClick={() => videos[0] && setActiveVideoForModal(videos[0])}
                  className="text-sm font-bold text-red-700 hover:text-red-800 flex items-center gap-2 cursor-pointer"
                >
                  <span>Assistir ao Vídeo em Destaque</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Opção 4: QR Code da Receita */}
            <div className="bg-[#0c2840] rounded-2xl p-7 border border-sky-800/60 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-5">
                  <QrCode className="w-7 h-7" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-blue-700 uppercase tracking-wide">Praticidade no Celular</span>
                <h3 className="text-xl font-bold text-white mt-1.5 mb-3">
                  QR Code da Receita da Samsa
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Aponte a câmera do celular para o código na bancada e salve a receita completa com checklist de compras e modo de preparo.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-sky-900/60">
                <button
                  id="btn-open-qr-code-modal"
                  onClick={() => setQrModalOpen(true)}
                  className="text-sm font-bold text-blue-700 hover:text-blue-800 flex items-center gap-2 cursor-pointer"
                >
                  <span>Simular QR Code na Tela</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Opção 5: Quiz da Copa e Uzbequistão */}
            <div className="bg-[#0c2840] rounded-2xl p-7 border border-sky-800/60 hover:border-purple-400 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-5">
                  <Award className="w-7 h-7" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-purple-700 uppercase tracking-wide">Desafio Cultural</span>
                <h3 className="text-xl font-bold text-white mt-1.5 mb-3">
                  Quiz Rápido do Estande
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Responda a 3 perguntas simples sobre o tempero da Samsa, as cores da bandeira e a localização do Uzbequistão.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-sky-900/60">
                <a
                  href="#secao-quiz-interativo"
                  className="text-sm font-bold text-purple-700 hover:text-purple-800 flex items-center gap-2"
                >
                  <span>Fazer o Quiz Interativo</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Opção 6: Deixar Recado / Contato */}
            <div className="bg-[#0c2840] rounded-2xl p-7 border border-sky-800/60 hover:border-emerald-400 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-5">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-emerald-700 uppercase tracking-wide">Interação</span>
                <h3 className="text-xl font-bold text-white mt-1.5 mb-3">
                  Livro de Visitas & Avaliação
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Avalie nosso estande com estrelas e deixe uma mensagem de incentivo para as alunas do 8° B.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-sky-900/60">
                <a
                  href="#contato"
                  className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-2"
                >
                  <span>Deixar Mensagem no Estande</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 3. SEÇÃO ASSUNTOS (#assuntos) - Botões Interativos e Conteúdos    */}
      {/* ================================================================ */}
      <section id="assuntos" className="py-18 sm:py-24 bg-[#082a45] border-b border-sky-800/60/60 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-teal-800 bg-[#0c2840] px-3.5 py-1 rounded-full border border-teal-200 inline-block mb-3 shadow-xs">
              Pesquisa Escolar 8° B
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Assuntos e Tópicos Culturais
            </h2>
            <p className="text-base sm:text-lg text-slate-300 mt-3">
              Clique nos botões abaixo para visualizar os detalhes, curiosidades e materiais preparados para a feira.
            </p>
          </div>

          {/* Botões Interativos de Assuntos */}
          <div className="flex items-center justify-start lg:justify-center gap-2.5 overflow-x-auto pb-4 mb-12 scrollbar-none">
            {topics.map(t => {
              const isSelected = t.id === selectedTopicId;
              return (
                <button
                  key={t.id}
                  id={`btn-filtro-assunto-${t.id}`}
                  onClick={() => setSelectedTopicId(t.id)}
                  className={`px-5 py-3 rounded-xl text-sm sm:text-base font-bold whitespace-nowrap transition-all flex items-center gap-2.5 cursor-pointer border ${
                    isSelected
                      ? 'bg-sky-900 text-white border-sky-900 shadow-sm'
                      : 'bg-[#0c2840] text-slate-200 border-sky-800/60 hover:border-sky-700/60 hover:bg-sky-50 shadow-xs'
                  }`}
                >
                  {getTopicIcon(t.category)}
                  <span>{t.title.split(':')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* ASSUNTO EM DESTAQUE SELECIONADO */}
          <div id="secao-assunto-destaque" className="bg-[#0c2840] rounded-2xl border border-sky-800/60 shadow-md overflow-hidden mb-14">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Image Column */}
              <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
                <img
                  src={currentTopic.image}
                  alt={currentTopic.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-[#0c2840] backdrop-blur-md text-white shadow-xs border border-sky-800/60">
                    {currentTopic.highlightTag || 'Tema Oficial'}
                  </span>
                </div>
              </div>

              {/* Text & Content Column */}
              <div className="lg:col-span-7 p-7 sm:p-9 lg:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-800 uppercase tracking-wider mb-2.5">
                    {getTopicIcon(currentTopic.category)}
                    <span>Categoria: {currentTopic.category}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-5">
                    {currentTopic.title}
                  </h3>

                  <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-7">
                    {currentTopic.content}
                  </p>

                  {/* Fatos-Chave */}
                  <div className="mb-7">
                    <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-3.5">
                      Pontos de Destaque da Apresentação:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentTopic.keyFacts.map((fact, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm text-slate-200 bg-sky-50/60 p-3.5 rounded-xl border border-sky-900/60 font-medium">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{fact}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sub-actions for current topic */}
                <div className="pt-6 border-t border-sky-900/60 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm text-slate-500 font-medium">
                    Assunto da bancada da Turma 8° B
                  </span>

                  <div className="flex items-center gap-2.5">
                    {currentTopicVideos.length > 0 && (
                      <button
                        id="btn-ver-video-relacionado"
                        onClick={() => setActiveVideoForModal(currentTopicVideos[0])}
                        className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Ver Vídeo do Assunto</span>
                      </button>
                    )}

                    <button
                      id="btn-abrir-painel-editar-assunto"
                      onClick={() => setCurrentView('admin')}
                      className="px-4 py-2.5 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-900 text-sm font-bold transition-colors cursor-pointer"
                    >
                      Editar Assuntos
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SE FOR CULINÁRIA: MOSTRAR RECEITA COMPLETA DA SAMSA INTERATIVA */}
            {currentTopic.recipeDetails && (
              <div id="secao-receita-detalhada" className="border-t border-red-800 bg-red-950/50/50 p-7 sm:p-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-9">
                  <div>
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-red-400 block mb-1">
                      Receita Oficial do Estande
                    </span>
                    <h4 className="text-2xl sm:text-3xl font-black text-white">
                      Samsa Tradicional Uzbeque — Passo a Passo
                    </h4>
                    <p className="text-sm sm:text-base text-slate-300 mt-1.5">
                      Aprenda a fazer a autêntica massa folhada e o recheio suculento com o checklist interativo.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="px-3.5 py-2 rounded-lg bg-[#0c2840] border border-red-800 text-sm font-semibold text-slate-200">
                      ⏱️ {currentTopic.recipeDetails.prepTime || '1h 20min'}
                    </div>
                    <div className="px-3.5 py-2 rounded-lg bg-[#0c2840] border border-red-800 text-sm font-semibold text-slate-200">
                      🥟 {currentTopic.recipeDetails.yields || '15 a 20 unidades'}
                    </div>
                    <button
                      onClick={() => setQrModalOpen(true)}
                      className="px-3.5 py-2 rounded-lg bg-sky-900 text-white text-sm font-bold flex items-center gap-1.5 cursor-pointer hover:bg-sky-800 transition-colors"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>QR Code</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Ingredientes com Checklist Interativo */}
                  <div className="space-y-6">
                    <div className="bg-[#0c2840] rounded-xl p-6 border border-red-800/80 shadow-xs">
                      <h5 className="font-bold text-white text-base sm:text-lg mb-3.5 flex items-center gap-2">
                        <span>🌾 Ingredientes para a Massa Folhada</span>
                        <span className="text-xs font-normal text-slate-500">(clique para marcar)</span>
                      </h5>
                      <div className="space-y-2.5">
                        {currentTopic.recipeDetails.doughIngredients?.map((item, idx) => {
                          const isChecked = checkedIngredients[item];
                          return (
                            <div
                              key={idx}
                              onClick={() => toggleIngredient(item)}
                              className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors text-sm sm:text-base ${
                                isChecked ? 'bg-red-950/50 text-slate-400 line-through' : 'hover:bg-sky-950/40 text-slate-200 font-medium'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                                isChecked ? 'bg-red-950/50 border-red-800 text-white' : 'border-slate-700 bg-[#0c2840]'
                              }`}>
                                {isChecked && <Check className="w-3.5 h-3.5" />}
                              </div>
                              <span>{item}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-[#0c2840] rounded-xl p-6 border border-red-800/80 shadow-xs">
                      <h5 className="font-bold text-white text-base sm:text-lg mb-3.5 flex items-center gap-2">
                        <span>🥩 Ingredientes para o Recheio</span>
                        <span className="text-xs font-normal text-slate-500">(clique para marcar)</span>
                      </h5>
                      <div className="space-y-2.5">
                        {currentTopic.recipeDetails.fillingIngredients?.map((item, idx) => {
                          const isChecked = checkedIngredients[item];
                          return (
                            <div
                              key={idx}
                              onClick={() => toggleIngredient(item)}
                              className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors text-sm sm:text-base ${
                                isChecked ? 'bg-red-950/50 text-slate-400 line-through' : 'hover:bg-sky-950/40 text-slate-200 font-medium'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                                isChecked ? 'bg-red-950/50 border-red-800 text-white' : 'border-slate-700 bg-[#0c2840]'
                              }`}>
                                {isChecked && <Check className="w-3.5 h-3.5" />}
                              </div>
                              <span>{item}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Modo de Preparo */}
                  <div className="bg-[#0c2840] rounded-xl p-7 border border-red-800/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <h5 className="font-bold text-white text-base sm:text-lg mb-5">
                        👨‍🍳 Modo de Preparo da Turma 8° B
                      </h5>
                      <div className="space-y-4">
                        {currentTopic.recipeDetails.steps?.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-3.5 text-sm sm:text-base text-slate-200">
                            <span className="w-7 h-7 rounded-full bg-red-950/50 text-red-400 font-extrabold text-sm flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed font-medium">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {currentTopic.recipeDetails.tips && (
                      <div className="mt-8 p-5 rounded-xl bg-red-950/50/70 border border-red-800 text-sm text-red-400 flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold text-base mb-1">Dica de Ouro das Alunas:</strong>
                          <span className="leading-relaxed">{currentTopic.recipeDetails.tips}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Grade de Todos os Assuntos */}
          <div>
            <h4 className="text-xl sm:text-2xl font-black text-slate-950 mb-7">
              Todos os {topics.length} Assuntos Cadastrados
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {topics.map(t => (
                <div
                  key={t.id}
                  id={`card-assunto-${t.id}`}
                  onClick={() => {
                    setSelectedTopicId(t.id);
                    const el = document.getElementById('secao-assunto-destaque');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-[#0c2840] rounded-2xl border border-sky-800/60 overflow-hidden shadow-xs hover:shadow-lg hover:border-sky-400 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={t.image}
                        alt={t.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 rounded-md text-xs font-bold bg-[#0c2840] text-slate-100 shadow-xs border border-sky-800/60">
                          {t.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h5 className="font-bold text-white text-lg mb-2.5 group-hover:text-sky-800 transition-colors line-clamp-1">
                        {t.title}
                      </h5>
                      <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                        {t.shortSummary}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-3 border-t border-sky-900/60 flex items-center justify-between text-sm font-bold text-sky-800">
                    <span>Ver Conteúdo Completo</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 4. SEÇÃO DICAS (#dicas) - Dicas Culinárias & Curiosidades         */}
      {/* ================================================================ */}
      <section id="dicas" className="py-18 sm:py-24 bg-[#082a45] border-b border-sky-800/60/60 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-sky-800 bg-[#0c2840] px-3.5 py-1 rounded-full border border-sky-800/60 inline-block mb-3 shadow-xs">
              Segredos & Tradições
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Dicas Culinárias e Curiosidades do Uzbequistão
            </h2>
            <p className="text-base sm:text-lg text-slate-300 mt-3">
              Confira os segredos e técnicas tradicionais que tornam a gastronomia e a hospitalidade uzbeque únicas no mundo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Dica 1: O Segredo da Massa Folhada da Samsa */}
            <div className="bg-[#0c2840] rounded-2xl p-7 border border-sky-800/60 hover:border-sky-400 transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-950/50 text-red-400 flex items-center justify-center font-extrabold text-base mb-4">
                  01
                </div>
                <h3 className="font-bold text-white text-lg sm:text-xl mb-2.5">
                  O Segredo da Massa Folhada da Samsa
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                  Para obter camadas estaladiças e perfeitas, a massa deve ser aberta até ficar quase transparente. Pincela-se manteiga morna derretida uniformemente e enrola-se como um rocambole bem apertado antes de cortar e abrir cada disco.
                </p>
              </div>
              <span className="text-xs sm:text-sm font-bold text-red-400 uppercase tracking-wide">
                Técnica Tradicional da Turma 8° B
              </span>
            </div>

            {/* Dica 2: A Proporção de Carne e Cebola */}
            <div className="bg-[#0c2840] rounded-2xl p-7 border border-sky-800/60 hover:border-sky-400 transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-950/50 text-red-400 flex items-center justify-center font-extrabold text-base mb-4">
                  02
                </div>
                <h3 className="font-bold text-white text-lg sm:text-xl mb-2.5">
                  A Proporção de Carne e Cebola
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                  No Uzbequistão, a carne nunca é moída em máquina industrial, mas sim cortada na ponta da faca em cubinhos minúsculos. A proporção mágica é 1 parte de carne para 1 parte de cebola picada, temperada com sementes de cominho (zira).
                </p>
              </div>
              <span className="text-xs sm:text-sm font-bold text-red-400 uppercase tracking-wide">
                Segredo da Suculência Interna
              </span>
            </div>

            {/* Dica 3: O Truque do Shashlik com Água com Gás */}
            <div className="bg-[#0c2840] rounded-2xl p-7 border border-sky-800/60 hover:border-sky-400 transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-950/50 text-red-400 flex items-center justify-center font-extrabold text-base mb-4">
                  03
                </div>
                <h3 className="font-bold text-white text-lg sm:text-xl mb-2.5">
                  O Truque do Shashlik com Água com Gás
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                  Para o espeto tradicional Shashlik, a carne é marinada com água mineral com gás, cebola ralada e coentro em grãos. As bolhas da água quebram as fibras naturalmente, dispensando vinagres agressivos.
                </p>
              </div>
              <span className="text-xs sm:text-sm font-bold text-red-400 uppercase tracking-wide">
                Churrasco da Rota da Seda
              </span>
            </div>

            {/* Dica 4: A Etiqueta do Chá Kok-Chai */}
            <div className="bg-[#0c2840] rounded-2xl p-7 border border-sky-800/60 hover:border-sky-400 transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-extrabold text-base mb-4">
                  04
                </div>
                <h3 className="font-bold text-white text-lg sm:text-xl mb-2.5">
                  A Etiqueta do Chá Verde (Kok-Chai)
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                  O anfitrião despeja o chá da chaleira na tigela e devolve à chaleira três vezes seguidas antes de servir ao convidado. O ritual simboliza a argila (terra), a gordura (vida) e a pureza do chá.
                </p>
              </div>
              <span className="text-xs sm:text-sm font-bold text-sky-800 uppercase tracking-wide">
                Hospitalidade Milenar
              </span>
            </div>

            {/* Dica 5: Como Apreciar os Pratos Lagans */}
            <div className="bg-[#0c2840] rounded-2xl p-7 border border-sky-800/60 hover:border-sky-400 transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-base mb-4">
                  05
                </div>
                <h3 className="font-bold text-white text-lg sm:text-xl mb-2.5">
                  Como Reconhecer os Pratos Lagans
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                  Os pratos de cerâmica de Rishtan e Samarcanda exibem padrões florais circulares e tons de esmeralda e turquesa. No nosso estande, as alunas criaram réplicas em papelão pintadas fielmente à mão.
                </p>
              </div>
              <span className="text-xs sm:text-sm font-bold text-emerald-800 uppercase tracking-wide">
                Artesanato da Bancada 8° B
              </span>
            </div>

            {/* Dica 6: Dicas para os Visitantes da Feira */}
            <div className="bg-[#0c2840] rounded-2xl p-7 border border-sky-800/60 hover:border-sky-400 transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-extrabold text-base mb-4">
                  06
                </div>
                <h3 className="font-bold text-white text-lg sm:text-xl mb-2.5">
                  Dicas de Visitação da Nossa Bancada
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                  Chegue cedo para a apresentação oral dos alunos, deguste sua Samsa ainda quentinha na embalagem individual e escaneie o QR Code na bancada para levar a receita salva no seu smartphone!
                </p>
              </div>
              <span className="text-xs sm:text-sm font-bold text-sky-800 uppercase tracking-wide">
                Experiência Completa no Estande
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 5. SEÇÃO INTEGRANTES (#integrantes) - Alunas da Turma 8° B       */}
      {/* ================================================================ */}
      <section id="integrantes" className="py-18 sm:py-24 bg-[#082a45] border-b border-sky-800/60/60 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-sky-800 bg-[#0c2840] px-3.5 py-1 rounded-full border border-sky-800/60 inline-block mb-3 shadow-xs">
                Equipe Escolar
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Integrantes do Projeto — Turma 8° B
              </h2>
              <p className="text-base sm:text-lg text-slate-300 mt-2">
                Conheça os alunos responsáveis pela pesquisa, artesanato, culinária e apresentação no estande.
              </p>
              <div className="mt-2.5 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-sky-900 bg-[#0c2840]/80 px-3 py-1.5 rounded-lg border border-sky-700/60 shadow-2xs">
                <FolderOpen className="w-4 h-4 text-sky-700 shrink-0" />
                <span>Dica: Para trocar a foto de qualquer integrante, clique no botão <strong>Trocar Foto</strong> ou arraste um arquivo de imagem direto para a foto.</span>
              </div>
            </div>

            <button
              id="btn-gerenciar-integrantes-topo"
              onClick={() => setCurrentView('admin')}
              className="px-5 py-2.5 rounded-xl bg-[#0c2840] border border-sky-700/60 hover:bg-sky-50 text-slate-100 text-sm font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            >
              Gerenciar Integrantes
            </button>
          </div>

          {/* Notificação de Sucesso */}
          {memberPhotoToast && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-sm flex items-center justify-between gap-3 shadow-xs animate-fade-in">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{memberPhotoToast}</span>
              </div>
              <button
                onClick={() => setMemberPhotoToast(null)}
                className="text-emerald-700 hover:text-emerald-900 text-xs font-bold underline cursor-pointer"
              >
                Fechar
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {members.map(member => {
              const isUploadingThis = uploadingMemberId === member.id;
              const isDragOver = dragOverMemberId === member.id;

              return (
                <div
                  key={member.id}
                  id={`card-membro-${member.id}`}
                  className={`bg-[#0c2840] rounded-2xl border p-6 shadow-xs hover:shadow-lg transition-all flex flex-col items-center text-center group ${
                    isDragOver ? 'border-sky-500 ring-4 ring-sky-200' : 'border-sky-800/60 hover:border-sky-400'
                  }`}
                >
                  {/* Photo Container com Troca por Arquivo */}
                  <div className="relative mb-3">
                    <div
                      className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 transition-all bg-sky-50 shadow-xs cursor-pointer ${
                        isDragOver
                          ? 'border-sky-600 scale-105 ring-4 ring-sky-200'
                          : 'border-sky-800/60 group-hover:border-sky-500'
                      }`}
                      title="Clique para abrir o explorador de arquivos ou arraste uma foto"
                      onClick={() => document.getElementById(`visitor-photo-input-${member.id}`)?.click()}
                      onDragOver={e => {
                        e.preventDefault();
                        setDragOverMemberId(member.id);
                      }}
                      onDragLeave={() => setDragOverMemberId(null)}
                      onDrop={e => {
                        e.preventDefault();
                        setDragOverMemberId(null);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleVisitorPhotoUpload(member.id, member.name, e.dataTransfer.files[0]);
                        }
                      }}
                    >
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className={`w-full h-full object-cover transition-transform duration-300 ${
                          isUploadingThis ? 'opacity-30' : 'group-hover:scale-105'
                        }`}
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold rounded-full">
                        <FolderOpen className="w-5 h-5 mb-1" />
                        <span>Trocar foto</span>
                      </div>

                      {/* Loading state */}
                      {isUploadingThis && (
                        <div className="absolute inset-0 bg-sky-950/70 flex items-center justify-center text-white rounded-full">
                          <RefreshCw className="w-6 h-6 animate-spin text-white" />
                        </div>
                      )}
                    </div>

                    {/* Botão Flutuante da Câmera no Canto da Foto */}
                    <label
                      htmlFor={`visitor-photo-input-${member.id}`}
                      className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-sky-900 hover:bg-sky-950 text-white flex items-center justify-center shadow-md border-2 border-white cursor-pointer transition-transform hover:scale-110 z-10"
                      title="Selecionar foto no explorador de arquivos"
                    >
                      <Camera className="w-4 h-4" />
                    </label>

                    <input
                      type="file"
                      id={`visitor-photo-input-${member.id}`}
                      accept="image/*"
                      className="sr-only"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          handleVisitorPhotoUpload(member.id, member.name, e.target.files[0]);
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>

                  {/* Botão Trocar Foto */}
                  <label
                    htmlFor={`visitor-photo-input-${member.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 text-xs font-bold transition-colors cursor-pointer border border-sky-800/60 mb-3 shadow-2xs"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-sky-700" />
                    <span>Trocar Foto</span>
                  </label>

                  {/* Name */}
                  <h3 className="font-bold text-white text-lg sm:text-xl mb-1">
                    {member.name}
                  </h3>

                  {/* Turma Badge */}
                  <span className="inline-block px-3 py-0.5 rounded-md text-xs sm:text-sm font-bold bg-sky-50 text-sky-900 border border-sky-800/60 mb-3">
                    {member.turma || 'Turma 8° B'}
                  </span>

                  {/* Bio */}
                  {member.bio && (
                    <p className="text-sm text-slate-300 leading-relaxed border-t border-sky-900/60 pt-3 line-clamp-3">
                      {member.bio}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* MINI SEÇÃO QUIZ INTERATIVO (Para engajar os visitantes)          */}
      {/* ================================================================ */}
      <section id="secao-quiz-interativo" className="py-16 bg-[#082a45] border-b border-sky-800/60/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0a3556] text-white rounded-2xl p-7 sm:p-12 shadow-xl border border-sky-700/60 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-red-400 uppercase tracking-wider mb-2.5">
                <Award className="w-5 h-5" />
                <span>Desafio Cultural do 8° B</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2.5">
                Quiz Rápido sobre o Uzbequistão
              </h3>
              <p className="text-sm sm:text-base text-sky-100 mb-8">
                Teste se você prestou atenção na apresentação das alunas! Responda e veja seu resultado na hora.
              </p>

              <div className="space-y-6">
                {quizQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="bg-sky-950/70 rounded-xl p-5 sm:p-6 border border-sky-800/60">
                    <p className="font-bold text-white text-base sm:text-lg mb-4">
                      {qIdx + 1}. {q.question}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = quizAnswers[qIdx] === optIdx;
                        const isCorrect = optIdx === q.correct;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => {
                              setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
                              setQuizSubmitted(false);
                            }}
                            className={`p-3.5 rounded-xl text-xs sm:text-sm font-semibold text-left transition-all border cursor-pointer ${
                              isChosen
                                ? quizSubmitted
                                  ? isCorrect
                                    ? 'bg-emerald-600 text-white border-emerald-500 font-bold'
                                    : 'bg-red-600 text-white border-red-500 font-bold'
                                  : 'bg-red-950/50 text-slate-950 border-red-800 font-bold'
                                : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-700/60'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-sky-800/60">
                {!quizSubmitted ? (
                  <button
                    id="btn-verificar-quiz"
                    onClick={() => setQuizSubmitted(true)}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-red-950/50 hover:bg-red-950/50 text-slate-950 font-black text-sm sm:text-base transition-colors cursor-pointer shadow-md"
                  >
                    Verificar Respostas
                  </button>
                ) : (
                  <div className="flex items-center gap-4">
                    <span className="text-base sm:text-lg font-bold text-emerald-400">
                      Você acertou {calculateQuizScore()} de {quizQuestions.length} perguntas! 🎉
                    </span>
                    <button
                      onClick={() => {
                        setQuizAnswers({});
                        setQuizSubmitted(false);
                      }}
                      className="text-sm text-sky-200 underline hover:text-white"
                    >
                      Tentar novamente
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 6. SEÇÃO CONTATO E LOCALIZAÇÃO (#contato)                        */}
      {/* ================================================================ */}
      <section id="contato" className="py-18 sm:py-24 bg-[#082a45] border-b border-sky-800/60/60 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-sky-800 bg-[#0c2840] px-3.5 py-1 rounded-full border border-sky-800/60 inline-block mb-3 shadow-xs">
              Visitação Escolar
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Localização e Informações do Estande
            </h2>
            <p className="text-base sm:text-lg text-slate-300 mt-2">
              Venha visitar nosso estande no Colégio Nossa Senhora das Dores e prestigiar a apresentação cultural da Turma 8° B.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1: Localização & Espaço */}
            <div className="bg-[#0c2840] rounded-2xl p-7 border border-sky-800/60 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-950/50 text-red-400 flex items-center justify-center mb-5">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-white text-xl mb-4">
                  Onde Nos Encontrar
                </h3>
                <div className="space-y-3.5 text-sm sm:text-base text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <span className="font-bold text-white w-24 shrink-0">Colégio:</span>
                    <span className="font-medium text-slate-100">Nossa Senhora das Dores</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="font-bold text-white w-24 shrink-0">Espaço:</span>
                    <span className="text-slate-100">Pátio Central / Ala Internacional</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="font-bold text-white w-24 shrink-0">Turma:</span>
                    <span className="font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-800/60">
                      {profile.turma}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="font-bold text-white w-24 shrink-0">País:</span>
                    <span className="font-bold text-red-400">{profile.country}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="font-bold text-white w-24 shrink-0">Evento:</span>
                    <span className="text-slate-200">{profile.event}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-sky-900/60">
                <span className="text-xs text-slate-500 font-semibold block">E-mail para dúvidas escolares:</span>
                <span className="text-sm font-bold text-slate-100">{profile.contactEmail || 'turma8b.uzbequistao@feiradasnacoes.edu'}</span>
              </div>
            </div>

            {/* Card 2: Programação & Degustação */}
            <div className="bg-[#0c2840] rounded-2xl p-7 border border-sky-800/60 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center mb-5">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-white text-xl mb-4">
                  Destaques na Bancada
                </h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Degustação de Samsa:</strong> Folhada quentinha com recheio tradicional, servida em embalagens individuais.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Pratos Cerâmicos Lagans:</strong> Réplicas decoradas manualmente em papelão com padrões florais e geométricos.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Painel Histórico:</strong> Rota da Seda, monumentos milenares de Samarcanda e tributo à Dra. Zulfiya Umidova.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Dança Lazgi & UNESCO:</strong> Apresentação das tradições culturais reconhecidas mundialmente.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-5 border-t border-sky-900/60">
                <button
                  type="button"
                  onClick={() => setQrModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-sky-900 hover:bg-sky-950 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                >
                  <QrCode className="w-4 h-4 text-red-400" />
                  <span>Ver QR Code da Receita Digital</span>
                </button>
              </div>
            </div>

            {/* Card 3: Fontes de Pesquisa e Referências */}
            <div className="bg-[#0c2840] rounded-2xl p-7 border border-sky-800/60 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-5">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-white text-xl mb-4">
                  Fontes de Pesquisa
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-4">
                  Todo o conteúdo exibido na bancada e no portal foi pesquisado pelos alunos com base em fontes acadêmicas e culturais oficiais:
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.sources.map((src, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-sky-50 text-sky-900 border border-sky-800/60 text-xs font-bold"
                    >
                      {src}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-sky-900/60 bg-sky-50/50 -mx-7 -mb-7 p-7 rounded-b-2xl">
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "Esperamos sua visita para celebrar conosco a rica história e culinária do Uzbequistão!"
                </p>
                <span className="text-xs font-bold text-white mt-2 block">
                  — Equipe de Alunas do 8° B
                </span>
              </div>
            </div>
          </div>

          {/* Avaliações e Comentários de Professores e Visitantes */}
          <div className="mt-12 sm:mt-16 bg-[#0c2840] rounded-2xl p-6 sm:p-8 border border-sky-800/60 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-sky-900/60">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-950/50 text-red-400 border border-red-800 mb-2">
                  <Star className="w-3.5 h-3.5 fill-red-500 text-red-500 text-red-400" />
                  <span>Livro de Avaliações</span>
                </span>
                <h3 className="text-2xl font-black text-white">
                  Deixe sua Avaliação ou Comentário
                </h3>
                <p className="text-sm text-slate-300 mt-1">
                  Professores, alunos e visitantes podem registrar sua nota e feedback sobre o estande do Uzbequistão.
                </p>
              </div>

              {evalSubmittedToast && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-sm font-bold animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Avaliação registrada com sucesso!</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form de Envio */}
              <div className="lg:col-span-5 bg-sky-50/60 rounded-2xl p-6 border border-sky-800/60">
                <form onSubmit={handleEvalSubmit} className="space-y-4">
                  <h4 className="font-extrabold text-white text-base mb-2">
                    Nova Avaliação / Feedback
                  </h4>

                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">
                      Seu Nome *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Prof. Carlos ou Visitante"
                      value={evalForm.name}
                      onChange={e => setEvalForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sky-800/60 bg-[#0c2840] text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-200 mb-1">
                        Categoria / Papel
                      </label>
                      <select
                        value={evalForm.role}
                        onChange={e => setEvalForm(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-sky-800/60 bg-[#0c2840] text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                      >
                        <option value="Professor(a)">Professor(a)</option>
                        <option value="Convidado(a)">Convidado(a)</option>
                        <option value="Aluno(a) / Colega">Aluno(a) / Colega</option>
                        <option value="Visitante">Visitante</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-200 mb-1">
                        Nota (Estrelas)
                      </label>
                      <select
                        value={evalForm.rating}
                        onChange={e => setEvalForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-sky-800/60 bg-[#0c2840] text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5 - Excelente)</option>
                        <option value={4}>⭐⭐⭐⭐ (4 - Muito Bom)</option>
                        <option value={3}>⭐⭐⭐ (3 - Bom)</option>
                        <option value={2}>⭐⭐ (2 - Regular)</option>
                        <option value={1}>⭐ (1 - Precisa melhorar)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">
                      Comentário / Avaliação *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Deixe sua opinião sobre a culinária, apresentação ou pesquisa..."
                      value={evalForm.comment}
                      onChange={e => setEvalForm(prev => ({ ...prev, comment: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sky-800/60 bg-[#0c2840] text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-sky-900 hover:bg-sky-950 text-white font-bold text-sm transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-red-400" />
                    <span>Publicar Avaliação</span>
                  </button>
                </form>
              </div>

              {/* Lista de Avaliações Recentes */}
              <div className="lg:col-span-7 flex flex-col">
                <h4 className="font-extrabold text-white text-base mb-4 flex items-center justify-between">
                  <span>Avaliações Registradas ({evaluations.length})</span>
                  <span className="text-xs font-semibold text-slate-500">Professores & Visitantes</span>
                </h4>

                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
                  {evaluations.map(ev => (
                    <div key={ev.id} className="bg-[#0c2840] p-5 rounded-xl border border-sky-800/60 shadow-2xs">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-white text-sm">{ev.name}</span>
                            <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-800/60">
                              {ev.role}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">{ev.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < ev.rating ? 'fill-red-500 text-red-500 text-red-400' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        "{ev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* MODAL SIMULADOR DE QR CODE PARA A RECEITA                        */}
      {/* ================================================================ */}
      {qrModalOpen && (
        <div
          id="qr-code-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setQrModalOpen(false)}
        >
          <div
            className="bg-[#0c2840] rounded-2xl max-w-sm w-full p-7 text-center shadow-2xl border border-sky-800/60 relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-red-950/50 text-red-400 mx-auto flex items-center justify-center mb-4">
              <QrCode className="w-7 h-7" />
            </div>

            <h3 className="font-extrabold text-white text-xl mb-1.5">
              Receita Digital no Celular
            </h3>
            <p className="text-sm text-slate-300 mb-6">
              Aponte a câmera do seu smartphone para o QR Code abaixo e acerte o preparo da Samsa tradicional!
            </p>

            {/* Simulated Clean SVG QR Code */}
            <div className="bg-sky-50/50 p-5 rounded-2xl border border-sky-800/60 inline-block mb-6">
              <svg
                viewBox="0 0 160 160"
                className="w-48 h-48 mx-auto"
                shapeRendering="crispEdges"
              >
                <rect width="160" height="160" fill="white" />
                {/* Outer corners */}
                <rect x="10" y="10" width="40" height="40" fill="#0f172a" />
                <rect x="16" y="16" width="28" height="28" fill="white" />
                <rect x="22" y="22" width="16" height="16" fill="#0f172a" />

                <rect x="110" y="10" width="40" height="40" fill="#0f172a" />
                <rect x="116" y="16" width="28" height="28" fill="white" />
                <rect x="122" y="22" width="16" height="16" fill="#0f172a" />

                <rect x="10" y="110" width="40" height="40" fill="#0f172a" />
                <rect x="16" y="116" width="28" height="28" fill="white" />
                <rect x="22" y="122" width="16" height="16" fill="#0f172a" />

                {/* Decorative Uzbek-inspired data blocks */}
                <rect x="60" y="20" width="10" height="30" fill="#0f172a" />
                <rect x="80" y="10" width="15" height="15" fill="#0f172a" />
                <rect x="65" y="65" width="30" height="30" fill="#0099b5" />
                <rect x="20" y="70" width="20" height="10" fill="#0f172a" />
                <rect x="120" y="70" width="25" height="15" fill="#0f172a" />
                <rect x="60" y="110" width="20" height="30" fill="#0f172a" />
                <rect x="90" y="120" width="30" height="20" fill="#0f172a" />
                <rect x="130" y="110" width="15" height="15" fill="#0f172a" />
              </svg>
            </div>

            <div className="text-xs sm:text-sm text-slate-500 mb-6 font-medium">
              Turma 8° B • Feira das Nações 2026 • Uzbequistão
            </div>

            <button
              onClick={() => setQrModalOpen(false)}
              className="w-full py-3 rounded-xl bg-sky-900 text-white text-sm font-bold hover:bg-sky-950 transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* 7. RODAPÉ INSTITUCIONAL COM BANDEIRA DO UZBEQUISTÃO              */}
      {/* ================================================================ */}
      <footer className="bg-[#082a45] text-sky-100 text-sm">
        {/* Uzbekistan Flag Stripe Indicator */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-sky-500" />
          <div className="w-1 bg-red-600" />
          <div className="flex-1 bg-[#0c2840]" />
          <div className="w-1 bg-red-600" />
          <div className="flex-1 bg-emerald-600" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Coluna 1: Sobre */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-9 rounded-lg overflow-hidden border border-sky-400/40 shadow-xs shrink-0">
                  <img src="/assets/uzbek_flag.svg" alt="Bandeira do Uzbequistão" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-white">{profile.name}</h4>
                  <span className="text-xs sm:text-sm text-sky-300">{profile.turma} • {profile.event}</span>
                </div>
              </div>
              <p className="text-sky-200/80 text-sm leading-relaxed max-w-md">
                Estande temático escolar representando o Uzbequistão na Copa do Mundo 2026. Pesquisa sobre história, Rota da Seda, monumentos de Samarcanda, danças tradicionais e a autêntica culinária da Samsa.
              </p>
            </div>

            {/* Coluna 2: Links Rápidos do Menu */}
            <div>
              <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-3.5">
                Navegação
              </h5>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#inicio" className="hover:text-white transition-colors">Início</a></li>
                <li><a href="#opcoes" className="hover:text-white transition-colors">Opções do Estande</a></li>
                <li><a href="#assuntos" className="hover:text-white transition-colors">Assuntos da Pesquisa</a></li>
                <li><a href="#dicas" className="hover:text-white transition-colors">Dicas Culinárias</a></li>
                <li><a href="#integrantes" className="hover:text-white transition-colors">Integrantes 8° B</a></li>
                <li><a href="#contato" className="hover:text-white transition-colors">Contato & Localização</a></li>
              </ul>
            </div>

            {/* Coluna 3: Acesso Restrito / Admin */}
            <div>
              <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-3.5">
                Administração
              </h5>
              <p className="text-sky-200/80 text-sm mb-4 leading-relaxed">
                Painel lateral para gerenciamento de vídeos do YouTube, integrantes, tópicos e perfil do projeto.
              </p>
              <button
                onClick={() => setCurrentView('admin')}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors cursor-pointer shadow-sm"
              >
                Acessar Painel de Controle
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-sky-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-sky-300">
            <div>
              © 2026 Feira das Nações • Turma 8° B — Todos os direitos reservados.
            </div>
            <div className="flex items-center gap-4">
              <span>Uzbequistão</span>
              <span>•</span>
              <span>Copa do Mundo 2026</span>
              <span>•</span>
              <a href="#inicio" className="hover:text-white">Voltar ao topo ↑</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
