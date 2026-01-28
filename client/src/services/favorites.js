const FAVORITES_KEY = 'lyaflix_favorites';

const FavoritesService = {
    getFavorites: () => {
        const stored = localStorage.getItem(FAVORITES_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    addFavorite: (movie) => {
        const favorites = FavoritesService.getFavorites();
        // Evita duplicatas (verifica por ID)
        if (!favorites.some(fav => fav.id === movie.id)) {
            // Salva apenas o necessário para exibir na lista sem fetch extra
            const minimalMovie = {
                id: movie.id,
                title: movie.title || movie.name,
                name: movie.name || movie.title, // Garante compatibilidade
                poster_path: movie.poster_path,
                backdrop_path: movie.backdrop_path,
                overview: movie.overview,
                vote_average: movie.vote_average,
                media_type: movie.media_type || (movie.first_air_date ? 'tv' : 'movie') // Tenta inferir
            };
            
            const updated = [minimalMovie, ...favorites];
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
            return true;
        }
        return false;
    },

    removeFavorite: (movieId) => {
        const favorites = FavoritesService.getFavorites();
        const updated = favorites.filter(fav => fav.id !== movieId);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    },

    isFavorite: (movieId) => {
        const favorites = FavoritesService.getFavorites();
        return favorites.some(fav => fav.id === movieId);
    }
};

export default FavoritesService;
