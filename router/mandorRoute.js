import express from "express";
import {
  getAllMandor,
  getMandorById,
  registerMandor,
  loginMandor,
  updateMandor,
  deleteMandor
} from "../controller/mandorController.js";

const router = express.Router();

router.get("/", getAllMandor);
router.get("/:id", getMandorById);
router.post("/register", registerMandor);
router.post("/login", loginMandor);
router.put("/:id", updateMandor);
router.delete("/:id", deleteMandor);

export default router;
