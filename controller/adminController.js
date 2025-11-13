import db from "../config/database.js";
import bcrypt from "bcryptjs";

// ✅ Ambil semua admin (join ke user)
export const getAllAdmins = (req, res) => {
  const query = `
    SELECT a.id_admin, a.status, u.id_user, u.Nama_Lengkap, u.email, u.alamat, u.no_telp, u.id_role
    FROM admin a
    JOIN user u ON a.id_user = u.id_user
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ✅ Ambil admin by ID
export const getAdminById = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT a.id_admin, a.status, u.id_user, u.Nama_Lengkap, u.email, u.alamat, u.no_telp, u.id_role
    FROM admin a
    JOIN user u ON a.id_user = u.id_user
    WHERE a.id_admin = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Admin tidak ditemukan" });
    res.json(results[0]);
  });
};

// ✅ Registrasi admin baru
export const registerAdmin = async (req, res) => {
  const { Nama_Lengkap, email, password, alamat, no_telp } = req.body;

  if (!Nama_Lengkap || !email || !password)
    return res.status(400).json({ message: "Semua field wajib diisi" });

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const userQuery = `
      INSERT INTO user (Nama_Lengkap, email, password, alamat, no_telp, id_role)
      VALUES (?, ?, ?, ?, ?, 1)
    `;

    db.query(userQuery, [Nama_Lengkap, email, hashedPassword, alamat, no_telp], (err, userResult) => {
      if (err) return res.status(500).json({ message: err.message });

      const id_user = userResult.insertId;

      const adminQuery = `INSERT INTO admin (id_user, status) VALUES (?, 'aktif')`;
      db.query(adminQuery, [id_user], (err2, adminResult) => {
        if (err2) return res.status(500).json({ message: err2.message });

        res.status(201).json({
          message: "Admin baru berhasil ditambahkan!",
          id_user,
          id_admin: adminResult.insertId,
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error });
  }
};

export const loginAdmin = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT u.*, a.id_admin FROM admin a JOIN user u ON a.id_user = u.id_user WHERE u.email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      if (results.length === 0)
        return res.status(401).json({ message: "Email tidak ditemukan" });

      const user = results[0];

      try {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
          return res.status(401).json({ message: "Password salah" });

        user.id_role = 1;
        res.status(200).json({
          message: "Login berhasil",
          role: "admin",
          admin: user,
        });
      } catch (compareErr) {
        return res.status(500).json({ message: "Error verifikasi password", error: compareErr.message });
      }
    }
  );
};

// ✅ Update status admin
export const updateAdmin = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = "UPDATE admin SET status = ? WHERE id_admin = ?";
  db.query(query, [status, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Status admin berhasil diperbarui" });
  });
};

// ✅ Hapus admin (beserta user opsional)
export const deleteAdmin = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM admin WHERE id_admin = ?";
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Admin berhasil dihapus" });
  });
};
