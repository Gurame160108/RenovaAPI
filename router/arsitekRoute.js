import express from "express";
import {
  getAllArsitek,
  getArsitekById,
  registerArsitek,
  loginArsitek,
  updateArsitek,
  deleteArsitek
} from "../controller/arsitekController.js";

const router = express.Router();

router.get("/", getAllArsitek);
router.get("/:id", getArsitekById);
router.post("/register", registerArsitek);
router.post("/login", loginArsitek);
router.put("/:id", updateArsitek);
router.delete("/:id", deleteArsitek);

export default router;
