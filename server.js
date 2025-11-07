import express from "express";
import cors from "cors";
import { db } from "./config/database.js";

const app = express();
app.use(cors());
app.use(express.json());

// Tes koneksi database
db.connect(err => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database");
});

// Route sederhana
app.get("/", (req, res) => {
  res.send("Backend Express.js berjalan 🚀");
});

// Jalankan server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
