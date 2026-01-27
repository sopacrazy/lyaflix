import React from 'react';
import { X } from 'lucide-react';

const FullscreenPlayer = ({ videoUrl, onClose, title }) => {
    if (!videoUrl) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
            {/* Header Mínimo */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-none">
                <h2 className="text-white font-bold text-lg drop-shadow-md opacity-80 pl-2">{title}</h2>
                <button 
                    onClick={onClose}
                    className="pointer-events-auto bg-white/10 p-2 rounded-full hover:bg-white/20 transition text-white backdrop-blur-sm"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Container do Iframe (Responsivo) */}
            <div className="flex-1 w-full h-full">
                <iframe 
                    src={videoUrl} 
                    title={title}
                    className="w-full h-full border-none"
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default FullscreenPlayer;
