import express from "express";
import {
  getAllAdmins,
  getAdminById,
  registerAdmin,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  
} from "../controller/adminController.js";

const router = express.Router();

// ✅ Endpoint untuk admin
router.post("/login", loginAdmin);
router.get("/", getAllAdmins);
router.get("/:id", getAdminById);
router.post("/", registerAdmin);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

export default router;
