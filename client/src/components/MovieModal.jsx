import React from 'react';
import { X, Play, Plus, ThumbsUp } from 'lucide-react';
import { DoramaTags, EmotionalMeter, OppaCarousel, StreamingAvailability } from './DoramaFeatures';
import { Doramometro } from './Doramometro'; // Importando a nova feature

const MovieModal = ({ movie, onClose, onSearchActor }) => {
    if (!movie) return null;

    // Detectar data e tipo
    const firstDate = new Date(movie.first_air_date || movie.release_date);
    const genres = movie.genres ? movie.genres.map(g => g.name).join(', ') : '';
    const isTv = movie.first_air_date || movie.number_of_seasons; 
    
    // DEBUG: Mostra o ID no console para facilitar cadastro
    console.log("ID do Filme Atual (para cadastrar no Doramômetro):", movie.id);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 md:p-4">
            {/* Backdrop escuro clicável para fechar */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* Modal Content - Ajustado para mobile */}
            <div className="relative bg-zinc-900 rounded-lg shadow-2xl w-full md:w-[90%] max-w-5xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto hide-scrollbar">
                
                {/* Botão Fechar */}
                <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full hover:bg-black/80 transition"
                >
                    <X className="w-6 h-6 text-white" />
                </button>

                {/* Banner Hero do Modal */}
                <div className="relative h-[30vh] md:h-[50vh]">
                    <img 
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`} 
                        alt={movie.title || movie.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 md:bottom-6 md:left-8 md:right-8">
                        <h2 className="text-2xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg line-clamp-2">
                            {movie.title || movie.name}
                        </h2>
                        
                        <div className="flex flex-wrap gap-2 md:gap-4 mt-2 md:mt-4">
                            <button className="flex items-center gap-2 bg-white text-black px-4 py-1.5 md:px-8 md:py-2 rounded font-bold hover:bg-gray-200 transition text-sm md:text-base">
                                <Play className="fill-black w-4 h-4 md:w-5 md:h-5" /> Assistir
                            </button>
                            <button className="p-1.5 md:p-2 border-2 border-gray-500 rounded-full hover:border-white transition">
                                <Plus className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </button>
                            <button className="p-1.5 md:p-2 border-2 border-gray-500 rounded-full hover:border-white transition">
                                <ThumbsUp className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Detalhes (Texto) - Ajustado padding e grid */}
                <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 md:gap-0">
                    <div className="space-y-4 md:space-y-6 md:pr-8">
                        {/* Doramômetro em Destaque */}
                        <EmotionalMeter tmdbId={movie.id} voteAverage={movie.vote_average} />
                        
                        <div className="flex items-center gap-3 text-sm font-bold text-gray-400">
                             <span>{firstDate.getFullYear()}</span>
                             {movie.number_of_seasons && <span>{movie.number_of_seasons} Temporadas</span>}
                             <span className="border border-gray-600 px-1 text-xs rounded">HD</span>
                        </div>
                        
                        {/* FEATURE EXCLUSIVA: DORAMÔMETRO DE EMOÇÕES */}
                        <Doramometro movieId={movie.id} />

                        <p className="text-gray-300 text-sm md:text-lg leading-relaxed">
                            {movie.overview || "Sinopse não disponível para este título no momento."}
                        </p>
                        
                        {/* Tags de Tropos */}
                        <div className="pt-2">
                             <DoramaTags tmdbId={movie.id} />
                        </div>

                        {/* Onde Assistir (NOVO) */}
                        <StreamingAvailability tmdbId={movie.id} type={isTv ? 'tv' : 'movie'} />
                    </div>

                    <div className="space-y-4 md:space-y-6 text-sm text-gray-400 border-t md:border-t-0 md:border-l border-zinc-700 pt-6 md:pt-0 md:pl-8">
                         <div>
                            <span className="block text-gray-500 mb-1">Gêneros:</span>
                            <span className="text-white text-base">{genres || 'Variados'}</span>
                         </div>
                         <div>
                            <span className="block text-gray-500 mb-1">Título Original:</span>
                            <span className="text-white">{movie.original_title || movie.original_name}</span>
                         </div>
                         
                         {/* Novo Carrossel de Elenco */}
                         <OppaCarousel cast={movie.credits?.cast} onActorClick={onSearchActor} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MovieModal;
