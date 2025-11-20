// controllers/mandorController.js
import db from "../config/database.js";
import bcrypt from "bcryptjs";

// ====================================================
// ✅ Ambil semua mandor (join ke user)
// ====================================================
export const getAllMandor = (req, res) => {
  const query = `
    SELECT m.id_mandor, m.status, u.id_user, u.Nama_Lengkap, u.email, 
           u.alamat, u.no_telp, u.id_role
    FROM mandor m
    JOIN user u ON m.id_user = u.id_user
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ====================================================
// ✅ Ambil mandor berdasarkan ID
// ====================================================
export const getMandorById = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT m.id_mandor, m.status, u.id_user, u.Nama_Lengkap, u.email, 
           u.alamat, u.no_telp, u.id_role
    FROM mandor m
    JOIN user u ON m.id_user = u.id_user
    WHERE m.id_mandor = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Mandor tidak ditemukan" });

    res.json(results[0]);
  });
};

// ====================================================
// ✅ Registrasi mandor baru
// ====================================================
export const registerMandor = async (req, res) => {
  const { Nama_Lengkap, email, password, alamat, no_telp } = req.body;

  if (!Nama_Lengkap || !email || !password)
    return res.status(400).json({ message: "Semua field wajib diisi" });

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    // id_role = 3 → role mandor
    const userQuery = `
      INSERT INTO user (Nama_Lengkap, email, password, alamat, no_telp, id_role)
      VALUES (?, ?, ?, ?, ?, 3)
    `;

    db.query(
      userQuery,
      [Nama_Lengkap, email, hashedPassword, alamat, no_telp],
      (err, userResult) => {
        if (err) return res.status(500).json({ message: err.message });

        const id_user = userResult.insertId;

        // Insert mandor
        const mandorQuery = `
          INSERT INTO mandor (id_user, status)
          VALUES (?, 'aktif')
        `;

        db.query(mandorQuery, [id_user], (err2, mandorResult) => {
          if (err2) return res.status(500).json({ message: err2.message });

          res.status(201).json({
            message: "Mandor baru berhasil ditambahkan!",
            id_user,
            id_mandor: mandorResult.insertId,
          });
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server", error });
  }
};

// ====================================================
// ✅ Login Mandor
// ====================================================
export const loginMandor = (req, res) => {
  const { email, password } = req.body;

  const query = `
    SELECT u.*, m.id_mandor 
    FROM mandor m
    JOIN user u ON m.id_user = u.id_user
    WHERE u.email = ?
  `;

  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length === 0)
      return res.status(401).json({ message: "Email tidak ditemukan" });

    const user = results[0];

    try {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid)
        return res.status(401).json({ message: "Password salah" });

      // Default role mandor = 3
      user.id_role = 3;

      res.status(200).json({
        message: "Login berhasil",
        role: "mandor",
        mandor: user,
      });
    } catch (compareErr) {
      return res.status(500).json({
        message: "Error verifikasi password",
        error: compareErr.message,
      });
    }
  });
};

// ====================================================
// ✅ Update status mandor
// ====================================================
export const updateMandor = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = "UPDATE mandor SET status = ? WHERE id_mandor = ?";

  db.query(query, [status, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Status mandor berhasil diperbarui" });
  });
};

// ====================================================
// ✅ Hapus mandor
// ====================================================
export const deleteMandor = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM mandor WHERE id_mandor = ?";

  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Mandor berhasil dihapus" });
  });
};
