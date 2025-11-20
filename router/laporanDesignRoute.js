import express from "express";
import {
  getAllLaporanDesign,
  getLaporanDesignById,
  addLaporanDesign,
  updateLaporanDesign,
  deleteLaporanDesign
} from "../controller/laporanDesignController.js";

const router = express.Router();

router.get("/", getAllLaporanDesign);
router.get("/:id", getLaporanDesignById);
router.post("/", addLaporanDesign);
router.put("/:id", updateLaporanDesign);
router.delete("/:id", deleteLaporanDesign);

export default router;
