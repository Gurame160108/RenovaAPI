import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// GET all roles
router.get('/', (req, res) => {
  const query = "SELECT * FROM role";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

export default router;