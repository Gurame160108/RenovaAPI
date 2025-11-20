// controllers/laporanProjectController.js
import db from "../config/database.js";

// ====================================================
// ✅ Ambil semua laporan project (JOIN user, mandor, proyek)
// ====================================================
export const getAllLaporanProject = (req, res) => {
  const query = `
    SELECT lp.*, 
           u.Nama_Lengkap AS namaUser, 
           m.id_mandor,
           p.Nama_Proyek
    FROM laporanproject lp
    LEFT JOIN user u ON lp.id_user = u.id_user
    LEFT JOIN mandor m ON lp.id_Mandor = m.id_mandor
    LEFT JOIN proyek p ON lp.id_proyek = p.id_proyek
    ORDER BY lp.Tanggal_Laporan DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ====================================================
// ✅ Ambil laporan berdasarkan ID
// ====================================================
export const getLaporanProjectById = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT lp.*, 
           u.Nama_Lengkap AS namaUser, 
           m.id_mandor,
           p.Nama_Proyek
    FROM laporanproject lp
    LEFT JOIN user u ON lp.id_user = u.id_user
    LEFT JOIN mandor m ON lp.id_Mandor = m.id_mandor
    LEFT JOIN proyek p ON lp.id_proyek = p.id_proyek
    WHERE lp.id_laporanProject = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0)
      return res.status(404).json({ message: "Laporan tidak ditemukan" });

    res.json(results[0]);
  });
};

// ====================================================
// ✅ Tambah laporan project
// ====================================================
export const addLaporanProject = (req, res) => {
  const {
    Nama_Laporan,
    Tanggal_Laporan,
    Tahap_Project,
    Foto,
    id_Mandor,
    id_user,
    id_proyek
  } = req.body;

  if (!Nama_Laporan || !Tanggal_Laporan)
    return res.status(400).json({ message: "Nama laporan dan tanggal wajib diisi" });

  const query = `
    INSERT INTO laporanproject 
    (Nama_Laporan, Tanggal_Laporan, Tahap_Project, Foto, id_Mandor, id_user, id_proyek)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [Nama_Laporan, Tanggal_Laporan, Tahap_Project, Foto, id_Mandor, id_user, id_proyek],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        message: "Laporan project berhasil ditambahkan",
        id_laporanProject: result.insertId,
      });
    }
  );
};

// ====================================================
// ✅ Update laporan
// ====================================================
export const updateLaporanProject = (req, res) => {
  const { id } = req.params;

  const {
    Nama_Laporan,
    Tanggal_Laporan,
    Tahap_Project,
    Foto,
    id_Mandor,
    id_user,
    id_proyek
  } = req.body;

  const query = `
    UPDATE laporanproject
    SET Nama_Laporan = ?, Tanggal_Laporan = ?, Tahap_Project = ?, Foto = ?, 
        id_Mandor = ?, id_user = ?, id_proyek = ?
    WHERE id_laporanProject = ?
  `;

  db.query(
    query,
    [Nama_Laporan, Tanggal_Laporan, Tahap_Project, Foto, id_Mandor, id_user, id_proyek, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: "Laporan project berhasil diperbarui" });
    }
  );
};

// ====================================================
// ✅ Hapus laporan
// ====================================================
export const deleteLaporanProject = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM laporanproject WHERE id_laporanProject = ?";

  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: "Laporan project berhasil dihapus" });
  });
};
