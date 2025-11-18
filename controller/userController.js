import db from "../config/database.js";
import bcrypt from "bcryptjs";

// ✅ Ambil semua user
export const getAllUsers = (req, res) => {
  const query = "SELECT * FROM user";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ✅ Ambil user berdasarkan ID
export const getUserById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM user WHERE id_user = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "User not found" });
    res.json(results[0]);
  });
};

// ✅ Tambah user baru (REGISTER)
export const createUser = async (req, res) => {
  try {
    const { Nama_Lengkap, password, alamat, no_telp, email, id_role } = req.body;

    if (!Nama_Lengkap || !password || !email) {
      return res
        .status(400)
        .json({ message: "Nama, password, dan email wajib diisi" });
    }

    // cek email duplikat
    db.query("SELECT * FROM user WHERE email = ?", [email], async (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (result.length > 0)
        return res.status(400).json({ message: "Email sudah terdaftar" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const query =
        "INSERT INTO user (Nama_Lengkap, password, alamat, no_telp, email, id_role) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(
        query,
        [Nama_Lengkap, hashedPassword, alamat, no_telp, email, id_role || 2],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({
            message: "User created successfully",
            id_user: result.insertId,
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update user
export const updateUser = (req, res) => {
  const { id } = req.params;
  const { Nama_Lengkap, alamat, no_telp, email, id_role } = req.body;

  const query =
    "UPDATE user SET Nama_Lengkap=?, alamat=?, no_telp=?, email=?, id_role=? WHERE id_user=?";
  db.query(query, [Nama_Lengkap, alamat, no_telp, email, id_role, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User updated successfully" });
  });
};

// ✅ Hapus user
export const deleteUser = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM user WHERE id_user = ?";
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User deleted successfully" });
  });
};

// ✅ LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email dan password wajib diisi" });

    db.query("SELECT * FROM user WHERE email = ?", [email], (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (result.length === 0)
        return res.status(404).json({ message: "Email tidak ditemukan" });

      const user = result[0];
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Password salah!" });

      // kirim data user tanpa password
      delete user.password;

      res.json({
        message: "Login sukses",
        user: user,
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
