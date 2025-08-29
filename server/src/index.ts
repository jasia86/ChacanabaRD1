import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

import pool from './db.js';

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
