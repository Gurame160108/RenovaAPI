// controllers/laporanDesignController.js
import db from "../config/database.js";

// ====================================================
// ✅ Ambil semua laporan design (JOIN user dan proyek)
// ====================================================
export const getAllLaporanDesign = (req, res) => {
  const query = `
    SELECT ld.*, 
           u.Nama_Lengkap AS namaUser,
           p.nama_proyek
    FROM laporandesign ld
    LEFT JOIN user u ON ld.id_user = u.id_user
    LEFT JOIN proyek p ON ld.id_proyek = p.id_proyek
    ORDER BY ld.tgl_design DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ====================================================
// ✅ Ambil laporan design berdasarkan ID
// ====================================================
export const getLaporanDesignById = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT ld.*, 
           u.Nama_Lengkap AS namaUser,
           p.nama_proyek
    FROM laporandesign ld
    LEFT JOIN user u ON ld.id_user = u.id_user
    LEFT JOIN proyek p ON ld.id_proyek = p.id_proyek
    WHERE ld.id_design = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0)
      return res.status(404).json({ message: "Laporan design tidak ditemukan" });

    res.json(results[0]);
  });
};

// ====================================================
// ✅ Tambah laporan design
// ====================================================
export const addLaporanDesign = (req, res) => {
  const { nama, tgl_design, keterangan, Gambar, id_user, id_proyek } = req.body;

  if (!nama || !tgl_design || !keterangan)
    return res
      .status(400)
      .json({ message: "Field nama, tgl_design, dan keterangan wajib diisi" });

  const query = `
    INSERT INTO laporandesign 
      (nama, tgl_design, keterangan, Gambar, id_user, id_proyek)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [nama, tgl_design, keterangan, Gambar, id_user, id_proyek],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        message: "Laporan design berhasil ditambahkan",
        id_design: result.insertId,
      });
    }
  );
};

// ====================================================
// ✅ Update laporan design
// ====================================================
export const updateLaporanDesign = (req, res) => {
  const { id } = req.params;
  const { nama, tgl_design, keterangan, Gambar, id_user, id_proyek } = req.body;

  const query = `
    UPDATE laporandesign
    SET nama = ?, tgl_design = ?, keterangan = ?, Gambar = ?, 
        id_user = ?, id_proyek = ?
    WHERE id_design = ?
  `;

  db.query(
    query,
    [nama, tgl_design, keterangan, Gambar, id_user, id_proyek, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: "Laporan design berhasil diperbarui" });
    }
  );
};

// ====================================================
// ✅ Hapus laporan design
// ====================================================
export const deleteLaporanDesign = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM laporandesign WHERE id_design = ?";

  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: "Laporan design berhasil dihapus" });
  });
};
