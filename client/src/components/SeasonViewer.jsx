import React, { useState, useEffect } from 'react';
import { Play, ChevronDown, Lock } from 'lucide-react';
import Tmdb from '../services/tmdb';
import { getVideoLink } from '../data/customVideos';

const SeasonViewer = ({ tvId, seasons, onPlayEpisode }) => {
    const [activeSeason, setActiveSeason] = useState(1);
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filtra apenas temporadas reais (ignora a "Temporada 0" de especiais se quiser, ou mantém)
    const validSeasons = seasons ? seasons.filter(s => s.season_number > 0) : [];

    useEffect(() => {
        if(tvId && activeSeason) {
            loadEpisodes(activeSeason);
        }
    }, [tvId, activeSeason]);

    const loadEpisodes = async (seasonNum) => {
        setLoading(true);
        const data = await Tmdb.getSeasonInfo(tvId, seasonNum);
        if(data && data.episodes) {
            setEpisodes(data.episodes);
        }
        setLoading(false);
    };

    return (
        <div className="mt-8 border-t border-zinc-800 pt-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Episódios</h3>
                
                {/* Seletor de Temporada */}
                <div className="relative">
                    <select 
                        value={activeSeason}
                        onChange={(e) => setActiveSeason(Number(e.target.value))}
                        className="appearance-none bg-zinc-800 border border-zinc-600 text-white py-2 pl-4 pr-10 rounded font-bold focus:outline-none focus:border-red-600 cursor-pointer"
                    >
                        {validSeasons.map(season => (
                            <option key={season.id} value={season.season_number}>
                                {season.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Lista de Episódios */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Carregando episódios...</div>
                ) : (
                    episodes.map(episode => {
                        // Verifica se tem link disponível no nosso sistema
                        const hasLink = getVideoLink(tvId, activeSeason, episode.episode_number);

                        return (
                            <div 
                                key={episode.id} 
                                className={`flex gap-4 p-4 rounded-lg transition group ${hasLink ? 'hover:bg-zinc-800 cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                                onClick={() => hasLink && onPlayEpisode(episode, activeSeason)}
                            >
                                {/* Thumbnail do Episódio */}
                                <div className="relative w-32 md:w-40 aspect-video flex-shrink-0 bg-zinc-800 rounded overflow-hidden">
                                    {episode.still_path ? (
                                        <img 
                                            src={`https://image.tmdb.org/t/p/w300${episode.still_path}`} 
                                            alt={episode.name} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold">LyaFlix</div>
                                    )}
                                    
                                    {/* Overlay de Play */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                       {hasLink ? (
                                           <div className="bg-black/50 p-2 rounded-full border border-white/50 opacity-0 group-hover:opacity-100 transition">
                                               <Play className="w-5 h-5 text-white fill-white" />
                                           </div>
                                       ) : (
                                           <Lock className="w-5 h-5 text-gray-400" />
                                       )}
                                    </div>
                                    
                                    {/* Barra de progresso (futuro) */}
                                    <div className="absolute bottom-2 right-2 bg-black/70 px-1.5 py-0.5 rounded text-[10px] font-bold text-white">
                                        {episode.runtime || 45}m
                                    </div>
                                </div>

                                {/* Infos */}
                                <div className="flex-1">
                                    <h4 className="font-bold text-white text-base md:text-lg flex justify-between">
                                        <span>{episode.episode_number}. {episode.name}</span>
                                    </h4>
                                    <p className="text-gray-400 text-sm mt-2 line-clamp-2 md:line-clamp-3">
                                        {episode.overview || "Sem descrição disponível."}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default SeasonViewer;
