import React, { useState, useEffect } from 'react';
import { CUSTOM_DORAMA_DATA, TROPE_BADGES, MOODS } from '../data/customDoramaData';
import { Star, TrendingUp, MonitorPlay } from 'lucide-react';
import Tmdb from '../services/tmdb'; // Importando para busca de streamings

// === ONDE ASSISTIR (STREAMING) === //
export const StreamingAvailability = ({ tmdbId, type }) => {
    const [providers, setProviders] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProviders = async () => {
            setLoading(true);
            // Corrige type se vier como 'series' ou outros formatos
            const apiType = (type === 'movie') ? 'movie' : 'tv';
            
            // Busca provedores
            const data = await Tmdb.getWatchProviders(tmdbId, apiType);
            
            // Tenta pegar flatrate (streamings por assinatura), senão tenta free ou ads
            if(data) {
                setProviders(data.flatrate || data.ads || data.free || null);
            } else {
                setProviders(null); 
            }
            setLoading(false);
        };

        if(tmdbId) fetchProviders();
    }, [tmdbId, type]);

    if(loading) return <div className="animate-pulse h-8 w-32 bg-zinc-800 rounded"></div>;

    if(!providers || providers.length === 0) {
        return (
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-4 bg-zinc-800/50 p-2 rounded w-fit">
                <MonitorPlay className="w-4 h-4" />
                <span>Indisponível em streamings (BR)</span>
            </div>
        );
    }

    return (
        <div className="mt-6">
             <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                Onde Assistir <MonitorPlay className="w-3 h-3 text-red-500" />
             </h4>
             <div className="flex flex-wrap gap-3">
                 {providers.map((provider) => (
                     <div key={provider.provider_id} className="group relative">
                         <img 
                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} 
                            alt={provider.provider_name}
                            title={provider.provider_name}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-lg border-2 border-transparent group-hover:border-white transition-all cursor-pointer"
                         />
                         {/* Tooltip simples */}
                         <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-10">
                             {provider.provider_name}
                         </div>
                     </div>
                 ))}
             </div>
        </div>
    );
};


// === TAGS DOS DORAMAS === //
export const DoramaTags = ({ tmdbId }) => {
    // Tenta encontrar dados personalizados para este ID
    const customData = CUSTOM_DORAMA_DATA[tmdbId];

    if (!customData || !customData.tags) {
        // Fallback: Se não tiver tags manuais, podemos mostrar algo padrão ou nada
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {customData.tags.map((tagKey) => {
                const badge = TROPE_BADGES[tagKey];
                if (!badge) return null;

                return (
                    <span 
                        key={tagKey} 
                        className={`text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full border ${badge.color} shadow-sm backdrop-blur-md transition-all hover:scale-105 cursor-default select-none`}
                    >
                        {badge.label}
                    </span>
                );
            })}
        </div>
    );
};


// === DORAMÔMETRO (EMOTIONAL METER) === //
export const EmotionalMeter = ({ tmdbId, voteAverage }) => {
    const customData = CUSTOM_DORAMA_DATA[tmdbId];
    // Se não tiver mood definido, usa a nota do TMDB como fallback
    const mood = customData ? MOODS[customData.mood] : null;

    if (!mood) {
        // Fallback para nota padrão bonita
        return (
             <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1.5 rounded-lg w-fit">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-yellow-100 font-bold text-sm">{(voteAverage * 10).toFixed(0)}% <span className="text-yellow-500/60 font-medium text-xs">de aprovação</span></span>
             </div>
        );
    }

    return (
        <div className="flex items-center gap-3 animate-in zoom-in duration-300">
            <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-full bg-zinc-800 border-2 border-dashed border-zinc-600 shadow-lg ${mood.color}`}>
                <span className="text-2xl filter drop-shadow-md">{mood.icon}</span>
            </div>
            
            <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Vibe Principal</span>
                <span className={`text-sm md:text-base font-bold ${mood.color}`}>
                    {mood.label}
                </span>
            </div>

            {/* Divisor */}
            <div className="w-px h-8 bg-zinc-700 mx-2 hidden md:block"></div>

            {/* Mantém a nota original ao lado */}
            <div className="hidden md:flex items-center gap-1.5 opacity-60">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-300">{(voteAverage * 10).toFixed(0)}%</span>
            </div>
        </div>
    );
};


// === QUEM É ESSE OPPA? (CAST CAROUSEL) === //
export const OppaCarousel = ({ cast, onActorClick }) => {
    if (!cast || cast.length === 0) return null;

    // Pega apenas os 10 primeiros
    const topCast = cast.slice(0, 10);

    return (
        <div className="space-y-3 mt-8 w-full">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                Quem é esse Oppa? <span className="text-[10px] px-1 bg-red-600/20 text-red-400 rounded">Elenco</span>
            </h3>
            
            {/* Adicionei 'w-full' e padding adequado para evitar cortes em telas pequenas */}
            <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth hide-scrollbar px-1 w-full" style={{ scrollbarWidth: 'none' }}>
                {topCast.map((actor) => (
                    <div 
                        key={actor.id} 
                        onClick={() => onActorClick && onActorClick(actor)}
                        className="flex flex-col items-center gap-2 min-w-[80px] group cursor-pointer"
                    >
                        {/* Foto Circular com Efeito de Hover */}
                        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-zinc-700 group-hover:border-red-500 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                            {actor.profile_path ? (
                                <img 
                                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} 
                                    alt={actor.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-xs text-gray-500">?</div>
                            )}
                        </div>
                        
                        {/* Nome e Personagem */}
                        <div className="text-center w-20">
                            <p className="text-[10px] md:text-xs font-bold text-gray-300 group-hover:text-white truncate leading-tight">
                                {actor.name}
                            </p>
                            <p className="text-[9px] text-gray-500 truncate leading-tight mt-0.5">
                                {actor.character}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
