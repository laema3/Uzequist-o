import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_PROJECT_PROFILE, INITIAL_TEAM_MEMBERS, INITIAL_TOPICS, INITIAL_VIDEOS } from '../data/initialData';
import { ProjectProfile, ProjectVideo, TeamMember, Topic } from '../types';

interface ProjectContextType {
  // Current view
  currentView: 'visitor' | 'admin';
  setCurrentView: (view: 'visitor' | 'admin') => void;

  // Device mode for responsiveness / smartphone preview
  deviceMode: 'responsive' | 'smartphone' | 'tablet';
  setDeviceMode: (mode: 'responsive' | 'smartphone' | 'tablet') => void;

  // Selected topic for visitor deep-dive
  selectedTopicId: string;
  setSelectedTopicId: (id: string) => void;

  // Active video in modal
  activeVideoForModal: ProjectVideo | null;
  setActiveVideoForModal: (video: ProjectVideo | null) => void;

  // Profile
  profile: ProjectProfile;
  updateProfile: (updated: Partial<ProjectProfile>) => void;
  addCharacteristic: (text: string) => void;
  editCharacteristic: (index: number, newText: string) => void;
  deleteCharacteristic: (index: number) => void;

  // Topics
  topics: Topic[];
  addTopic: (topic: Omit<Topic, 'id'>) => void;
  updateTopic: (id: string, topic: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;

  // Videos
  videos: ProjectVideo[];
  addVideo: (video: Omit<ProjectVideo, 'id'>) => void;
  updateVideo: (id: string, video: Partial<ProjectVideo>) => void;
  deleteVideo: (id: string) => void;

  // Team Members
  members: TeamMember[];
  addMember: (member: Omit<TeamMember, 'id'>) => void;
  updateMember: (id: string, member: Partial<TeamMember>) => void;
  deleteMember: (id: string) => void;

  // Reset
  resetAllToDefault: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'feiranacoes_profile_v2',
  TOPICS: 'feiranacoes_topics_v2',
  VIDEOS: 'feiranacoes_videos_v2',
  MEMBERS: 'feiranacoes_members_v2',
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'visitor' | 'admin'>('visitor');
  const [deviceMode, setDeviceMode] = useState<'responsive' | 'smartphone' | 'tablet'>('responsive');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('cultura-artesanato');
  const [activeVideoForModal, setActiveVideoForModal] = useState<ProjectVideo | null>(null);

  const [profile, setProfile] = useState<ProjectProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE) || localStorage.getItem('feiranacoes_profile_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'Uzbequistão: Coração da Rota da Seda' || !parsed.name) {
          parsed.name = 'As Belezas do Uzbequistão - Feira das Nações 2026';
        }
        if (!parsed.logoUrl || parsed.logoUrl.includes('photo-1540555700478')) {
          parsed.logoUrl = '/assets/uzbek_flag.svg';
        }
        return { ...INITIAL_PROJECT_PROFILE, ...parsed, name: 'As Belezas do Uzbequistão - Feira das Nações 2026', logoUrl: parsed.logoUrl || '/assets/uzbek_flag.svg' };
      } catch (e) { console.error(e); }
    }
    return INITIAL_PROJECT_PROFILE;
  });

  const [topics, setTopics] = useState<Topic[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TOPICS) || localStorage.getItem('feiranacoes_topics_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const filtered = parsed.filter((t: Topic) => t.id !== 'estande' && !t.title.toLowerCase().includes('apresentaremos'));
        const updated = filtered.map((t: Topic) => {
          if (t.id === 'cultura-artesanato' && (t.image.includes('photo-1540555700478') || !t.image.includes('lagan'))) {
            return { ...t, image: '/assets/uzbek_lagan.jpg', highlightTag: 'Artesanato Típico' };
          }
          return t;
        });
        if (updated.length > 0) return updated;
      } catch (e) { console.error(e); }
    }
    return INITIAL_TOPICS;
  });

  const [videos, setVideos] = useState<ProjectVideo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VIDEOS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_VIDEOS;
  });

  const [members, setMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as TeamMember[];
        return parsed.map(m => {
          if (m.name.toLowerCase().includes('laura') || m.id === 'm3') {
            return {
              ...m,
              photoFit: undefined,
              photoUrl: m.photoUrl.includes('photo-1524504388940-b1c1722653e1')
                ? 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80'
                : m.photoUrl
            };
          }
          return m;
        });
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_TEAM_MEMBERS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  // Profile operations
  const updateProfile = (updated: Partial<ProjectProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
  };

  const addCharacteristic = (text: string) => {
    if (!text.trim()) return;
    setProfile(prev => ({
      ...prev,
      characteristics: [...prev.characteristics, text.trim()]
    }));
  };

  const editCharacteristic = (index: number, newText: string) => {
    if (!newText.trim()) return;
    setProfile(prev => {
      const updated = [...prev.characteristics];
      updated[index] = newText.trim();
      return { ...prev, characteristics: updated };
    });
  };

  const deleteCharacteristic = (index: number) => {
    setProfile(prev => ({
      ...prev,
      characteristics: prev.characteristics.filter((_, i) => i !== index)
    }));
  };

  // Topics operations
  const addTopic = (topicData: Omit<Topic, 'id'>) => {
    const newTopic: Topic = {
      ...topicData,
      id: 'topic_' + Date.now().toString(36)
    };
    setTopics(prev => [newTopic, ...prev]);
  };

  const updateTopic = (id: string, topicData: Partial<Topic>) => {
    setTopics(prev => prev.map(t => (t.id === id ? { ...t, ...topicData } : t)));
  };

  const deleteTopic = (id: string) => {
    setTopics(prev => prev.filter(t => t.id !== id));
    if (selectedTopicId === id && topics.length > 1) {
      const remaining = topics.filter(t => t.id !== id);
      if (remaining[0]) setSelectedTopicId(remaining[0].id);
    }
  };

  // Videos operations
  const addVideo = (videoData: Omit<ProjectVideo, 'id'>) => {
    const newVideo: ProjectVideo = {
      ...videoData,
      id: 'vid_' + Date.now().toString(36)
    };
    setVideos(prev => [newVideo, ...prev]);
  };

  const updateVideo = (id: string, videoData: Partial<ProjectVideo>) => {
    setVideos(prev => prev.map(v => (v.id === id ? { ...v, ...videoData } : v)));
  };

  const deleteVideo = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
    if (activeVideoForModal?.id === id) {
      setActiveVideoForModal(null);
    }
  };

  // Members operations
  const addMember = (memberData: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: 'mem_' + Date.now().toString(36)
    };
    setMembers(prev => [...prev, newMember]);
  };

  const updateMember = (id: string, memberData: Partial<TeamMember>) => {
    setMembers(prev => prev.map(m => (m.id === id ? { ...m, ...memberData } : m)));
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  // Reset
  const resetAllToDefault = () => {
    setProfile(INITIAL_PROJECT_PROFILE);
    setTopics(INITIAL_TOPICS);
    setVideos(INITIAL_VIDEOS);
    setMembers(INITIAL_TEAM_MEMBERS);
    setSelectedTopicId('estande');
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.TOPICS);
    localStorage.removeItem(STORAGE_KEYS.VIDEOS);
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
  };

  return (
    <ProjectContext.Provider
      value={{
        currentView,
        setCurrentView,
        deviceMode,
        setDeviceMode,
        selectedTopicId,
        setSelectedTopicId,
        activeVideoForModal,
        setActiveVideoForModal,
        profile,
        updateProfile,
        addCharacteristic,
        editCharacteristic,
        deleteCharacteristic,
        topics,
        addTopic,
        updateTopic,
        deleteTopic,
        videos,
        addVideo,
        updateVideo,
        deleteVideo,
        members,
        addMember,
        updateMember,
        deleteMember,
        resetAllToDefault
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
