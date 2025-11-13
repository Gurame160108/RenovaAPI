import express from "express";
import {
  buatJanji,
  getAllJanji,
  getJanjiByUser,
} from "../controller/janjiController.js";

const router = express.Router();

// ✅ Endpoint untuk user membuat janji
router.post("/", buatJanji);

// ✅ Endpoint admin untuk melihat semua janji
router.get("/", getAllJanji);

// ✅ Endpoint user untuk melihat janji miliknya
router.get("/user/:id_user", getJanjiByUser);

export default router;
