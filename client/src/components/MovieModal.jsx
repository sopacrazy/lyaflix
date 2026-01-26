import React from 'react';
import { X, Play, Plus, ThumbsUp } from 'lucide-react';

const MovieModal = ({ movie, onClose }) => {
    if (!movie) return null;

    // Detectar data
    const firstDate = new Date(movie.first_air_date || movie.release_date);
    const genres = movie.genres ? movie.genres.map(g => g.name).join(', ') : '';

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop escuro clicável para fechar */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-zinc-900 rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto hide-scrollbar">
                
                {/* Botão Fechar */}
                <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full hover:bg-black/80 transition"
                >
                    <X className="w-6 h-6 text-white" />
                </button>

                {/* Banner Hero do Modal */}
                <div className="relative h-[40vh] md:h-[50vh]">
                    <img 
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`} 
                        alt={movie.title || movie.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-6 left-8 right-8">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                            {movie.title || movie.name}
                        </h2>
                        
                        <div className="flex flex-wrap gap-4 mt-4">
                            <button className="flex items-center gap-2 bg-white text-black px-8 py-2 rounded font-bold hover:bg-gray-200 transition">
                                <Play className="fill-black w-5 h-5" /> Assistir
                            </button>
                            <button className="p-2 border-2 border-gray-500 rounded-full hover:border-white transition">
                                <Plus className="w-5 h-5 text-white" />
                            </button>
                            <button className="p-2 border-2 border-gray-500 rounded-full hover:border-white transition">
                                <ThumbsUp className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Detalhes (Texto) */}
                <div className="p-8 grid md:grid-cols-[2fr_1fr] gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm font-bold text-gray-400">
                             <span className="text-green-400">{(movie.vote_average * 10).toFixed(0)}% Relevante</span>
                             <span>{firstDate.getFullYear()}</span>
                             {movie.number_of_seasons && <span>{movie.number_of_seasons} Temporadas</span>}
                             <span className="border border-gray-600 px-1 text-xs rounded">HD</span>
                        </div>
                        
                        <p className="text-gray-300 text-lg leading-relaxed">
                            {movie.overview || "Sinopse não disponível para este título no momento."}
                        </p>
                    </div>

                    <div className="space-y-4 text-sm text-gray-400">
                         <div>
                            <span className="block text-gray-500 mb-1">Gêneros:</span>
                            <span className="text-white">{genres || 'Variados'}</span>
                         </div>
                         <div>
                            <span className="block text-gray-500 mb-1">Título Original:</span>
                            <span className="text-white">{movie.original_title || movie.original_name}</span>
                         </div>
                         <div>
                            <span className="block text-gray-500 mb-1">Votos:</span>
                            <span className="text-white">{movie.vote_count}</span>
                         </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MovieModal;
