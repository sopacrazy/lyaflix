import React from 'react';
import { X } from 'lucide-react';

const FullscreenPlayer = ({ videoUrl, onClose, title }) => {
    // Suporte a múltiplas fontes (Opção 1, Opção 2...)
    const sources = Array.isArray(videoUrl) ? videoUrl : [videoUrl];
    const [currentUrl, setCurrentUrl] = React.useState(sources[0]);
    const [activeIndex, setActiveIndex] = React.useState(0);

    if (!videoUrl) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
            {/* Header Mínimo */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-none">
                <div className="flex flex-col gap-1 pointer-events-auto">
                    <h2 className="text-white font-bold text-lg drop-shadow-md opacity-80 pl-2">{title}</h2>
                    
                    {/* Seletor de Player se houver mais de uma opção */}
                    {sources.length > 1 && (
                        <div className="flex gap-2 pl-2">
                            {sources.map((src, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { setCurrentUrl(src); setActiveIndex(idx); }}
                                    className={`text-xs px-3 py-1 rounded-full border transition ${
                                        activeIndex === idx 
                                        ? 'bg-white text-black border-white font-bold' 
                                        : 'bg-black/50 text-white border-white/30 hover:bg-white/20'
                                    }`}
                                >
                                    Player {idx + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

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
                    key={currentUrl} // Força recarregar iframe ao trocar URL
                    src={currentUrl} 
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
