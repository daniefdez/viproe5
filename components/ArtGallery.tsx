import React, { useState, useEffect } from 'react';
import { IconWand, IconSparkles, IconPhoto } from './icons';

interface ArtPiece {
  id: number;
  imageUrl: string;
  prompt: string;
  style: string;
  artist: string;
}

const mockArtPieces: ArtPiece[] = [
  {
    id: 1,
    imageUrl: 'https://picsum.photos/seed/art1/400/600',
    prompt: 'A majestic dragon soaring through clouds of stardust, digital painting, fantasy art',
    style: 'Fantasy Digital Art',
    artist: 'AI Artist'
  },
  {
    id: 2,
    imageUrl: 'https://picsum.photos/seed/art2/400/600',
    prompt: 'Cyberpunk cityscape at night with neon reflections, photorealistic, 8k',
    style: 'Cyberpunk Photography',
    artist: 'AI Artist'
  },
  {
    id: 3,
    imageUrl: 'https://picsum.photos/seed/art3/400/600',
    prompt: 'Abstract geometric patterns in vibrant colors, modern art style',
    style: 'Abstract Modern',
    artist: 'AI Artist'
  },
  {
    id: 4,
    imageUrl: 'https://picsum.photos/seed/art4/400/600',
    prompt: 'Serene mountain landscape with misty valleys, oil painting style',
    style: 'Landscape Oil Painting',
    artist: 'AI Artist'
  },
  {
    id: 5,
    imageUrl: 'https://picsum.photos/seed/art5/400/600',
    prompt: 'Futuristic robot in a garden of mechanical flowers, steampunk aesthetic',
    style: 'Steampunk Art',
    artist: 'AI Artist'
  },
  {
    id: 6,
    imageUrl: 'https://picsum.photos/seed/art6/400/600',
    prompt: 'Portrait of a wise old wizard with glowing eyes, fantasy illustration',
    style: 'Fantasy Portrait',
    artist: 'AI Artist'
  }
];

interface ArtGalleryProps {
  onRemix?: (prompt: string) => void;
}

export const ArtGallery: React.FC<ArtGalleryProps> = ({ onRemix }) => {
  const [selectedArt, setSelectedArt] = useState<ArtPiece | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRemix = (prompt: string) => {
    if (onRemix) {
      onRemix(prompt);
    }
  };

  const handleLike = (artId: number) => {
    // Implementar sistema de likes
    console.log('Liked art:', artId);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-200 mb-4 flex items-center justify-center gap-3">
          <IconPhoto className="w-8 h-8 text-purple-400" />
          Galería de Arte IA
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Explora creaciones únicas generadas por inteligencia artificial. Haz clic en "Remezclar" para usar cualquier prompt como inspiración.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockArtPieces.map((art) => (
          <div
            key={art.id}
            className="group relative bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={art.imageUrl}
                alt={art.prompt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-sm mb-2 line-clamp-2">{art.prompt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 bg-slate-900/50 px-2 py-1 rounded">
                    {art.style}
                  </span>
                  <button
                    onClick={() => handleRemix(art.prompt)}
                    className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors"
                  >
                    <IconWand className="w-3 h-3" />
                    Remezclar
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-200 text-sm truncate">
                    {art.style}
                  </h3>
                  <p className="text-xs text-slate-400">por {art.artist}</p>
                </div>
                <button
                  onClick={() => handleLike(art.id)}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button
          onClick={() => setIsLoading(!isLoading)}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 text-white font-semibold py-3 px-8 rounded-lg transition-all disabled:opacity-50 mx-auto"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Cargando más arte...
            </>
          ) : (
            <>
              <IconSparkles className="w-5 h-5" />
              Cargar Más Creaciones
            </>
          )}
        </button>
      </div>
    </div>
  );
};