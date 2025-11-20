// index.js (file utama server)
import express from "express";
import cors from "cors";
import db from "./config/database.js";
import userRoutes from "./router/userRoute.js";
import adminRoutes from "./router/adminRoute.js";
import proyekRoute from "./router/proyekRoute.js";
import janjiRoute from "./router/janjiRoute.js";
import jadwalRoute from "./router/jadwalRoute.js"; // ✅ Pastikan ini benar
import arsitekRoute from "./router/arsitekRoute.js";
import mandorRoute from "./router/mandorRoute.js";
import laporanProjectRoute from "./router/laporanProjectRoute.js";
import laporanDesignRoutes from "./router/laporanDesignRoute.js";
import roles from "./router/roles.js";

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

// ✅ Daftarkan route - PERBAIKI PATH JADWAL
app.use("/api/users", userRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/projects", proyekRoute);
app.use("/api/janji", janjiRoute);
app.use("/api/jadwal", jadwalRoute); // ✅ Ini yang benar
app.use("/api/arsitek", arsitekRoute);
app.use("/api/mandor", mandorRoute); // ✅ Juga perbaiki ini
app.use("/api/laporan-project", laporanProjectRoute);
app.use("/api/laporan-design", laporanDesignRoutes);
app.use("/api/roles", roles);

// Jalankan server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});