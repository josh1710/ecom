// server.js
const express = require('express');
const pool = require('./db');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/articles', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM "Articles"');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/help', async (req, res) => {
  const { email, message } = req.body;
  if (!email || !message) return res.status(400).json({ error: 'Champs requis manquants' });
  try {
    await pool.query(
      'INSERT INTO help_requests (email, message) VALUES ($1, $2)',
      [email, message]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  const { articles, total } = req.body;
  if (!articles || !total) return res.status(400).json({ error: 'Champs requis manquants' });
  try {
    await pool.query(
      'INSERT INTO orders (articles, total) VALUES ($1, $2)',
      [JSON.stringify(articles), total]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
  res.json(rows);
});

app.get('/api/help', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM help_requests ORDER BY created_at DESC');
  res.json(rows);
});

app.listen(3001, () => {
  console.log('Serveur API lancé sur http://localhost:3001');
});