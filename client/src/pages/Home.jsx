// src/pages/Home.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Info, Bell, Search, ChevronLeft, ArrowLeft, X, LogOut } from 'lucide-react'; 
import Tmdb from '../services/tmdb';
import MovieModal from '../components/MovieModal';
import logoImg from '../assets/lya.jpg'; // Importando a logo

const Home = ({ onLogout, onModalChange }) => {
    // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

    // Dados Principais
  const [movieList, setMovieList] = useState([]);
  const [featuredList, setFeaturedList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Controle de Navegação/Filtros
  const [filter, setFilter] = useState('all');
  const [scrolled, setScrolled] = useState(false);
  
  // Busca
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null); 
  const searchInputRef = useRef(null);

  // Modal State
  const [selectedMovie, setSelectedMovie] = useState(null);

  // --- MODO: VISUALIZAÇÃO DE CATEGORIA (GRIDE INFINITO) ---
  const [activeCategory, setActiveCategory] = useState(null); 

  // Efeito do Splash Screen
  useEffect(() => {
      const timer = setTimeout(() => {
          setShowSplash(false);
      }, 2500); // 2.5 segundos de exibição
      return () => clearTimeout(timer);
  }, []);

  // Carousel Interval
  useEffect(() => {
      if (featuredList.length <= 1) return;
      
      const interval = setInterval(() => {
          setActiveIndex(prev => (prev + 1) % featuredList.length);
      }, 5000); // 5 segundos
      
      return () => clearInterval(interval);
  }, [featuredList]);

  // Função para carregar dados iniciais (Carrosséis)
  const loadData = async (type) => {
      if(searchTerm) return;
      
      setActiveCategory(null); 
      setMovieList([]); 
      setFeaturedList([]);
      
      let list = await Tmdb.getHomeList(type);
      setMovieList(list);

      // Lógica do Destaque (Top 5)
      let trendingSlug = 'trending';
      if(type === 'series') trendingSlug = 'trending-tv';
      if(type === 'doramas') trendingSlug = 'releases-k'; // Destaque para lançamentos em Doramas

      let originals = list.filter(i => i.slug === trendingSlug);
      if(originals.length === 0 && list.length > 0) originals = [list[0]];

      if (originals.length > 0 && originals[0].items && originals[0].items.results.length > 0) {
          let validItems = originals[0].items.results.filter(i => i.backdrop_path);
          
          // Se filtrar demais, usa o que tem
          if(validItems.length === 0) validItems = originals[0].items.results;

          // Pega Top 5
          const top5 = validItems.slice(0, 5);
          
          const detailedTop5 = await Promise.all(top5.map(async (item) => {
             // Lógica para detectar tipo
              let mediaType = 'movie'; 
              if (item.media_type) mediaType = item.media_type;
              else if (type === 'doramas' || type === 'series') mediaType = 'tv';
              else if (item.first_air_date) mediaType = 'tv';

              const info = await Tmdb.getMovieInfo(item.id, mediaType);
              return info || item;
          }));

          setFeaturedList(detailedTop5);
          setActiveIndex(0);
      }
  };

  useEffect(() => {
    loadData(filter);
  }, [filter]);

  // Lógica de Busca
  const handleSearchInput = async (e) => {
      const term = e.target.value;
      setSearchTerm(term);

      if(term.length > 0) {
          if(searchInputRef.current) clearTimeout(searchInputRef.current);
          searchInputRef.current = setTimeout(async () => {
              const results = await Tmdb.search(term, filter);
              setSearchResults(results.results || []);
          }, 500);
      } else {
          setSearchResults(null);
      }
  };

  const closeSearch = () => {
      setIsSearchOpen(false);
      setSearchTerm('');
      setSearchResults(null);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- LÓGICA DO SCROLL INFINITO NA CATEGORIA ---
  const observer = useRef();
  
  const lastMovieElementRef = useCallback(node => {
      if (!activeCategory || searchTerm) return; 
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
               loadMoreCategoryItems();
          }
      });
      
      if (node) observer.current.observe(node);
  }, [activeCategory, searchTerm]);

  const loadMoreCategoryItems = async () => {
    if(!activeCategory) return;
    const nextPage = activeCategory.page + 1;
    const moreData = await Tmdb.fetchMore(activeCategory.endpoint, nextPage);
    
    if(moreData && moreData.results) {
        setActiveCategory(prev => ({
            ...prev,
            items: [...prev.items, ...moreData.results],
            page: nextPage
        }));
    }
  };

  const handleOpenCategory = (categoryFromList) => {
      setActiveCategory({
          slug: categoryFromList.slug,
          title: categoryFromList.title,
          endpoint: categoryFromList.endpoint,
          items: categoryFromList.items.results,
          page: 1
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenModal = async (movie) => {
      if(onModalChange) onModalChange(true); // Avisa App para esconder Chat

      let type = 'movie';
      if(movie.media_type === 'tv' || movie.name || filter === 'series' || filter === 'doramas' || (activeCategory && activeCategory.slug.includes('-k'))) type = 'tv';
      
      const fullInfo = await Tmdb.getMovieInfo(movie.id, type);
      setSelectedMovie(fullInfo || movie);
  };

  // Handler para buscar ator clicado no Modal (Quem é esse Oppa?)
  const handleActorSearch = (actor) => {
      setSelectedMovie(null); // Fecha o modal
      if(onModalChange) onModalChange(false); // Mostra Chat

      setIsSearchOpen(true); // Abre a barra de busca
      
      // Simula a busca pelo nome do ator
      const term = actor.name;
      setSearchTerm(term);
      
      // Aciona busca imediata
      Tmdb.search(term, 'multi').then(results => {
           setSearchResults(results.results || []);
      });
  };

  // Se estiver mostrando Splash, renderiza a tela de abertura
  if (showSplash) {
      return (
          <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-out fade-out duration-1000 delay-[2000ms] fill-mode-forwards">
               <div className="animate-in zoom-in duration-1000 fade-in">
                    <img src={logoImg} alt="LyaFlix" className="max-w-[70vw] max-h-[50vh] object-contain" />
               </div>
          </div>
      );
  }

  if (!movieList.length && !featuredData && !activeCategory && !searchResults) {
      return (
        <div className="bg-zinc-900 min-h-screen flex items-center justify-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      );
  }

  return (
    <div className="bg-zinc-900 min-h-screen text-white font-sans overflow-x-hidden animate-in fade-in duration-1000">
      
      {/* Navbar Responsiva */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-zinc-950/95 backdrop-blur-md py-2 md:py-4 shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent py-4 md:py-6'
      }`}>
        <div className="flex items-center justify-between px-4 md:px-12">
            <div className={`flex items-center gap-4 ${isSearchOpen ? 'hidden md:flex' : 'flex'}`}>
                {/* Botão Voltar (Só aparece se estiver vendo uma categoria específica) */}
                {activeCategory && !isSearchOpen && (
                    <button onClick={() => setActiveCategory(null)} className="md:hidden">
                        <ArrowLeft className="w-6 h-6 text-white" />
                    </button>
                )}

                <h1 
                    onClick={() => { setFilter('all'); setActiveCategory(null); closeSearch(); }}
                    className={`text-red-600 text-2xl md:text-3xl font-bold tracking-tighter cursor-pointer scale-95 md:scale-100 ${isSearchOpen ? 'hidden md:block' : 'block'}`}
                >
                    LYAFLIX
                </h1>
                
                {/* Menu Desktop */}
                {!activeCategory && !isSearchOpen && (
                    <div className="hidden md:flex gap-6 text-sm font-medium text-gray-300 ml-4">
                        <button onClick={() => setFilter('all')} className={`${filter === 'all' ? 'text-white font-bold' : 'hover:text-white'} transition`}>Início</button>
                        <button onClick={() => setFilter('series')} className={`${filter === 'series' ? 'text-white font-bold' : 'hover:text-white'} transition`}>Séries</button>
                        <button onClick={() => setFilter('movies')} className={`${filter === 'movies' ? 'text-white font-bold' : 'hover:text-white'} transition`}>Filmes</button>
                        <button onClick={() => setFilter('doramas')} className={`${filter === 'doramas' ? 'text-white font-bold' : 'hover:text-white'} transition`}>Doramas</button>
                    </div>
                )}
            </div>

            {/* ÁREA DE BUSCA E ÍCONES */}
            <div className={`flex items-center gap-4 md:gap-6 text-white ${isSearchOpen ? 'w-full md:w-auto' : ''}`}>
                
                {/* Search Bar Input */}
                <div className={`flex items-center bg-zinc-800/80 border border-white/20 rounded px-2 transition-all duration-300 ${isSearchOpen ? 'w-full max-w-md opacity-100' : 'w-0 opacity-0 overflow-hidden border-none'}`}>
                   <Search className="w-4 h-4 text-gray-400 min-w-[20px]" />
                   <input 
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchInput}
                      placeholder={filter === 'all' ? "Títulos, gente e gêneros" : `Buscar em ${filter}...`}
                      className="bg-transparent border-none outline-none text-white text-sm px-2 py-1 w-full placeholder-gray-500"
                      autoFocus={isSearchOpen}
                   />
                   <X className="w-4 h-4 text-gray-400 cursor-pointer min-w-[20px]" onClick={closeSearch} />
                </div>

                {!isSearchOpen && (
                    <Search className="w-5 h-5 md:w-6 md:h-6 cursor-pointer opacity-90 hover:opacity-100" onClick={() => setIsSearchOpen(true)} />
                )}
                
                <div className={`${isSearchOpen ? 'hidden' : 'flex'} items-center gap-4`}>
                    <button className="hidden md:block">
                        <Bell className="w-5 h-5 md:w-6 md:h-6 cursor-pointer opacity-90 hover:opacity-100" />
                    </button>
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded bg-blue-600 flex items-center justify-center font-bold text-sm cursor-pointer border border-transparent hover:border-white transition">A</div>
                    
                    <button 
                        onClick={onLogout}
                        className="ml-2 text-gray-300 hover:text-white transition flex items-center gap-1 group"
                        title="Sair"
                    >
                        <LogOut className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>
            </div>
        </div>

        {/* Menu Inferior Mobile (Esconde se estiver vendo categoria) */}
        {!activeCategory && !isSearchOpen && (
            <div className="md:hidden flex justify-evenly pt-2 pb-1 text-xs text-gray-300 font-medium bg-gradient-to-b from-transparent to-black/20 overflow-x-auto whitespace-nowrap gap-4 px-4">
                <button onClick={() => setFilter('series')} className={filter === 'series' ? 'text-white font-bold' : ''}>Séries</button>
                <button onClick={() => setFilter('movies')} className={filter === 'movies' ? 'text-white font-bold' : ''}>Filmes</button>
                <button onClick={() => setFilter('doramas')} className={filter === 'doramas' ? 'text-white font-bold' : ''}>Doramas</button>
                <button onClick={() => setFilter('all')} className={filter === 'all' ? 'text-white font-bold' : ''}>Todos</button>
            </div>
        )}
      </nav>

      {/* --- MODO BUSCA (RESULTADOS) --- */}
      {searchTerm && searchResults && (
        <div className="pt-24 px-4 md:px-12 pb-20 min-h-screen animate-in fade-in duration-300">
           <h2 className="text-xl text-gray-400 mb-6">
                Resultados para: <span className="text-white font-bold">"{searchTerm}"</span>
           </h2>
           <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-6">
                {searchResults.map((item, index) => (
                     <div 
                         key={item.id} 
                         onClick={() => handleOpenModal(item)}
                         className="aspect-[2/3] relative group cursor-pointer overflow-hidden rounded md:rounded-lg shadow-lg bg-zinc-800"
                     >
                        {item.poster_path ? (
                            <img 
                                src={`https://image.tmdb.org/t/p/w300${item.poster_path}`} 
                                alt={item.title || item.name}
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-110 group-hover:brightness-50"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-center text-xs text-gray-500 p-2">Sem Imagem</div>
                        )}
                     </div>
                ))}
           </div>
           {searchResults.length === 0 && (
               <div className="text-center py-20 text-gray-500">
                   Nenhum resultado encontrado.
               </div>
           )}
        </div>
      )}

      {/* --- CONTEÚDO PRINCIPAL (Só mostra se não estiver buscando) --- */}
      {!searchTerm && (
        <>
            {/* SE ESTIVER NO MODO NORMAL (HOME) */}
            {!activeCategory && featuredList.length > 0 && (() => {
                const featuredData = featuredList[activeIndex];
                return (
                <>
                    <header className="relative h-[70vh] md:h-[90vh] w-full group overflow-hidden">
                        {/* Background com Transição Suave */}
                        <div key={featuredData.id} className="absolute inset-0 animate-in fade-in duration-1000">
                            <img 
                                src={`https://image.tmdb.org/t/p/original${featuredData.backdrop_path}`} 
                                alt={featuredData.original_name || featuredData.title} 
                                className="w-full h-full object-cover object-center md:object-top"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-zinc-900" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                        </div>

                        {/* Conteúdo do Hero e Botões */}
                        <div className="absolute bottom-0 left-0 w-full px-4 md:px-12 pb-16 md:pb-24 space-y-4 md:space-y-6">
                            <div className="max-w-xl md:max-w-2xl space-y-2 animate-in slide-in-from-left-10 duration-700">
                                <span className="inline-block px-2 py-1 bg-red-600 text-white text-[10px] md:text-xs font-bold rounded-sm uppercase tracking-wider mb-2">
                                    {filter === 'doramas' ? 'K-Drama Top 5' : 'Destaque Top 5'}
                                </span>
                                <h1 className="text-4xl md:text-7xl font-extrabold text-white leading-tight drop-shadow-xl">
                                    {featuredData.title || featuredData.name}
                                </h1>
                                
                                <div className="flex items-center gap-4 text-xs md:text-sm font-bold text-gray-300">
                                    <span className="text-green-400">{(featuredData.vote_average * 10).toFixed(0)}% Relevante</span>
                                    <span>{new Date(featuredData.first_air_date || featuredData.release_date).getFullYear()}</span>
                                    {featuredData.number_of_seasons && <span>{featuredData.number_of_seasons} Temp.</span>}
                                </div>

                                <p className="text-gray-200 text-xs md:text-lg drop-shadow-md line-clamp-3 md:line-clamp-4 max-w-[90%] md:max-w-xl">
                                    {featuredData.overview}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 md:gap-4 pt-2 animate-in fade-in zoom-in duration-1000 delay-200">
                                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-black px-4 py-2 md:px-8 md:py-3 rounded md:rounded md:text-xl font-bold hover:bg-opacity-90 transition active:scale-95">
                                    <Play className="fill-black w-4 h-4 md:w-7 md:h-7" /> Assistir
                                </button>
                                <button 
                                    onClick={() => handleOpenModal(featuredData)}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-zinc-600/70 text-white px-4 py-2 md:px-8 md:py-3 rounded md:rounded md:text-xl font-bold backdrop-blur-sm hover:bg-zinc-600/60 transition active:scale-95"
                                >
                                    <Info className="w-4 h-4 md:w-7 md:h-7" /> Detalhes
                                </button>
                            </div>
                        </div>

                         {/* Botões de Navegação (Carousel Controls) */}
                         <div className="absolute right-4 bottom-1/3 md:bottom-20 flex flex-col gap-2 z-20">
                            <button 
                                onClick={() => setActiveIndex(prev => (prev === 0 ? featuredList.length - 1 : prev - 1))}
                                className="bg-black/30 hover:bg-white/20 p-2 md:p-3 rounded-full text-white backdrop-blur-sm border border-white/30 transition hover:scale-110"
                            >
                                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                            <button 
                                onClick={() => setActiveIndex(prev => (prev + 1) % featuredList.length)}
                                className="bg-black/30 hover:bg-white/20 p-2 md:p-3 rounded-full text-white backdrop-blur-sm border border-white/30 transition hover:scale-110"
                            >
                                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 rotate-180" />
                            </button>
                             {/* Indicador Numérico Simplificado */}
                             <div className="text-white text-xs font-bold text-center mt-2 bg-black/50 px-2 py-1 rounded-full">{activeIndex + 1}/{featuredList.length}</div>
                        </div>
                    </header>

                    <div className="-mt-10 md:-mt-20 relative z-10 pb-10 space-y-6 md:space-y-10">
                        {movieList.map((category, key) => (
                        <section key={key} className="space-y-2 md:space-y-4 pl-4 md:pl-12">
                            <h2 
                                onClick={() => handleOpenCategory(category)}
                                className="text-base md:text-2xl font-bold text-gray-100 hover:text-white transition cursor-pointer flex items-center gap-2 group/title"
                            >
                                {category.title}
                                <span className="text-xs text-blue-400 font-normal md:opacity-0 group-hover/title:opacity-100 transition flex items-center">
                                    Ver tudo <ChevronLeft className="rotate-180 w-3 h-3 ml-1" />
                                </span>
                            </h2>
                            
                            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 pr-4 scroll-smooth hide-scrollbar transition-all" style={{ scrollbarWidth: 'none' }}>
                            {category.items && category.items.results && category.items.results.length > 0 && category.items.results.map((movie, key) => (
                                <div 
                                key={key} 
                                onClick={() => handleOpenModal(movie)}
                                className="flex-none w-[110px] sm:w-[140px] md:w-[220px] aspect-[2/3] relative group cursor-pointer overflow-hidden rounded md:rounded-lg shadow-lg"
                                >
                                <img 
                                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
                                    alt={movie.title || movie.name}
                                    className="w-full h-full object-cover transition duration-300 md:group-hover:scale-110 md:group-hover:brightness-50"
                                />
                                {movie.progress && (
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700 z-20">
                                        <div 
                                            className="h-full bg-red-600" 
                                            style={{ width: `${movie.progress * 100}%` }}
                                        ></div>
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                     <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                         <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                                     </div>
                                </div>
                                </div>
                            ))}
                            </div>
                        </section>
                        ))}
                    </div>
                </>
                );
            })()}

            {/* SE ESTIVER NO MODO CATEGORIA (GRID INFINITO) */}
            {activeCategory && (
                <div className="pt-24 px-4 md:px-12 pb-20 min-h-screen animate-in fade-in duration-300">
                    <header className="flex items-center gap-4 mb-8">
                        <button onClick={() => setActiveCategory(null)} className="p-2 rounded-full hover:bg-zinc-800 transition">
                            <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
                        </button>
                        <h1 className="text-3xl md:text-5xl font-bold">{activeCategory.title}</h1>
                    </header>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-6">
                        {activeCategory.items.map((movie, index) => {
                            const isLast = index === activeCategory.items.length - 1;
                            
                            return (
                                <div 
                                    key={`${movie.id}-${index}`} 
                                    ref={isLast ? lastMovieElementRef : null}
                                    onClick={() => handleOpenModal(movie)}
                                    className="aspect-[2/3] relative group cursor-pointer overflow-hidden rounded md:rounded-lg shadow-lg bg-zinc-800"
                                >
                                    <img 
                                        loading="lazy"
                                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
                                        alt={movie.title || movie.name}
                                        className="w-full h-full object-cover transition duration-300 group-hover:scale-110 group-hover:brightness-50"
                                    />
                                    <div className="absolute top-2 right-2 bg-black/70 px-1 rounded text-xs font-bold text-green-400">
                                        {(movie.vote_average * 10).toFixed(0)}%
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="py-10 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
                    </div>
                </div>
            )}
        </>
      )}

      {/* --- MODAL DE DETALHES --- */}
      {selectedMovie && (
          <MovieModal 
            movie={selectedMovie} 
            onClose={() => {
                setSelectedMovie(null);
                if(onModalChange) onModalChange(false);
            }}
            onSearchActor={handleActorSearch} 
          />
      )}

    </div>
  );
};

export default Home;
