import React from 'react';
import { X, ExternalLink, Play } from 'lucide-react';
import { ProjectVideo } from '../types';
import { getYouTubeEmbedUrl } from '../utils/youtube';

interface VideoModalProps {
  video: ProjectVideo | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  if (!video) return null;

  const embedUrl = getYouTubeEmbedUrl(video.youtubeUrl);

  return (
    <div
      id="video-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="video-modal-content"
        className="bg-white border border-slate-200 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3 pr-6">
            <div className="p-2 rounded-lg bg-red-100 text-red-600">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg line-clamp-1">
                {video.title}
              </h3>
              {video.duration && (
                <span className="text-xs text-slate-500">Duração: {video.duration}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              id="link-open-youtube-direct"
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors text-xs flex items-center gap-1"
              title="Abrir diretamente no YouTube"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">YouTube</span>
            </a>
            <button
              id="btn-close-video-modal"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Embed Frame */}
        <div className="relative w-full aspect-video bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <p className="text-sm font-semibold mb-2">Vídeo indisponível para incorporação direta.</p>
              <a
                href={video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Assistir no YouTube
              </a>
            </div>
          )}
        </div>

        {/* Description & Topic badge */}
        {video.description && (
          <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-slate-600">
            <p className="leading-relaxed line-clamp-2 max-w-2xl">{video.description}</p>
            <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-bold shrink-0 border border-slate-200">
              Assunto: {video.topicId}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
