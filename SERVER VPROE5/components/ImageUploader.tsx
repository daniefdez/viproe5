
import React, { useState, useCallback } from 'react';
import { IconUpload } from './icons';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return `Tipo de archivo no válido. Solo se permiten PNG, JPG, WEBP.`;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `El archivo es demasiado grande. El tamaño máximo es de ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  };

  const processFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
    } else {
      setError(null);
      onImageSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
    e.target.value = ''; // Reset file input to allow re-uploading the same file
  };

  const handleDragEvents = useCallback((e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
    if (dragging) {
      setError(null); // Clear error when user starts a new drag action
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [handleDragEvents, onImageSelect]);

  return (
    <div
      className={`relative w-full max-w-3xl mx-auto h-80 border-2 border-dashed rounded-2xl flex flex-col justify-center items-center text-center p-6 cursor-pointer transition-all duration-300 ${
        error ? 'border-red-600 bg-red-900/20' : isDragging ? 'border-purple-400 bg-slate-700/50 scale-105' : 'border-slate-600 hover:border-slate-500 bg-slate-800/50'
      }`}
      onDragEnter={(e) => handleDragEvents(e, true)}
      onDragOver={(e) => handleDragEvents(e, true)}
      onDragLeave={(e) => handleDragEvents(e, false)}
      onDrop={handleDrop}
      onClick={() => !error && document.getElementById('file-input')?.click()}
    >
      <input
        type="file"
        id="file-input"
        className="hidden"
        accept={ALLOWED_MIME_TYPES.join(',')}
        onChange={handleFileChange}
      />
       {error ? (
        <div className="text-red-300 px-4">
          <h3 className="text-lg font-bold">Error de Archivo</h3>
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-slate-400">
            <IconUpload className={`w-16 h-16 transition-transform ${isDragging ? 'scale-110' : ''}`} />
            <p className="text-xl font-semibold text-slate-300">
            Arrastra y suelta una imagen aquí
            </p>
            <p>o</p>
            <span className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-slate-200 font-semibold transition-colors">
            Explorar Archivos
            </span>
            <p className="text-xs text-slate-500 mt-2">
            Soporta PNG, JPG, WEBP. Máximo {MAX_FILE_SIZE_MB}MB.
            </p>
        </div>
      )}
    </div>
  );
};
