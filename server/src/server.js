const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

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
        { title: 'Ação e Aventura', slug: 'action' },
        { title: 'Comédia', slug: 'comedy' }
      ];
      
      const stmt = db.prepare("INSERT INTO categories (title, slug) VALUES (?, ?)");
      categories.forEach(c => stmt.run(c.title, c.slug));
      stmt.finalize();

      // Inserir filmes de exemplo (simulado, associando IDs assumidos 1, 2, 3)
      const movieStmt = db.prepare("INSERT INTO movies (title, description, thumbnail_url, banner_url, category_id, is_featured) VALUES (?, ?, ?, ?, ?, ?)");
      
      // Filme Destaque
      movieStmt.run("Stranger Things", "Quando um garoto desaparece, a cidade toda participa nas buscas.", "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070", "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070", 1, 1);
      
      // Outros filmes
      for(let i=0; i<5; i++) {
        movieStmt.run(`Filme Ação ${i}`, "Descrição genérica.", `https://picsum.photos/300/450?random=${i}`, "", 2, 0);
      }
      movieStmt.finalize();
    }
  });
});

// --- Rotas ---

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
