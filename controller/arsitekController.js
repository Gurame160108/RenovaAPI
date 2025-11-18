// controllers/arsitekController.js
import db from "../config/database.js";
import bcrypt from "bcryptjs";

// ✅ Ambil semua arsitek (join ke user)
export const getAllArsitek = (req, res) => {
  const query = `
    SELECT a.id_arsitek, a.status, u.id_user, u.Nama_Lengkap, u.email, 
           u.alamat, u.no_telp, u.id_role
    FROM arsitek a
    JOIN user u ON a.id_user = u.id_user
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ✅ Ambil arsitek by ID
export const getArsitekById = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT a.id_arsitek, a.status, u.id_user, u.Nama_Lengkap, u.email, 
           u.alamat, u.no_telp, u.id_role
    FROM arsitek a
    JOIN user u ON a.id_user = u.id_user
    WHERE a.id_arsitek = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Arsitek tidak ditemukan" });

    res.json(results[0]);
  });
};

// ✅ Registrasi arsitek baru
export const registerArsitek = async (req, res) => {
  const { Nama_Lengkap, email, password, alamat, no_telp } = req.body;

  if (!Nama_Lengkap || !email || !password)
    return res.status(400).json({ message: "Semua field wajib diisi" });

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Tambah data ke user (role = 2 untuk arsitek)
    const userQuery = `
      INSERT INTO user (Nama_Lengkap, email, password, alamat, no_telp, id_role)
      VALUES (?, ?, ?, ?, ?, 2)
    `;

    db.query(
      userQuery,
      [Nama_Lengkap, email, hashedPassword, alamat, no_telp],
      (err, userResult) => {
        if (err) return res.status(500).json({ message: err.message });

        const id_user = userResult.insertId;

        // Tambah ke tabel arsitek
        const arsitekQuery = `
          INSERT INTO arsitek (id_user, status) 
          VALUES (?, 'aktif')
        `;

        db.query(arsitekQuery, [id_user], (err2, arsitekResult) => {
          if (err2) return res.status(500).json({ message: err2.message });

          res.status(201).json({
            message: "Arsitek baru berhasil ditambahkan!",
            id_user,
            id_arsitek: arsitekResult.insertId,
          });
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server", error });
  }
};

// ✅ Login Arsitek
export const loginArsitek = (req, res) => {
  const { email, password } = req.body;

  const query = `
    SELECT u.*, a.id_arsitek 
    FROM arsitek a 
    JOIN user u ON a.id_user = u.id_user
    WHERE u.email = ?
  `;

  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length === 0)
      return res.status(401).json({ message: "Email tidak ditemukan" });

    const user = results[0];

    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.status(401).json({ message: "Password salah" });

      // Default role arsitek = 2
      user.id_role = 2;

      res.status(200).json({
        message: "Login berhasil",
        role: "arsitek",
        arsitek: user,
      });
    } catch (compareErr) {
      return res.status(500).json({
        message: "Error verifikasi password",
        error: compareErr.message,
      });
    }
  });
};

// ✅ Update status arsitek
export const updateArsitek = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = "UPDATE arsitek SET status = ? WHERE id_arsitek = ?";

  db.query(query, [status, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Status arsitek berhasil diperbarui" });
  });
};

// ✅ Hapus arsitek
export const deleteArsitek = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM arsitek WHERE id_arsitek = ?";

  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Arsitek berhasil dihapus" });
  });
};
