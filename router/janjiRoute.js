// router/janjiRoute.js
import express from "express";
import { 
  buatJanji, 
  getAllJanji, 
  getJanjiByUser,
  updateStatusJanji,  // ✅ TAMBAHAN
  deleteJanji          // ✅ TAMBAHAN (opsional)
} from "../controller/janjiController.js";

const router = express.Router();

// Route yang sudah ada
router.post("/buat", buatJanji);
router.get("/all", getAllJanji);
router.get("/user/:id_user", getJanjiByUser);

// ✅ ROUTE BARU
router.put("/:id_janji/status", updateStatusJanji);  // Update status
router.delete("/:id_janji", deleteJanji);            // Delete (opsional)

export default router;