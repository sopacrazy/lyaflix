const STORAGE_KEY = 'lyaflix_history';

export default {
    /**
     * Salva ou atualiza um filme no histórico
     * @param {Object} movie - Objeto do filme
     */
    addToHistory: (movie) => {
        let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        
        // Remove se já existir (para colocar no topo/início da lista novamente)
        history = history.filter(i => i.id !== movie.id);
        
        // Adiciona novos dados com um "progresso simulado" randômico entre 10% e 90%
        // Em um app real com player próprio, usaríamos o tempo exato.
        const watchedItem = {
            ...movie,
            watched_at: new Date().getTime(),
            progress: Math.random() * (0.9 - 0.1) + 0.1 // Random entre 10% e 90%
        };

        // Adiciona no início
        history.unshift(watchedItem);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    },

    /**
     * Recupera a lista de "Continuar Assistindo"
     */
    getContinueWatching: () => {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    },

    /**
     * Limpa histórico
     */
    clearHistory: () => {
        localStorage.removeItem(STORAGE_KEY);
    }
};
