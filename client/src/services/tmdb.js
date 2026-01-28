const API_BASE = 'https://api.themoviedb.org/3';

/*
  Necessário configurar o VITE_TMDB_ACCESS_TOKEN no arquivo .env
*/
const getAuthHeaders = () => {
    const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
    return {
        accept: 'application/json',
        Authorization: `Bearer ${token}`
    };
};

const basicFetch = async (endpoint) => {
    try {
        const req = await fetch(`${API_BASE}${endpoint}`, {
            headers: getAuthHeaders()
        });
        const json = await req.json();
        return json;
    } catch (error) {
        console.error("Erro na requisição TMDB:", error);
        return null;
    }
}

import HistoryService from './history';

export default {
    getHomeList: async (type = 'all') => {
        let list = [];
        const lang = 'language=pt-BR';

        // Helper para montar objeto da categoria
        const addCat = async (slug, title, endpoint) => {
            // Garante que o endpoint tenha o separador correto para adicionar page depois
            const separator = endpoint.includes('?') ? '&' : '?';
            const fullEndpoint = `${endpoint}${separator}${lang}`;
            
            return {
                slug,
                title,
                endpoint: fullEndpoint, // Salvamos a URL base para paginação
                items: await basicFetch(fullEndpoint)
            };
        };

        if (type === 'all' || type === 'movies') {
            list.push(await addCat('trending', 'Em Alta', '/trending/movie/week'));
            list.push(await addCat('toprated', 'Aclamação da Crítica (Melhores Notas)', '/movie/top_rated')); // Título padronizado
            list.push(await addCat('action', 'Ação', '/discover/movie?with_genres=28'));
            list.push(await addCat('comedy', 'Comédia', '/discover/movie?with_genres=35'));
            list.push(await addCat('horror', 'Terror', '/discover/movie?with_genres=27'));
        }

        if (type === 'series') {
            list.push(await addCat('trending-tv', 'Séries em Alta', '/trending/tv/week'));
            list.push(await addCat('toprated-tv', 'Aclamação da Crítica (Melhores Notas)', '/tv/top_rated')); // Título padronizado
            list.push(await addCat('action-tv', 'Ação & Aventura', '/discover/tv?with_genres=10759'));
            list.push(await addCat('drama-tv', 'Dramas', '/discover/tv?with_genres=18'));
        }

        if (type === 'doramas') {
            // Obter ano atual para filtro de lançamentos
            const currentYear = new Date().getFullYear();
            
            list.push(await addCat('releases-k', 'Novos Lançamentos', `/discover/tv?with_original_language=ko&first_air_date.gte=${currentYear-1}-01-01&sort_by=popularity.desc`));
            list.push(await addCat('trending-k', 'K-Dramas Populares', '/discover/tv?with_original_language=ko&sort_by=popularity.desc'));
            // Filtro rigoroso: Apenas Coreano, ordenado por nota, com mínimo de votos para evitar distorções
            list.push(await addCat('toprated-k', 'Aclamação da Crítica (Melhores Notas)', '/discover/tv?with_original_language=ko&sort_by=vote_average.desc&vote_count.gte=200'));
            list.push(await addCat('romance-k', 'Romance Coreano', '/discover/tv?with_original_language=ko&with_genres=10749'));
            list.push(await addCat('drama-k', 'Dramas Emocionantes', '/discover/tv?with_original_language=ko&with_genres=18'));
            list.push(await addCat('fantasy-k', 'Fantasia & Sci-Fi', '/discover/tv?with_original_language=ko&with_genres=10765'));
        }

        if (type === 'all') {
            // 1. CONTINUAR ASSISTINDO (Histórico Local) - Adiciona ao INÍCIO (Topo)
            const history = HistoryService.getContinueWatching();
            if (history.length > 0) {
                list.unshift({
                    slug: 'continue-watching',
                    title: 'Continuar Telenovelando',
                    items: { results: history } 
                });
            }
        }

        return list;
    },

    fetchMore: async (endpoint, page) => {
        return await basicFetch(`${endpoint}&page=${page}`);
    },

    search: async (query, type) => {
        let endpoint = '/search/multi'; // Padrão: busca tudo
        
        if(type === 'movies') endpoint = '/search/movie';
        if(type === 'series' || type === 'doramas') endpoint = '/search/tv';

        // Para doramas, poderíamos filtrar por idioma, mas vamos deixar TV geral para achar tudo
        return await basicFetch(`${endpoint}?query=${encodeURIComponent(query)}&language=pt-BR`);
    },
    
    // Pega informações detalhadas de um item específico (para o Hero Banner, por exemplo)
    getMovieInfo: async (movieId, type) => {
        let info = {};
        if(movieId) {
            switch(type) {
                case 'movie':
                    info = await basicFetch(`/movie/${movieId}?language=pt-BR&append_to_response=credits`);
                    break;
                case 'tv':
                    info = await basicFetch(`/tv/${movieId}?language=pt-BR&append_to_response=credits`);
                    break;
                default:
                    info = null;
                    break;
            }
        }
        return info;
    },

    // Busca detalhes de uma temporada específica (Episódios)
    getSeasonInfo: async (tvId, seasonNumber) => {
        return await basicFetch(`/tv/${tvId}/season/${seasonNumber}?language=pt-BR`);
    },

    // Busca onde assistir (Netflix, Viki, etc)
    getWatchProviders: async (id, type) => {
        let endpoint = '';
        // Watch providers endpoint logic
        if (type === 'movie') endpoint = `/movie/${id}/watch/providers`;
        else if (type === 'tv') endpoint = `/tv/${id}/watch/providers`;
        else return null;

        const res = await basicFetch(endpoint);
        if (res && res.results && res.results.BR) {
            return res.results.BR; // Retorna apenas dados do Brasil
        }
        return null; // Não disponível no BR ou erro
    }
}
