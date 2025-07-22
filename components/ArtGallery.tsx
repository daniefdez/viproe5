import React, { useState, useEffect } from 'react';
import { IconWand, IconSparkles, IconPhoto, IconHeart, IconEye, IconDownload } from './icons';

interface ArtPiece {
  id: number;
  imageUrl: string;
  prompt: string;
  style: string;
  artist: string;
  likes: number;
  views: number;
  isLiked: boolean;
}

const mockArtPieces: ArtPiece[] = [
  {
    id: 1,
    imageUrl: 'https://picsum.photos/seed/cyberpunk1/400/600',
    prompt: 'A majestic cyberpunk dragon soaring through neon-lit clouds above a futuristic city, digital art, 8k resolution',
    style: 'Cyberpunk Fantasy',
    artist: 'VisionAI Pro',
    likes: 1247,
    views: 8934,
    isLiked: false
  },
  {
    id: 2,
    imageUrl: 'https://picsum.photos/seed/nature1/400/600',
    prompt: 'Ethereal forest with bioluminescent plants and floating particles of light, magical realism, cinematic lighting',
    style: 'Magical Realism',
    artist: 'VisionAI Pro',
    likes: 892,
    views: 5621,
    isLiked: true
  },
  {
    id: 3,
    imageUrl: 'https://picsum.photos/seed/space1/400/600',
    prompt: 'Astronaut discovering ancient alien ruins on a distant planet, photorealistic, dramatic composition',
    style: 'Sci-Fi Photography',
    artist: 'VisionAI Pro',
    likes: 2156,
    views: 12847,
    isLiked: false
  },
  {
    id: 4,
    imageUrl: 'https://picsum.photos/seed/portrait1/400/600',
    prompt: 'Portrait of a wise elder with eyes that hold the secrets of the universe, oil painting style, Renaissance lighting',
    style: 'Classical Portrait',
    artist: 'VisionAI Pro',
    likes: 743,
    views: 4329,
    isLiked: false
  },
  {
    id: 5,
    imageUrl: 'https://picsum.photos/seed/abstract1/400/600',
    prompt: 'Abstract representation of consciousness emerging from digital chaos, vibrant colors, modern art',
    style: 'Digital Abstract',
    artist: 'VisionAI Pro',
    likes: 1589,
    views: 9876,
    isLiked: true
  },
  {
    id: 6,
    imageUrl: 'https://picsum.photos/seed/steampunk1/400/600',
    prompt: 'Victorian inventor in a steampunk workshop filled with brass gears and glowing inventions, detailed illustration',
    style: 'Steampunk Art',
    artist: 'VisionAI Pro',
    likes: 967,
    views: 6543,
    isLiked: false
  }
];

interface ArtGalleryProps {
  onRemix?: (prompt: string) => void;
}

export const ArtGallery: React.FC<ArtGalleryProps> = ({ onRemix }) => {
  const [artPieces, setArtPieces] = useState<ArtPiece[]>(mockArtPieces);
  const [selectedArt, setSelectedArt] = useState<ArtPiece | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const handleRemix = (prompt: string) => {
    if (onRemix) {
      onRemix(prompt);
    }
  };

  const handleLike = (artId: number) => {
    setArtPieces(prev => prev.map(art => 
      art.id === artId 
        ? { ...art, likes: art.isLiked ? art.likes - 1 : art.likes + 1, isLiked: !art.isLiked }
        : art
    ));
  };

  const handleView = (artId: number) => {
    setArtPieces(prev => prev.map(art => 
      art.id === artId ? { ...art, views: art.views + 1 } : art
    ));
  };

  const filteredArt = filter === 'all' 
    ? artPieces 
    : artPieces.filter(art => art.style.toLowerCase().includes(filter.toLowerCase()));

  const styles = ['all', 'cyberpunk', 'fantasy', 'sci-fi', 'portrait', 'abstract', 'steampunk'];

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-slate-200 mb-4 flex items-center justify-center gap-3">
          <IconPhoto className="w-8 h-8 text-purple-400" />
          Galería de Arte IA
        </h2>
        <p className="text-slate-400 max-w-3xl mx-auto mb-6">
          Explora creaciones únicas generadas por inteligencia artificial. Cada obra es una ventana a mundos imposibles, 
          creados por la imaginación sin límites de la IA.
        </p>
        
        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {styles.map(style => (
            <button
              key={style}
              onClick={() => setFilter(style)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === style 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
              }`}
            >
              {style === 'all' ? 'Todos' : style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArt.map((art) => (
          <div
            key={art.id}
            className="group relative bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
          >
            <div className="aspect-[3/4] overflow-hidden relative">
              <img
                src={art.imageUrl}
                alt={art.prompt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onClick={() => {
                  setSelectedArt(art);
                  handleView(art.id);
                }}
              />
              
              {/* Overlay con estadísticas */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs text-white">
                  <IconEye className="w-3 h-3" />
                  {art.views.toLocaleString()}
                </div>
                <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs text-white">
                  <IconHeart className={`w-3 h-3 ${art.isLiked ? 'text-red-400' : ''}`} />
                  {art.likes.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white text-sm mb-3 line-clamp-3 leading-relaxed">{art.prompt}</p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs text-purple-300 bg-purple-900/50 px-2 py-1 rounded-full">
                      {art.style}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">por {art.artist}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemix(art.prompt);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 text-white text-sm px-4 py-2 rounded-lg font-semibold transition-all flex-1"
                  >
                    <IconWand className="w-4 h-4" />
                    Remezclar
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(art.id);
                    }}
                    className={`p-2 rounded-lg transition-all ${
                      art.isLiked 
                        ? 'bg-red-600 text-white' 
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-red-400'
                    }`}
                  >
                    <IconHeart className="w-4 h-4" />
                  </button>
                  
                  <a
                    href={art.imageUrl}
                    download={`visionai-art-${art.id}.jpg`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white rounded-lg transition-all"
                  >
                    <IconDownload className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para vista detallada */}
      {selectedArt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedArt(null)}>
          <div className="max-w-4xl w-full bg-slate-800 rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="aspect-square lg:aspect-auto">
                <img src={selectedArt.imageUrl} alt={selectedArt.prompt} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{selectedArt.style}</h3>
                <p className="text-slate-300 mb-4 leading-relaxed">{selectedArt.prompt}</p>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-slate-400">
                    <IconEye className="w-5 h-5" />
                    <span>{selectedArt.views.toLocaleString()} vistas</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <IconHeart className={`w-5 h-5 ${selectedArt.isLiked ? 'text-red-400' : ''}`} />
                    <span>{selectedArt.likes.toLocaleString()} likes</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      handleRemix(selectedArt.prompt);
                      setSelectedArt(null);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 text-white px-6 py-3 rounded-lg font-semibold transition-all flex-1"
                  >
                    <IconWand className="w-5 h-5" />
                    Remezclar Prompt
                  </button>
                  
                  <button
                    onClick={() => setSelectedArt(null)}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-all"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mt-12">
        <button
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 2000);
          }}
          disabled={isLoading}
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 text-white font-bold py-4 px-8 rounded-xl transition-all disabled:opacity-50 mx-auto shadow-lg shadow-purple-500/30"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              Cargando más arte...
            </>
          ) : (
            <>
              <IconSparkles className="w-6 h-6" />
              Descubrir Más Creaciones
            </>
          )}
        </button>
      </div>
    </div>
  );
};