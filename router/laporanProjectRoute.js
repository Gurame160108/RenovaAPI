import express from "express";
import {
  getAllLaporanProject,
  getLaporanProjectById,
  addLaporanProject,
  updateLaporanProject,
  deleteLaporanProject
} from "../controller/laporanProjectController.js";

const router = express.Router();

router.get("/", getAllLaporanProject);
router.get("/:id", getLaporanProjectById);
router.post("/", addLaporanProject);
router.put("/:id", updateLaporanProject);
router.delete("/:id", deleteLaporanProject);

export default router;
