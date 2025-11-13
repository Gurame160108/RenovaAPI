import express from "express";
import cors from "cors";
import db from "./config/database.js";
import userRoutes from "./router/userRoute.js";
import adminRoutes from "./router/adminRoute.js";
import proyekRoute from "./router/proyekRoute.js";
import janjiRoute from "./router/janjiRoute.js";

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

// ✅ Daftarkan route
app.use("/api/users", userRoutes);
app.use("/api/admins", adminRoutes); // 🔥 Tambahan
app.use("/api/projects", proyekRoute);
app.use("/api/janji", janjiRoute);

// Jalankan server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
