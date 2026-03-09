export const CUSTOM_VIDEOS = {
    // Goblin (ID: 67915) - Transformado em Série
    67915: {
        1: { // Temporada 1
            1: "https://drive.google.com/file/d/1L_8pfHLE6XLfWRO5GHGwVkeGhpALPrOf/preview" 
        }
    },
    
    // Teste de Upload
    999999: "https://drive.google.com/file/d/1d57szHntVeoeCO3g-_TiopikmgkRGORr/preview",

    // Amor Entre Linhas (ID: 279136)
    279136: {
        1: {
            1: "https://drive.google.com/file/d/16bghZNnRIJaEaAmgM3VSEXUHF1d4v5dX/preview",
            9: [
                "https://drive.google.com/file/d/1K8oECBNUrnPNWi6LvPqS77Vij5QG5pMr/preview", // Novo (Opção 1)
                "https://drive.google.com/file/d/17WpNzRdNo4AoT6o__BeD3NnXh3hn5IXz/preview"  // Antigo (Opção 2)
            ]
        }
    },

    // Sinta-se em Casa, Sr. Ling (ID: 117549)
    117549: {
        1: {
            1: "https://drive.google.com/file/d/12Qf61X6U2VokUfqOHM7Ae9OiITE2OjbL/preview",
            2: "https://drive.google.com/file/d/1lBuyVKvLOqIpJVTUwFSzc1_i5LaCOPCf/preview",
            3: "https://drive.google.com/file/d/1kW58pLOFpwmBtkxv7DBnyp3ka_8o8Ruw/preview",
            4: "https://drive.google.com/file/d/1biNpZvHUoE4_GR4wLvQne9QsQ_5HlEuI/preview",
            5: "https://drive.google.com/file/d/1GVqPHGkJBsXG7MAIZeuStWFOTrkKgxxM/preview",
            6: "https://drive.google.com/file/d/1cgZAvcq_vFSCgqrE0Hywk93z5n7ofLWd/preview",
            7: "https://drive.google.com/file/d/1c5VYZo2oU_vtsUurf6H2ho53DXbTpU3u/preview",
            8: "https://drive.google.com/file/d/1UwBkbnkqmw0YCJkiyVKAtPjm-HqSuOyd/preview",
            9: "https://drive.google.com/file/d/1jlQVmjkk5QT9OmkVhDJ89cn2Znzj-c13/preview",
            10: "https://drive.google.com/file/d/1nSwGi5pu14iIydRAT4NVaPganngPw-Ib/preview",
            11: "https://drive.google.com/file/d/1Ubm9LzMSFjKL0qLszjMgffBgBw8mPg9n/preview",
            12: "https://drive.google.com/file/d/1xHsziM5RXR6E-u_0x-Ot3FGl2fEG6vgs/preview",
            13: "https://drive.google.com/file/d/16n1AlyRiq1HCETilAY9YPE6OI-L-QT09/preview",
            14: "https://drive.google.com/file/d/1pLSZBZ4hhp7G_xre38sZWdaxuecVqnsD/preview",
            15: "https://drive.google.com/file/d/1Jvfsn97Z7tlLGGQHzG4nzLKEAhv5v5H3/preview"
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
