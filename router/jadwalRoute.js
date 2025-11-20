// routes/jadwalRoute.js
import express from 'express';
import {
  getJadwalArsitek,
  createJadwalArsitek,
  updateJadwalArsitek,
  deleteJadwalArsitek,
  getJadwalMandor,
  createJadwalMandor,
  updateJadwalMandor,
  deleteJadwalMandor,
  getListArsitek,
  getListMandor
} from '../controller/jadwalController.js';

const router = express.Router();

// Arsitek routes
router.get('/arsitek', getJadwalArsitek);
router.post('/arsitek', createJadwalArsitek);
router.put('/arsitek/:id', updateJadwalArsitek);
router.delete('/arsitek/:id', deleteJadwalArsitek);

// Mandor routes
router.get('/mandor', getJadwalMandor);
router.post('/mandor', createJadwalMandor);
router.put('/mandor/:id', updateJadwalMandor);
router.delete('/mandor/:id', deleteJadwalMandor);

// List untuk dropdown - PERBAIKI PATH INI
router.get('/list/arsitek', getListArsitek);
router.get('/list/mandor', getListMandor);

export default router;