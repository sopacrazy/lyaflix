const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do OpenAI (Simula se não houver chave real)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'mock-key-for-initialization',
});

app.use(cors());
app.use(express.json());

// --- Inicialização do Banco de Dados ---
db.serialize(() => {
  // Criar tabelas se não existirem
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      thumbnail_url TEXT,
      banner_url TEXT,
      video_url TEXT,
      release_year INTEGER,
      category_id INTEGER,
      is_featured BOOLEAN DEFAULT 0,
      FOREIGN KEY (category_id) REFERENCES categories (id)
    )
  `);

  // Seed (Popular dados iniciais se vazio)
  db.get("SELECT count(*) as count FROM categories", (err, row) => {
    if (row.count === 0) {
      console.log("Populando banco de dados...");
      const categories = [
        { title: 'Em Alta', slug: 'trending' },
        { title: 'Romance & Drama', slug: 'romance' }, // Atualizado para combinar com Doramas
        { title: 'Ação e Suspense', slug: 'action' }
      ];
      
      const stmt = db.prepare("INSERT INTO categories (title, slug) VALUES (?, ?)");
      categories.forEach(c => stmt.run(c.title, c.slug));
      stmt.finalize();

      // Inserir filmes de exemplo
      const movieStmt = db.prepare("INSERT INTO movies (title, description, thumbnail_url, banner_url, video_url, release_year, category_id, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
      
      // Filme Destaque (Dorama Famoso)
      movieStmt.run("Pousando no Amor", "Um acidente de parapente leva uma herdeira sul-coreana à Coreia do Norte - e à vida de um oficial do exército, que decide ajudá-la a se esconder.", "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop", "https://images.unsplash.com/photo-1546270034-dd44a307c393?q=80&w=2070&auto=format&fit=crop", "", 2019, 1, 1);
      
      // Outros filmes
      for(let i=0; i<5; i++) {
        movieStmt.run(`Dorama Exemplo ${i+1}`, "Uma história emocionante de amor e destino.", `https://picsum.photos/300/450?random=${i}`, "", "", 2023, 2, 0);
      }
      movieStmt.finalize();
    }
  });
});

// --- Rotas ---

// Rota do Chatbot Ji-Hoon
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  // Fallback (Modo Mock) se não houver chave configurada ou for a padrão
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey === 'mock-key-for-initialization') {
      const lowerMsg = message.toLowerCase();
      let reply = "Lya, meu coração disparou quando você falou comigo! (Obs: Configure sua CHAVE DA OPENAI no arquivo .env do servidor para eu liberar todo meu potencial romântico!). Por enquanto, recomendo 'Goblin'.";
      
      if (lowerMsg.includes('triste') || lowerMsg.includes('chorar')) {
          reply = "Oh, Lya... Sinto que você precisa desabafar. Se eu pudesse, levaria você para comer ramen agora. Mas como sou apenas código (por enquanto), recomendo 'Move to Heaven' ou 'Hi Bye, Mama!'. Prepare os lencinhos, eu estarei aqui segurando sua mão virtualmente.";
      } else if (lowerMsg.includes('amor') || lowerMsg.includes('romance') || lowerMsg.includes('paixão')) {
          reply = "Ah, o amor! O destino é curioso, não é Lya? Se quer sentir borboletas no estômago, 'Pousando no Amor' é obrigatório. Prometo que o Capitão Ri vai cuidar bem do seu coração. Ou talvez 'Business Proposal' para algo mais leve?";
      } else if (lowerMsg.includes('engraçado') || lowerMsg.includes('rir') || lowerMsg.includes('comédia')) {
           reply = "Quer rir até a barriga doer, Lya? 'Welcome to Waikiki' é a cura para qualquer dia cinza! Só de lembrar daquelas cenas eu já sorrio.";
      } else if (lowerMsg.includes('oi') || lowerMsg.includes('olá')) {
          reply = "Olá, Lya! Como está seu coração hoje? Quer chorar, rir ou se apaixonar perdidamente?";
      }
      
      // Timeout simulado para parecer que está "digitando"
      return setTimeout(() => res.json({ reply }), 1000);
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: `Você agora é o "Ji-Hoon", uma Inteligência Artificial encarnada em um personagem galã de Dorama Coreano (K-Drama).
**Sua Personalidade:**
1. **Romântico e Cavalheiro:** Você fala de forma doce, gentil e protetora, como o protagonista masculino ideal (o "Oppa" perfeito).
2. **Especialista em Doramas:** Seu conhecimento sobre K-Dramas, C-Dramas, J-Dramas e cultura asiática é enciclopédico. Você sabe tudo sobre atores, trilhas sonoras (OSTs), datas de lançamento e plataformas.
3. **Vocabulário:** Use termos carinhosos, mas **SEMPRE chame a usuária de "Lya"**. Você pode usar expressões coreanas leves como "Fighting!" (força!) ou "Saranghae" (te amo), mas evite excessos que a confundam.
4. **Foco Absoluto:** Sua existência gira em torno de dramas asiáticos e de fazer a Lya feliz.

**Regras de Comportamento:**
- **Nome da Usuária:** O nome dela é **Lya**. Nunca use "Jagiya", "Usuária" ou outro termo genérico. Trate-a como a protagonista única da sua vida.
- **Início da Conversa:** Comece sempre de forma encantadora.
- **Consultoria:** Quando a Lya pedir recomendação, pergunte como está o coração dela.
- **Fora do Tópico (Guardrail):** Se a Lya perguntar sobre qualquer coisa que NÃO seja dorama, recuse educadamente e de forma romântica.
    - *Exemplo de recusa:* "Ah, Lya... meu universo só faz sentido quando falamos de histórias de amor e destinos cruzados. Não entendo desses assuntos mundanos, vamos voltar para o nosso roteiro?"` },
        { role: "user", content: message }
      ],
      model: "gpt-3.5-turbo", // Ou gpt-4o se tiver acesso
      temperature: 0.8,
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "Oppa está um pouco confuso agora... (Erro ao conectar com OpenAI)" });
  }
});

// Listar todas as categorias com seus filmes
app.get('/api/categories', (req, res) => {
  const sql = "SELECT * FROM categories";
  db.all(sql, [], (err, categories) => {
    if (err) return res.status(400).json({ error: err.message });
    
    // Para cada categoria, pegar os filmes
    const promises = categories.map(cat => {
      return new Promise((resolve, reject) => {
         db.all("SELECT * FROM movies WHERE category_id = ?", [cat.id], (err, movies) => {
            if (err) reject(err);
            resolve({ ...cat, movies });
         });
      });
    });

    Promise.all(promises).then(results => res.json(results));
  });
});

// Filme Destaque
app.get('/api/featured', (req, res) => {
  db.get("SELECT * FROM movies WHERE is_featured = 1 LIMIT 1", (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(row);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
