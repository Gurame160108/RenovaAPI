// router/jadwalRoute.js
import express from "express";
import {
  getJadwalArsitek,
  createJadwalArsitek,
  getJadwalMandor,
  createJadwalMandor
} from "../controller/jadwalController.js"; // <- SUDAH BENAR TANPA "s"

const router = express.Router();

// =======================
// ROUTE JADWAL ARSITEK
// =======================
router.get("/arsitek", getJadwalArsitek);
router.post("/arsitek", createJadwalArsitek);

// =======================
// ROUTE JADWAL MANDOR
// =======================
router.get("/mandor", getJadwalMandor);
router.post("/mandor", createJadwalMandor);

export default router;
