// Mapeamento manual de IDs do TMDB para dados personalizados
// Você pode adicionar qualquer ID de filme ou série aqui.

export const TROPE_BADGES = {
    contract_marriage: { label: "Casamento por Contrato", color: "bg-pink-500/20 text-pink-300 border-pink-500/50" },
    ceo_rich: { label: "CEO Rico & Garota Pobre", color: "bg-purple-500/20 text-purple-300 border-purple-500/50" },
    revenge: { label: "Vingança Satisfatória", color: "bg-red-500/20 text-red-300 border-red-500/50" },
    friends_to_lovers: { label: "Amigos para Amantes", color: "bg-blue-500/20 text-blue-300 border-blue-500/50" },
    love_triangle: { label: "Triângulo Amoroso", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50" },
    past_lives: { label: "Vidas Passadas", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50" },
};

export const MOODS = {
    cry: { icon: "😭", label: "Prepara o Lencinho", color: "text-blue-400" },
    butterfly: { icon: "🦋", label: "Frio na Barriga", color: "text-pink-400" },
    angry: { icon: "😡", label: "Vai Passar Raiva", color: "text-red-500" },
    funny: { icon: "😂", label: "Rir até Chorar", color: "text-yellow-400" },
    tension: { icon: "😱", label: "Tensão Pura", color: "text-purple-400" },
};

// Aqui você conecta o ID do TMDB com as Tags e Moods
export const CUSTOM_DORAMA_DATA = {
    // Exemplo: ID fictício ou real (substitua pelos IDs reais dos seus doramas)
    114472: { // Business Proposal (exemplo)
        tags: ['contract_marriage', 'ceo_rich'],
        mood: 'funny'
    },
    99966: { // All of Us Are Dead
        tags: ['friends_to_lovers'],
        mood: 'tension'
    },
    // Adicione mais IDs conforme for descobrindo na sua API
};
