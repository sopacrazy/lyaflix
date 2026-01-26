import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Heart, Sparkles } from 'lucide-react';

const JiHoonChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Olá, Lya! Eu sou Ji-Hoon, seu especialista em Doramas. Como posso ajudar seu coração hoje?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight; // Simples e direto
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Nota: Em produção, mude localhost para a URL correta do backend
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMsg.text })
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply || "Oppa não entendeu..." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', text: "Mianhae (desculpe)... estou com problemas de conexão com meu coração (servidor). Verifique se o backend está rodando!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end print:hidden">
       {/* Janela do Chat */}
       {isOpen && (
         <div className="mb-4 w-[85vw] md:w-96 h-[60vh] md:h-[500px] bg-zinc-900/95 backdrop-blur-xl border border-pink-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right animate-in fade-in slide-in-from-bottom-5">
            {/* Cabeçalho */}
            <div className="bg-gradient-to-r from-pink-600 to-purple-700 p-4 flex items-center justify-between text-white shadow-md z-10">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/50 relative overflow-hidden">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    {/* Indicador Online */}
                    <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 border-2 border-pink-600 rounded-full"></div>
                 </div>
                 <div>
                   <h3 className="font-bold text-lg leading-tight flex items-center gap-1">Ji-Hoon <Heart className="w-3 h-3 fill-pink-300 text-pink-300"/></h3>
                   <p className="text-xs text-pink-100 opacity-90">Seu Oppa Virtual</p>
                 </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition text-white/90 hover:text-white">
                 <X size={20} />
               </button>
            </div>

            {/* Área de Mensagens */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-900/50">
               {messages.map((msg, idx) => (
                 <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[85%] p-3 rounded-2xl text-sm md:text-base shadow-md leading-relaxed ${
                     msg.role === 'user' 
                       ? 'bg-purple-600 text-white rounded-br-none' 
                       : 'bg-zinc-800 text-gray-100 border border-zinc-700 rounded-bl-none'
                   }`}>
                     {msg.text}
                   </div>
                 </div>
               ))}
               
               {/* Indicador de Digitação */}
               {isTyping && (
                 <div className="flex justify-start animate-pulse">
                   <div className="bg-zinc-800 p-4 rounded-2xl rounded-bl-none border border-zinc-700 flex gap-1.5 items-center">
                     <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                     <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                     <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></span>
                   </div>
                 </div>
               )}
            </div>

            {/* Área de Input */}
            <div className="p-3 md:p-4 bg-zinc-950 border-t border-zinc-800 flex gap-2 items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Peça uma indicação..."
                className="flex-1 bg-zinc-900/80 border border-zinc-700 text-white rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition placeholder-zinc-500"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-full transition shadow-lg shadow-pink-600/20 transform hover:scale-105 active:scale-95 flex-shrink-0"
              >
                <Send size={18} className={isTyping ? "opacity-0" : "ml-0.5"} />
              </button>
            </div>
         </div>
       )}

       {/* Botão Flutuante (Trigger) */}
       <button 
         onClick={() => setIsOpen(!isOpen)}
         className={`group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? 'bg-zinc-800 text-pink-500 rotate-90' : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'}`}
       >
         {isOpen ? <X size={28} /> : (
            <>
              <MessageCircle size={32} />
              {/* Badge de Notificação ("1") */}
              <span className="absolute top-0 right-0 flex h-4 w-4 md:top-1 md:right-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
              </span>
            </>
         )}
         
         {/* Tooltip ao passar o mouse */}
         {!isOpen && (
            <div className="absolute right-full mr-4 bg-white text-zinc-900 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow-xl pointer-events-none transform translate-x-2 group-hover:translate-x-0">
              Fale com o Oppa! <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
            </div>
         )}
       </button>
    </div>
  );
};

export default JiHoonChat;
