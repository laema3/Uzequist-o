import React, { useState } from 'react';
import {
  Video,
  Users,
  Settings,
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Check,
  AlertCircle,
  Play,
  Sparkles,
  Layers,
  Image as ImageIcon,
  GraduationCap,
  Eye,
  X,
  Upload,
  Camera,
  FolderOpen,
  RefreshCw
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { ProjectVideo, TeamMember, Topic } from '../types';
import { extractYouTubeId, getYouTubeThumbnail } from '../utils/youtube';
import { processImageFile } from '../utils/imageUpload';
import { ConfirmModal } from './ConfirmModal';

type AdminTab = 'videos' | 'integrantes' | 'projeto' | 'assuntos';

export const AdminPanel: React.FC = () => {
  const {
    profile,
    updateProfile,
    addCharacteristic,
    editCharacteristic,
    deleteCharacteristic,
    videos,
    addVideo,
    updateVideo,
    deleteVideo,
    members,
    addMember,
    updateMember,
    deleteMember,
    topics,
    addTopic,
    updateTopic,
    deleteTopic,
    setActiveVideoForModal,
    setCurrentView
  } = useProject();

  const [activeTab, setActiveTab] = useState<AdminTab>('videos');

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Modals & Form states
  // 1. Videos
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<ProjectVideo | null>(null);
  const [videoForm, setVideoForm] = useState({
    title: '',
    youtubeUrl: '',
    topicId: topics[0]?.id || 'cultura-artesanato',
    description: '',
    duration: ''
  });

  // 2. Members
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberForm, setMemberForm] = useState<{
    name: string;
    role: string | undefined;
    turma: string;
    photoUrl: string;
    bio: string;
    photoFit?: 'contain' | 'cover';
  }>({
    name: '',
    role: '',
    turma: profile.turma || '8° B',
    photoUrl: '',
    bio: '',
    photoFit: 'cover'
  });

  // States for Member File Upload
  const [dragOverMemberId, setDragOverMemberId] = useState<string | null>(null);
  const [photoUploadingMemberId, setPhotoUploadingMemberId] = useState<string | null>(null);
  const [memberToast, setMemberToast] = useState<string | null>(null);
  const [isModalProcessingImage, setIsModalProcessingImage] = useState(false);
  const [isModalDragging, setIsModalDragging] = useState(false);
  const [modalImageError, setModalImageError] = useState<string | null>(null);
  const [showCustomUrlInput, setShowCustomUrlInput] = useState(false);

  // 3. Topics
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [topicForm, setTopicForm] = useState({
    title: '',
    shortSummary: '',
    content: '',
    category: 'cultura' as Topic['category'],
    iconName: 'book',
    image: '',
    highlightTag: '',
    keyFactsText: ''
  });

  // 4. Characteristics
  const [newCharText, setNewCharText] = useState('');
  const [editingCharIndex, setEditingCharIndex] = useState<number | null>(null);
  const [editingCharText, setEditingCharText] = useState('');

  // 5. Project Profile direct edit
  const [projectForm, setProjectForm] = useState({
    name: profile.name,
    subtitle: profile.subtitle,
    turma: profile.turma,
    country: profile.country,
    logoUrl: profile.logoUrl,
    standDescription: profile.standDescription
  });
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);

  // Handlers for Videos
  const openNewVideo = () => {
    setEditingVideo(null);
    setVideoForm({
      title: '',
      youtubeUrl: '',
      topicId: topics[0]?.id || 'cultura-artesanato',
      description: '',
      duration: ''
    });
    setVideoModalOpen(true);
  };

  const openEditVideo = (v: ProjectVideo) => {
    setEditingVideo(v);
    setVideoForm({
      title: v.title,
      youtubeUrl: v.youtubeUrl,
      topicId: v.topicId,
      description: v.description,
      duration: v.duration || ''
    });
    setVideoModalOpen(true);
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title.trim() || !videoForm.youtubeUrl.trim()) return;

    if (editingVideo) {
      updateVideo(editingVideo.id, {
        title: videoForm.title.trim(),
        youtubeUrl: videoForm.youtubeUrl.trim(),
        topicId: videoForm.topicId,
        description: videoForm.description.trim(),
        duration: videoForm.duration.trim()
      });
    } else {
      addVideo({
        title: videoForm.title.trim(),
        youtubeUrl: videoForm.youtubeUrl.trim(),
        topicId: videoForm.topicId,
        description: videoForm.description.trim(),
        duration: videoForm.duration.trim()
      });
    }
    setVideoModalOpen(false);
  };

  const confirmDeleteVideo = (v: ProjectVideo) => {
    setConfirmModal({
      isOpen: true,
      title: 'Confirmar Exclusão de Vídeo',
      message: `Tem certeza que deseja excluir o vídeo "${v.title}"? Esta ação não poderá ser desfeita.`,
      onConfirm: () => {
        deleteVideo(v.id);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Handlers for Members
  const handleMemberCardFileUpload = async (memberId: string, memberName: string, file: File) => {
    try {
      setPhotoUploadingMemberId(memberId);
      const dataUrl = await processImageFile(file);
      updateMember(memberId, { photoUrl: dataUrl });
      setMemberToast(`Foto de ${memberName} atualizada com sucesso pelo arquivo!`);
      setTimeout(() => setMemberToast(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Erro ao processar a imagem.');
    } finally {
      setPhotoUploadingMemberId(null);
    }
  };

  const handleModalFileUpload = async (file: File) => {
    try {
      setIsModalProcessingImage(true);
      setModalImageError(null);
      const dataUrl = await processImageFile(file);
      setMemberForm(prev => ({ ...prev, photoUrl: dataUrl }));
    } catch (err: any) {
      setModalImageError(err?.message || 'Erro ao processar a imagem do arquivo.');
    } finally {
      setIsModalProcessingImage(false);
    }
  };

  const openNewMember = () => {
    setEditingMember(null);
    setMemberForm({
      name: '',
      role: '',
      turma: profile.turma || '8° B',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: '',
      photoFit: 'cover'
    });
    setModalImageError(null);
    setShowCustomUrlInput(false);
    setMemberModalOpen(true);
  };

  const openEditMember = (m: TeamMember) => {
    setEditingMember(m);
    setMemberForm({
      name: m.name,
      role: m.role,
      turma: m.turma,
      photoUrl: m.photoUrl,
      bio: m.bio || '',
      photoFit: m.photoFit || 'cover'
    });
    setModalImageError(null);
    setShowCustomUrlInput(false);
    setMemberModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.name.trim()) return;

    if (editingMember) {
      updateMember(editingMember.id, {
        name: memberForm.name.trim(),
        role: memberForm.role?.trim() || '',
        turma: memberForm.turma.trim(),
        photoUrl: memberForm.photoUrl.trim(),
        bio: memberForm.bio.trim(),
        photoFit: memberForm.photoFit || 'cover'
      });
    } else {
      addMember({
        name: memberForm.name.trim(),
        role: memberForm.role?.trim() || '',
        turma: memberForm.turma.trim(),
        photoUrl: memberForm.photoUrl.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        bio: memberForm.bio.trim(),
        photoFit: memberForm.photoFit || 'cover'
      });
    }
    setMemberModalOpen(false);
  };

  const confirmDeleteMember = (m: TeamMember) => {
    setConfirmModal({
      isOpen: true,
      title: 'Confirmar Exclusão de Integrante',
      message: `Tem certeza que deseja remover ${m.name} do projeto da Turma 8° B?`,
      onConfirm: () => {
        deleteMember(m.id);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Handlers for Topics
  const openNewTopic = () => {
    setEditingTopic(null);
    setTopicForm({
      title: '',
      shortSummary: '',
      content: '',
      category: 'cultura',
      iconName: 'book',
      image: 'https://images.unsplash.com/photo-1528702748617-c64d49f918af?auto=format&fit=crop&w=1200&q=80',
      highlightTag: 'Novo Tema',
      keyFactsText: ''
    });
    setTopicModalOpen(true);
  };

  const openEditTopic = (t: Topic) => {
    setEditingTopic(t);
    setTopicForm({
      title: t.title,
      shortSummary: t.shortSummary,
      content: t.content,
      category: t.category,
      iconName: t.iconName,
      image: t.image,
      highlightTag: t.highlightTag || '',
      keyFactsText: t.keyFacts.join('\n')
    });
    setTopicModalOpen(true);
  };

  const handleSaveTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicForm.title.trim() || !topicForm.content.trim()) return;

    const parsedKeyFacts = topicForm.keyFactsText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (editingTopic) {
      updateTopic(editingTopic.id, {
        title: topicForm.title.trim(),
        shortSummary: topicForm.shortSummary.trim(),
        content: topicForm.content.trim(),
        category: topicForm.category,
        image: topicForm.image.trim(),
        highlightTag: topicForm.highlightTag.trim(),
        keyFacts: parsedKeyFacts.length > 0 ? parsedKeyFacts : ['Destaque da pesquisa escolar do 8° B']
      });
    } else {
      addTopic({
        title: topicForm.title.trim(),
        shortSummary: topicForm.shortSummary.trim(),
        content: topicForm.content.trim(),
        category: topicForm.category,
        iconName: topicForm.iconName,
        image: topicForm.image.trim() || 'https://images.unsplash.com/photo-1528702748617-c64d49f918af?auto=format&fit=crop&w=1200&q=80',
        highlightTag: topicForm.highlightTag.trim() || 'Novo Assunto',
        keyFacts: parsedKeyFacts.length > 0 ? parsedKeyFacts : ['Destaque da apresentação']
      });
    }
    setTopicModalOpen(false);
  };

  const confirmDeleteTopic = (t: Topic) => {
    setConfirmModal({
      isOpen: true,
      title: 'Confirmar Exclusão de Assunto',
      message: `Tem certeza que deseja excluir o assunto "${t.title}"? Todos os visitantes não verão mais este conteúdo.`,
      onConfirm: () => {
        deleteTopic(t.id);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Handlers for Characteristics
  const handleAddCharacteristic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharText.trim()) return;
    addCharacteristic(newCharText);
    setNewCharText('');
  };

  const handleSaveEditChar = (index: number) => {
    if (!editingCharText.trim()) return;
    editCharacteristic(index, editingCharText);
    setEditingCharIndex(null);
    setEditingCharText('');
  };

  const confirmDeleteChar = (index: number, charText: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Confirmar Exclusão de Característica',
      message: `Tem certeza que deseja excluir esta característica: "${charText}"?`,
      onConfirm: () => {
        deleteCharacteristic(index);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Handlers for Project Profile
  const handleSaveProjectProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: projectForm.name.trim(),
      subtitle: projectForm.subtitle.trim(),
      turma: projectForm.turma.trim(),
      country: projectForm.country.trim(),
      logoUrl: projectForm.logoUrl.trim(),
      standDescription: projectForm.standDescription.trim()
    });
    setProfileSuccessMsg(true);
    setTimeout(() => setProfileSuccessMsg(false), 3000);
  };

  return (
    <div id="admin-panel-root" className="min-h-[calc(100vh-5rem)] bg-slate-100 text-slate-800 flex flex-col md:flex-row">
      {/* ================================================================ */}
      {/* SIDEBAR LATERAL (MENU LATERAL SOLICITADO COM 4 ABAS)             */}
      {/* ================================================================ */}
      <aside
        id="admin-sidebar"
        className="w-full md:w-72 bg-white border-r border-slate-200 shrink-0 flex flex-col justify-between shadow-xs"
      >
        <div>
          {/* Header da Sidebar */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg">Painel do Estande</h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Turma 8° B • Gerenciador</p>
              </div>
            </div>
          </div>

          {/* Links do Menu Lateral */}
          <nav className="p-4 space-y-2">
            {/* 1. Vídeos do YouTube */}
            <button
              id="tab-btn-videos"
              onClick={() => setActiveTab('videos')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer ${
                activeTab === 'videos'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-red-500" />
                <span>Vídeos do YouTube</span>
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${activeTab === 'videos' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'}`}>
                {videos.length}
              </span>
            </button>

            {/* 2. Integrantes do Projeto */}
            <button
              id="tab-btn-integrantes"
              onClick={() => setActiveTab('integrantes')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer ${
                activeTab === 'integrantes'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-teal-600" />
                <span>Integrantes do Projeto</span>
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${activeTab === 'integrantes' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'}`}>
                {members.length}
              </span>
            </button>

            {/* 3. Nome, Logo & Características */}
            <button
              id="tab-btn-projeto"
              onClick={() => setActiveTab('projeto')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer ${
                activeTab === 'projeto'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span>Nome, Logo & Detalhes</span>
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${activeTab === 'projeto' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'}`}>
                {profile.characteristics.length}
              </span>
            </button>

            {/* 4. Assuntos e Tópicos */}
            <button
              id="tab-btn-assuntos"
              onClick={() => setActiveTab('assuntos')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer ${
                activeTab === 'assuntos'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Assuntos & Tópicos</span>
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${activeTab === 'assuntos' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'}`}>
                {topics.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50">
          <div className="bg-white rounded-xl p-3.5 border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">Turma Responsável:</p>
            <p className="text-sm font-bold text-slate-900">{profile.turma} • {profile.country}</p>
            <p className="text-xs text-slate-400 mt-0.5">{profile.event}</p>
          </div>
          <button
            id="btn-return-to-site"
            onClick={() => setCurrentView('visitor')}
            className="w-full mt-3 px-3.5 py-2.5 text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors flex items-center justify-center gap-2 cursor-pointer bg-white shadow-xs"
          >
            <Eye className="w-4 h-4" />
            <span>Ver Modo Visitante</span>
          </button>
        </div>
      </aside>

      {/* ================================================================ */}
      {/* ÁREA PRINCIPAL DO PAINEL                                         */}
      {/* ================================================================ */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-6xl">
        {/* ================================================================ */}
        {/* TAB 1: VIDEOS DO YOUTUBE                                        */}
        {/* ================================================================ */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                  <Video className="w-6 h-6 text-red-600" />
                  Gerenciar Vídeos do YouTube
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Cadastre links do YouTube com título, descrição e associe aos assuntos da feira escolar.
                </p>
              </div>

              {/* Botão Cadastrar Vídeo */}
              <button
                id="btn-cadastrar-video"
                onClick={openNewVideo}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Vídeo</span>
              </button>
            </div>

            {/* Grid de Vídeos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {videos.map(v => {
                const topic = topics.find(t => t.id === v.topicId);
                const thumb = getYouTubeThumbnail(v.youtubeUrl);

                return (
                  <div
                    key={v.id}
                    id={`video-card-${v.id}`}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Video Thumbnail */}
                      <div
                        className="relative aspect-video bg-slate-900 cursor-pointer group overflow-hidden"
                        onClick={() => setActiveVideoForModal(v)}
                      >
                        <img
                          src={thumb}
                          alt={v.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-current ml-0.5" />
                          </div>
                        </div>
                        {v.duration && (
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[11px] font-mono text-white">
                            {v.duration}
                          </span>
                        )}
                        {topic && (
                          <span className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-white/95 text-slate-800 text-xs font-bold shadow-xs">
                            {topic.title.split(':')[0]}
                          </span>
                        )}
                      </div>

                      {/* Video Info */}
                      <div className="p-4 sm:p-5">
                        <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
                          {v.title}
                        </h3>
                        {v.description && (
                          <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                            {v.description}
                          </p>
                        )}
                        <div className="mt-3 text-[11px] text-slate-400 truncate flex items-center gap-1">
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">{v.youtubeUrl}</span>
                        </div>
                      </div>
                    </div>

                    {/* Botões Editar e Excluir */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
                      <button
                        id={`btn-edit-video-${v.id}`}
                        onClick={() => openEditVideo(v)}
                        className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      <button
                        id={`btn-delete-video-${v.id}`}
                        onClick={() => confirmDeleteVideo(v)}
                        className="px-3 py-1.5 rounded-md text-xs font-semibold text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 2: INTEGRANTES DO PROJETO                                   */}
        {/* ================================================================ */}
        {activeTab === 'integrantes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                  <Users className="w-6 h-6 text-teal-700" />
                  Gerenciar Integrantes da Turma 8° B
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Adicione, edite ou troque a foto dos integrantes diretamente pelo explorador de arquivos ou arrastando uma foto.
                </p>
              </div>

              {/* Botão Cadastrar Integrante */}
              <button
                id="btn-cadastrar-integrante"
                onClick={openNewMember}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Integrante</span>
              </button>
            </div>

            {/* Notificação de Sucesso para Membro */}
            {memberToast && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs animate-fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{memberToast}</span>
              </div>
            )}

            {/* Grid de Integrantes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {members.map(m => {
                const isUploadingThis = photoUploadingMemberId === m.id;
                const isDragOver = dragOverMemberId === m.id;

                return (
                  <div
                    key={m.id}
                    id={`member-manage-card-${m.id}`}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3.5 mb-4">
                        {/* Avatar Interativo com Troca por Arquivo */}
                        <div
                          className={`relative w-16 h-16 rounded-full overflow-hidden border-2 transition-all bg-slate-100 shrink-0 group cursor-pointer ${
                            isDragOver
                              ? 'border-teal-500 ring-4 ring-teal-200 scale-105'
                              : 'border-slate-200 hover:border-teal-600'
                          }`}
                          title="Clique para abrir o explorador de arquivos ou arraste uma foto"
                          onClick={() => document.getElementById(`admin-upload-${m.id}`)?.click()}
                          onDragOver={e => {
                            e.preventDefault();
                            setDragOverMemberId(m.id);
                          }}
                          onDragLeave={() => setDragOverMemberId(null)}
                          onDrop={e => {
                            e.preventDefault();
                            setDragOverMemberId(null);
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              handleMemberCardFileUpload(m.id, m.name, e.dataTransfer.files[0]);
                            }
                          }}
                        >
                          <img
                            src={m.photoUrl}
                            alt={m.name}
                            className={`w-full h-full object-cover transition-transform duration-300 ${
                              isUploadingThis ? 'opacity-40' : 'group-hover:scale-105'
                            }`}
                          />

                          {/* Overlay com ícone da câmera */}
                          <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold">
                            <Camera className="w-4 h-4 mb-0.5" />
                            <span>Trocar</span>
                          </div>

                          {/* Loading indicator */}
                          {isUploadingThis && (
                            <div className="absolute inset-0 bg-teal-900/70 flex items-center justify-center text-white">
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            </div>
                          )}
                        </div>

                        <input
                          type="file"
                          id={`admin-upload-${m.id}`}
                          accept="image/*"
                          className="sr-only"
                          onChange={e => {
                            if (e.target.files && e.target.files[0]) {
                              handleMemberCardFileUpload(m.id, m.name, e.target.files[0]);
                              e.target.value = '';
                            }
                          }}
                        />

                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-slate-900 text-base truncate">
                            {m.name}
                          </h3>
                          <span className="inline-block text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 mt-0.5">
                            {m.turma}
                          </span>
                        </div>
                      </div>

                      {m.bio && (
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                          {m.bio}
                        </p>
                      )}
                    </div>

                    {/* Ações: Trocar Foto (Arquivo), Editar e Excluir */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <label
                        htmlFor={`admin-upload-${m.id}`}
                        className="px-2.5 py-1.5 rounded-md text-xs font-semibold text-teal-800 hover:text-teal-950 hover:bg-teal-50 border border-teal-200 hover:border-teal-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Abrir o explorador de arquivos para trocar a foto"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-teal-700" />
                        <span>Trocar Foto</span>
                      </label>

                      <div className="flex items-center gap-1.5">
                        <button
                          id={`btn-edit-member-${m.id}`}
                          onClick={() => openEditMember(m)}
                          className="px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>

                        <button
                          id={`btn-delete-member-${m.id}`}
                          onClick={() => confirmDeleteMember(m)}
                          className="px-2.5 py-1.5 rounded-md text-xs font-semibold text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Excluir</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 3: NOME, LOGO E CARACTERÍSTICAS                             */}
        {/* ================================================================ */}
        {activeTab === 'projeto' && (
          <div className="space-y-8">
            <div className="pb-4 border-b border-slate-200">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <Sparkles className="w-6 h-6 text-amber-600" />
                Nome, Logomarca e Características do Projeto
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Configure os dados exibidos no topo, no cabeçalho e na ficha técnica da Feira das Nações 2026.
              </p>
            </div>

            {/* Formulário Principal de Informações */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>Informações Gerais do Estande</span>
              </h3>

              {profileSuccessMsg && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Informações do projeto salvas com sucesso!</span>
                </div>
              )}

              <form onSubmit={handleSaveProjectProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nome do Estande / Projeto *
                    </label>
                    <input
                      type="text"
                      required
                      value={projectForm.name}
                      onChange={e => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Subtítulo / Descrição Curta *
                    </label>
                    <input
                      type="text"
                      required
                      value={projectForm.subtitle}
                      onChange={e => setProjectForm(prev => ({ ...prev, subtitle: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Turma Escolar
                    </label>
                    <input
                      type="text"
                      value={projectForm.turma}
                      onChange={e => setProjectForm(prev => ({ ...prev, turma: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      País Representado
                    </label>
                    <input
                      type="text"
                      value={projectForm.country}
                      onChange={e => setProjectForm(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Link da Logomarca (URL)
                    </label>
                    <input
                      type="url"
                      value={projectForm.logoUrl}
                      onChange={e => setProjectForm(prev => ({ ...prev, logoUrl: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Descrição Completa do Estande
                  </label>
                  <textarea
                    rows={3}
                    value={projectForm.standDescription}
                    onChange={e => setProjectForm(prev => ({ ...prev, standDescription: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    Salvar Informações do Projeto
                  </button>
                </div>
              </form>
            </div>

            {/* Gerenciamento das Características Dinâmicas */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                Características Oficiais do Projeto
              </h3>

              {/* Form Adicionar Característica */}
              <form onSubmit={handleAddCharacteristic} className="flex gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Ex: Réplicas de Pratos Lagans pintadas à mão..."
                  value={newCharText}
                  onChange={e => setNewCharText(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar</span>
                </button>
              </form>

              {/* Lista de Características */}
              <div className="space-y-2.5">
                {profile.characteristics.map((char, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm"
                  >
                    {editingCharIndex === idx ? (
                      <div className="flex items-center gap-2 flex-1 mr-2">
                        <input
                          type="text"
                          value={editingCharText}
                          onChange={e => setEditingCharText(e.target.value)}
                          className="flex-1 px-2.5 py-1 rounded border border-slate-300 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEditChar(idx)}
                          className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCharIndex(null)}
                          className="p-1.5 bg-slate-300 text-slate-700 rounded hover:bg-slate-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-700 font-medium">{char}</span>
                    )}

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingCharIndex(idx);
                          setEditingCharText(char);
                        }}
                        className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-200 transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => confirmDeleteChar(idx, char)}
                        className="p-1.5 text-red-600 hover:text-red-800 rounded hover:bg-red-50 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 4: ASSUNTOS E TÓPICOS                                       */}
        {/* ================================================================ */}
        {activeTab === 'assuntos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  Gerenciar Assuntos e Conteúdos
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Cadastre novos tópicos, edite textos da pesquisa e fatos-chave exibidos aos visitantes.
                </p>
              </div>

              {/* Botão Cadastrar Assunto */}
              <button
                id="btn-cadastrar-assunto"
                onClick={openNewTopic}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Assunto</span>
              </button>
            </div>

            {/* Lista de Assuntos */}
            <div className="space-y-4">
              {topics.map(t => (
                <div
                  key={t.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img
                        src={t.image}
                        alt={t.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                          {t.category}
                        </span>
                        {t.highlightTag && (
                          <span className="text-[11px] text-amber-700 font-bold">
                            {t.highlightTag}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">{t.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 max-w-2xl">
                        {t.shortSummary}
                      </p>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => openEditTopic(t)}
                      className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => confirmDeleteTopic(t)}
                      className="px-3 py-1.5 rounded-md text-xs font-semibold text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ================================================================ */}
      {/* MODAL FORMULÁRIO: VÍDEO (CADASTRAR / EDITAR)                      */}
      {/* ================================================================ */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {editingVideo ? 'Editar Vídeo do YouTube' : 'Cadastrar Novo Vídeo'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Informe o link do YouTube e os detalhes de apresentação para a feira.
            </p>

            <form onSubmit={handleSaveVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título do Vídeo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Samarcanda e os Monumentos Históricos"
                  value={videoForm.title}
                  onChange={e => setVideoForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Link Completo do YouTube *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoForm.youtubeUrl}
                  onChange={e => setVideoForm(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Assunto Associado
                  </label>
                  <select
                    value={videoForm.topicId}
                    onChange={e => setVideoForm(prev => ({ ...prev, topicId: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {topics.map(t => (
                      <option key={t.id} value={t.id}>{t.title.split(':')[0]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duração Estimada
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 4:20"
                    value={videoForm.duration}
                    onChange={e => setVideoForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descrição Curta
                </label>
                <textarea
                  rows={3}
                  placeholder="Explique o que o visitante aprenderá com este vídeo..."
                  value={videoForm.description}
                  onChange={e => setVideoForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs"
                >
                  {editingVideo ? 'Salvar Alterações' : 'Cadastrar Vídeo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL FORMULÁRIO: INTEGRANTE (CADASTRAR / EDITAR)                */}
      {/* ================================================================ */}
      {memberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setMemberModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {editingMember ? 'Editar Integrante' : 'Cadastrar Novo Integrante'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Preencha o nome, turma e foto da aluna da Turma 8° B.
            </p>

            <form onSubmit={handleSaveMember} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Camilla Souza"
                    value={memberForm.name}
                    onChange={e => setMemberForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Turma Escolar
                  </label>
                  <input
                    type="text"
                    value={memberForm.turma}
                    onChange={e => setMemberForm(prev => ({ ...prev, turma: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Foto com Explorador de Arquivos & Drag and Drop */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Foto do Integrante (Explorador de Arquivos)
                </label>

                {/* Dropzone & Seletor de Arquivos */}
                <div
                  className={`border-2 border-dashed rounded-xl p-4 transition-all text-center flex flex-col items-center justify-center ${
                    isModalDragging
                      ? 'border-teal-500 bg-teal-50/60'
                      : 'border-slate-300 hover:border-teal-400 bg-slate-50/60'
                  }`}
                  onDragOver={e => {
                    e.preventDefault();
                    setIsModalDragging(true);
                  }}
                  onDragLeave={() => setIsModalDragging(false)}
                  onDrop={e => {
                    e.preventDefault();
                    setIsModalDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleModalFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                >
                  <div className="flex items-center gap-4 w-full">
                    {/* Preview da Foto */}
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-teal-600 bg-slate-200 shrink-0 shadow-xs">
                      <img
                        src={memberForm.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                        alt="Foto do integrante"
                        className="w-full h-full object-cover"
                      />
                      {isModalProcessingImage && (
                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-left min-w-0">
                      <p className="text-xs font-bold text-slate-800 mb-1">
                        Carregar foto pelo Explorador de Arquivos
                      </p>
                      <p className="text-[11px] text-slate-500 mb-2">
                        Arraste uma imagem para cá ou clique no botão abaixo para navegar no seu computador/celular.
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        <label
                          htmlFor="modal-member-file-input"
                          className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                          <span>Selecionar Arquivo</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => setShowCustomUrlInput(prev => !prev)}
                          className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 underline cursor-pointer"
                        >
                          {showCustomUrlInput ? 'Ocultar campo de URL' : 'Ou inserir URL da web'}
                        </button>
                      </div>

                      <input
                        type="file"
                        id="modal-member-file-input"
                        accept="image/*"
                        className="sr-only"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            handleModalFileUpload(e.target.files[0]);
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>

                  {modalImageError && (
                    <div className="mt-2 text-xs text-red-600 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{modalImageError}</span>
                    </div>
                  )}
                </div>

                {/* Campo Opcional de URL */}
                {showCustomUrlInput && (
                  <div className="mt-2">
                    <input
                      type="url"
                      placeholder="https://exemplo.com/foto.jpg"
                      value={memberForm.photoUrl}
                      onChange={e => setMemberForm(prev => ({ ...prev, photoUrl: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Breve Descrição / Bio
                </label>
                <textarea
                  rows={3}
                  placeholder="Descreva a responsabilidade do aluno na feira..."
                  value={memberForm.bio}
                  onChange={e => setMemberForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setMemberModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs"
                >
                  {editingMember ? 'Salvar Alterações' : 'Cadastrar Integrante'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL FORMULÁRIO: ASSUNTO (CADASTRAR / EDITAR)                   */}
      {/* ================================================================ */}
      {topicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-xl p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setTopicModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {editingTopic ? 'Editar Assunto da Pesquisa' : 'Cadastrar Novo Assunto'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Informe o título, conteúdo da apresentação e pontos-chave.
            </p>

            <form onSubmit={handleSaveTopic} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Título do Assunto *
                  </label>
                  <input
                    type="text"
                    required
                    value={topicForm.title}
                    onChange={e => setTopicForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={topicForm.category}
                    onChange={e => setTopicForm(prev => ({ ...prev, category: e.target.value as Topic['category'] }))}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="apresentacao">Apresentação</option>
                    <option value="socioeconomia">Socioeconomia</option>
                    <option value="cultura">Cultura</option>
                    <option value="religiao">Religião</option>
                    <option value="monumentos">Monumentos</option>
                    <option value="figuras">Figuras</option>
                    <option value="culinaria">Culinária</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Resumo Curto (para o card) *
                </label>
                <input
                  type="text"
                  required
                  value={topicForm.shortSummary}
                  onChange={e => setTopicForm(prev => ({ ...prev, shortSummary: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL da Imagem Ilustrativa
                </label>
                <input
                  type="url"
                  value={topicForm.image}
                  onChange={e => setTopicForm(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Conteúdo Textual Completo da Apresentação *
                </label>
                <textarea
                  rows={5}
                  required
                  value={topicForm.content}
                  onChange={e => setTopicForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Fatos-Chave (1 por linha)
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: PIB de US$ 72,76 bilhões&#10;Principal recurso: gás natural e ouro&#10;População: 35 milhões"
                  value={topicForm.keyFactsText}
                  onChange={e => setTopicForm(prev => ({ ...prev, keyFactsText: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTopicModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                >
                  {editingTopic ? 'Salvar Alterações' : 'Cadastrar Assunto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO (OBRIGATÓRIO)                   */}
      {/* ================================================================ */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
