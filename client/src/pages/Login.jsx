import React, { useState } from 'react';


const Login = ({ onLogin }) => {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulação de delay de rede
        setTimeout(() => {
            if (user === 'lyandra' && pass === '123456') {
                onLogin(true);
            } else {
                setError('Senha ou usuário incorretos. Tente novamente, unnie!');
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="relative min-h-screen w-full bg-black flex items-center justify-center overflow-hidden">
            {/* Background Image com Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=2031&auto=format&fit=crop" 
                    alt="Background" 
                    className="w-full h-full object-cover opacity-50 block"
                />
                <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black via-transparent to-black" />
            </div>

            {/* Logo no Topo Esquerdo */}
            <div className="absolute top-6 left-6 z-20">
                <h1 className="text-red-600 text-4xl font-bold tracking-tighter drop-shadow-lg">LYAFLIX</h1>
            </div>

            {/* Card de Login */}
            <div className="relative z-10 w-full max-w-[450px] bg-black/75 p-16 rounded-lg backdrop-blur-sm shadow-2xl animate-in fade-in zoom-in duration-500">
                <h2 className="text-white text-3xl font-bold mb-8">Entrar</h2>
                
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <input 
                                type="text"
                                placeholder=" "
                                className="peer block w-full rounded bg-zinc-700 p-4 text-white text-base focus:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition pt-6 pb-2 placeholder-transparent"
                                value={user}
                                onChange={e => setUser(e.target.value)}
                                required
                            />
                            <label className="absolute left-4 top-4 text-zinc-400 text-base transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-gray-200">
                                Email ou Usuário
                            </label>
                        </div>

                        <div className="relative">
                            <input 
                                type="password"
                                placeholder=" "
                                className="peer block w-full rounded bg-zinc-700 p-4 text-white text-base focus:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition pt-6 pb-2 placeholder-transparent"
                                value={pass}
                                onChange={e => setPass(e.target.value)}
                                required
                            />
                            <label className="absolute left-4 top-4 text-zinc-400 text-base transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-gray-200">
                                Senha
                            </label>
                        </div>
                    </div>

                    {error && (
                        <div className="text-orange-500 text-sm font-medium animate-pulse">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded transition duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            "Entrar"
                        )}
                    </button>

                    <div className="flex justify-between items-center text-sm text-gray-400 mt-2">
                         <div className="flex items-center gap-1">
                             <input type="checkbox" id="remember" className="rounded bg-zinc-700 border-none focus:ring-0 checked:bg-gray-500" />
                             <label htmlFor="remember" className="cursor-pointer hover:text-white">Lembre-se de mim</label>
                         </div>
                         <a href="#" className="hover:underline hover:text-white">Precisa de ajuda?</a>
                    </div>
                </form>

                <div className="mt-16 text-gray-500 text-base">
                    Novo por aqui? <span className="text-white hover:underline cursor-pointer">Assine agora (Exclusivo para Lya).</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
