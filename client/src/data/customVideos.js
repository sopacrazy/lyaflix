export const CUSTOM_VIDEOS = {
    // Goblin (ID: 67915) - Transformado em Série
    67915: {
        1: { // Temporada 1
            1: "https://drive.google.com/file/d/1L_8pfHLE6XLfWRO5GHGwVkeGhpALPrOf/preview" 
        }
    },
    
    // Teste de Upload
    999999: "https://drive.google.com/file/d/1d57szHntVeoeCO3g-_TiopikmgkRGORr/preview",

    // DARK (ID: 70523)
    70523: {
        1: { // Temporada 1
            1: "LINK_DO_EPISODIO_1_AQUI",
            2: "LINK_DO_EPISODIO_2_AQUI",
            3: "LINK_DO_EPISODIO_3_AQUI"
        },
        2: { // Temporada 2
            1: "LINK_DO_EPISODIO_1_T2_AQUI"
        },
        3: { // Temporada 3
            1: "LINK_DO_EPISODIO_1_T3_AQUI"
        }
    }
};

/**
 * Função Helper para pegar o link correto
 * @param {number} tmdbId - ID do Filme/Série
 * @param {number} season - Número da Temporada (opcional)
 * @param {number} episode - Número do Episódio (opcional)
 */
export const getVideoLink = (tmdbId, season = 1, episode = 1) => {
    const entry = CUSTOM_VIDEOS[tmdbId];
    
    if(!entry) return null;

    // Se for string direta (Filme Único)
    if (typeof entry === 'string') return entry;
    
    // Se for objeto (Série/Dorama com Eps)
    if (typeof entry === 'object') {
        // Tenta pegar o episódio específico
        if(entry[season] && entry[season][episode]) {
            return entry[season][episode];
        }
        
        // Se pediu link genérico (ex: banner) E existe T1 E1, retorna ele por conveniência
        if(season === 1 && episode === 1 && entry[1] && entry[1][1]) {
            return entry[1][1];
        }
    }

    return null;
};
