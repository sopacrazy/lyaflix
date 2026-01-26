import React, { useEffect, useState } from 'react';
import { EMOTIONAL_DATA } from '../data/emotionalData';
import { Heart, Angry, Frown, Laugh } from 'lucide-react'; // Ícones como fallback ou complemento

// Configuração Visual dos Moods
const MOOD_CONFIG = {
    sad: {
        icon: '😭',
        label: 'Prepara o lencinho',
        className: 'bg-blue-900/40 text-blue-200 border-blue-500/50'
    },
    romance: {
        icon: '🦋',
        label: 'Frio na barriga',
        className: 'bg-pink-900/40 text-pink-200 border-pink-500/50'
    },
    angry: {
        icon: '😡',
        label: 'Pra passar raiva',
        className: 'bg-red-900/40 text-red-200 border-red-500/50'
    },
    funny: {
        icon: '😂',
        label: 'Comédia leve',
        className: 'bg-yellow-900/40 text-yellow-200 border-yellow-500/50'
    }
};

export const Doramometro = ({ movieId }) => {
    // Busca dados manuais para este filme
    const emotions = EMOTIONAL_DATA[movieId];

    // Se não tiver dados, não renderiza nada (componente invisível)
    if (!emotions || emotions.length === 0) return null;

    return (
        <div className="mb-4 animate-in slide-in-from-left-4 fade-in duration-500">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                Doramômetro <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></span>
            </h4>
            
            <div className="flex flex-wrap gap-2">
                {emotions.map((moodKey) => {
                    const config = MOOD_CONFIG[moodKey];
                    if (!config) return null;

                    return (
                        <div 
                            key={moodKey}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs md:text-sm font-medium backdrop-blur-sm shadow-sm transition-transform hover:scale-105 select-none ${config.className}`}
                        >
                            <span className="text-base md:text-lg leading-none filter drop-shadow-md">
                                {config.icon}
                            </span>
                            <span>{config.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
