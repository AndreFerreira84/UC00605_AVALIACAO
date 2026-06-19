require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

// ─── Pool de ligação ao MySQL ────────────────────────────────────────────────

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || 3306,
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '5291',
  database: process.env.DATABASE_NAME || 'catalogo_filmes',
  waitForConnections: true,
  connectionLimit: 10,
});

// ─── Constantes de validação ─────────────────────────────────────────────────

const GENEROS_VALIDOS = [
  'acao', 'comedia', 'drama', 'terror',
  'ficcao', 'documentario', 'animacao', 'outro',
];

const ANO_ATUAL = new Date().getFullYear();

// ─── Função de validação ─────────────────────────────────────────────────────

function validarFilme(body) {
  const { titulo, realizador, genero, ano, tipo, avaliacao } = body;

  if (!titulo || titulo.trim().length < 2) {
    return 'O campo "titulo" é obrigatório e deve ter pelo menos 2 caracteres.';
  }
  if (!realizador || realizador.trim() === '') {
    return 'O campo "realizador" é obrigatório e não pode estar vazio.';
  }
  if (!genero || !GENEROS_VALIDOS.includes(genero)) {
    return `O campo "genero" é obrigatório e deve ser um dos seguintes: ${GENEROS_VALIDOS.join(', ')}.`;
  }
  if (ano === undefined || ano === null || !Number.isInteger(ano) || ano < 1900 || ano > ANO_ATUAL) {
    return `O campo "ano" é obrigatório e deve ser um número inteiro entre 1900 e ${ANO_ATUAL}.`;
  }
  if (!tipo || !['filme', 'serie'].includes(tipo)) {
    return 'O campo "tipo" é obrigatório e deve ser "filme" ou "serie".';
  }
  if (avaliacao !== undefined && avaliacao !== null) {
    if (typeof avaliacao !== 'number' || avaliacao < 1 || avaliacao > 5) {
      return 'O campo "avaliacao" deve ser um número entre 1 e 5.';
    }
  }

  return null; // sem erros
}

// ─── Rotas ───────────────────────────────────────────────────────────────────

// GET /api/estado — verificar se a API está ativa
app.get('/api/estado', (req, res) => {
  res.status(200).json({ mensagem: 'API ativa' });
});

// GET /api/filmes — listar todos os filmes/séries
app.get('/api/filmes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM filmes ORDER BY id ASC');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

// GET /api/filmes/:id — obter um filme/série por ID
app.get('/api/filmes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM filmes WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ erro: `Filme com id ${id} não encontrado.` });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

// POST /api/filmes — criar um novo filme/série
app.post('/api/filmes', async (req, res) => {
  try {
    const erro = validarFilme(req.body);
    if (erro) {
      return res.status(400).json({ erro });
    }

    const { titulo, realizador, genero, ano, tipo, avaliacao = null, visto = false } = req.body;

    const [result] = await pool.query(
      'INSERT INTO filmes (titulo, realizador, genero, ano, tipo, avaliacao, visto) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [titulo.trim(), realizador.trim(), genero, ano, tipo, avaliacao, visto ? 1 : 0],
    );

    const [rows] = await pool.query('SELECT * FROM filmes WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

// PUT /api/filmes/:id — atualizar um filme/série completo
app.put('/api/filmes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se existe
    const [existing] = await pool.query('SELECT * FROM filmes WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ erro: `Filme com id ${id} não encontrado.` });
    }

    // Validar body
    const erro = validarFilme(req.body);
    if (erro) {
      return res.status(400).json({ erro });
    }

    const { titulo, realizador, genero, ano, tipo, avaliacao = null, visto = false } = req.body;

    await pool.query(
      'UPDATE filmes SET titulo = ?, realizador = ?, genero = ?, ano = ?, tipo = ?, avaliacao = ?, visto = ? WHERE id = ?',
      [titulo.trim(), realizador.trim(), genero, ano, tipo, avaliacao, visto ? 1 : 0, id],
    );

    const [rows] = await pool.query('SELECT * FROM filmes WHERE id = ?', [id]);
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

// PATCH /api/filmes/:id/visto — alternar o estado "visto"
app.patch('/api/filmes/:id/visto', async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT * FROM filmes WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ erro: `Filme com id ${id} não encontrado.` });
    }

    const vistoAtual = existing[0].visto;
    const novoVisto = vistoAtual ? 0 : 1;

    await pool.query('UPDATE filmes SET visto = ? WHERE id = ?', [novoVisto, id]);

    const [rows] = await pool.query('SELECT * FROM filmes WHERE id = ?', [id]);
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

// DELETE /api/filmes/:id — apagar um filme/série
app.delete('/api/filmes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT * FROM filmes WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ erro: `Filme com id ${id} não encontrado.` });
    }

    await pool.query('DELETE FROM filmes WHERE id = ?', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

// ─── Arranque do servidor ─────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});