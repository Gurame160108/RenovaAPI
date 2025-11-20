import db from "../config/database.js";

// ================================
// GET Jadwal Arsitek (dengan nama)
// ================================
export const getJadwalArsitek = (req, res) => {
  const query = `
    SELECT
      ja.id_jadwal_arsitek as id,
      ja.tanggal_Kerja,
      ja.jam_masuk,
      ja.id_arsitek,
      u.Nama_Lengkap as nama_arsitek
    FROM jadwal_arsitek ja
    LEFT JOIN arsitek a ON ja.id_arsitek = a.id_arsitek
    LEFT JOIN user u ON a.id_user = u.id_user
    ORDER BY ja.tanggal_Kerja DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ================================
// POST Jadwal Arsitek
// ================================
export const createJadwalArsitek = (req, res) => {
  const { tanggal_Kerja, jam_masuk, id_arsitek } = req.body;
  
  // Validasi input
  if (!tanggal_Kerja || !jam_masuk || !id_arsitek) {
    return res.status(400).json({ error: "Semua field wajib diisi" });
  }

  const query = `
    INSERT INTO jadwal_arsitek (tanggal_Kerja, jam_masuk, id_arsitek)
    VALUES (?, ?, ?)
  `;
  
  db.query(query, [tanggal_Kerja, jam_masuk, id_arsitek], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      message: "Jadwal arsitek berhasil ditambahkan",
      id: result.insertId,
    });
  });
};

// ================================
// UPDATE Jadwal Arsitek
// ================================
export const updateJadwalArsitek = (req, res) => {
  const { id } = req.params;
  const { tanggal_Kerja, jam_masuk, id_arsitek } = req.body;
  
  if (!tanggal_Kerja || !jam_masuk || !id_arsitek) {
    return res.status(400).json({ error: "Semua field wajib diisi" });
  }

  const query = `
    UPDATE jadwal_arsitek 
    SET tanggal_Kerja = ?, jam_masuk = ?, id_arsitek = ?
    WHERE id_jadwal_arsitek = ?
  `;
  
  db.query(query, [tanggal_Kerja, jam_masuk, id_arsitek, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Jadwal tidak ditemukan" });
    }
    res.json({ message: "Jadwal arsitek berhasil diupdate" });
  });
};

// ================================
// DELETE Jadwal Arsitek
// ================================
export const deleteJadwalArsitek = (req, res) => {
  const { id } = req.params;
  
  const query = `DELETE FROM jadwal_arsitek WHERE id_jadwal_arsitek = ?`;
  
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Jadwal tidak ditemukan" });
    }
    res.json({ message: "Jadwal arsitek berhasil dihapus" });
  });
};

// ================================
// GET Jadwal Mandor (dengan nama)
// ================================
export const getJadwalMandor = (req, res) => {
  const query = `
    SELECT
      jm.id_jadwal_mandor as id,
      jm.tanggal_Kerja,
      jm.jam_masuk,
      jm.id_mandor,
      u.Nama_Lengkap as nama_mandor
    FROM jadwal_mandor jm
    LEFT JOIN mandor m ON jm.id_mandor = m.id_mandor
    LEFT JOIN user u ON m.id_user = u.id_user
    ORDER BY jm.tanggal_Kerja DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ================================
// POST Jadwal Mandor
// ================================
export const createJadwalMandor = (req, res) => {
  const { tanggal_Kerja, jam_masuk, id_mandor } = req.body;
  
  if (!tanggal_Kerja || !jam_masuk || !id_mandor) {
    return res.status(400).json({ error: "Semua field wajib diisi" });
  }

  const query = `
    INSERT INTO jadwal_mandor (tanggal_Kerja, jam_masuk, id_mandor)
    VALUES (?, ?, ?)
  `;
  
  db.query(query, [tanggal_Kerja, jam_masuk, id_mandor], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      message: "Jadwal mandor berhasil ditambahkan",
      id: result.insertId,
    });
  });
};

// ================================
// UPDATE Jadwal Mandor
// ================================
export const updateJadwalMandor = (req, res) => {
  const { id } = req.params;
  const { tanggal_Kerja, jam_masuk, id_mandor } = req.body;
  
  if (!tanggal_Kerja || !jam_masuk || !id_mandor) {
    return res.status(400).json({ error: "Semua field wajib diisi" });
  }

  const query = `
    UPDATE jadwal_mandor 
    SET tanggal_Kerja = ?, jam_masuk = ?, id_mandor = ?
    WHERE id_jadwal_mandor = ?
  `;
  
  db.query(query, [tanggal_Kerja, jam_masuk, id_mandor, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Jadwal tidak ditemukan" });
    }
    res.json({ message: "Jadwal mandor berhasil diupdate" });
  });
};

// ================================
// DELETE Jadwal Mandor
// ================================
export const deleteJadwalMandor = (req, res) => {
  const { id } = req.params;
  
  const query = `DELETE FROM jadwal_mandor WHERE id_jadwal_mandor = ?`;
  
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Jadwal tidak ditemukan" });
    }
    res.json({ message: "Jadwal mandor berhasil dihapus" });
  });
};

// ================================
// GET List Arsitek (untuk dropdown)
// ================================
export const getListArsitek = (req, res) => {
  const query = `
    SELECT
      a.id_arsitek,
      u.Nama_Lengkap,
      a.status
    FROM arsitek a
    LEFT JOIN user u ON a.id_user = u.id_user
    WHERE a.status = 'aktif'
    ORDER BY u.Nama_Lengkap ASC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ================================
// GET List Mandor (untuk dropdown)
// ================================
export const getListMandor = (req, res) => {
  const query = `
    SELECT
      m.id_mandor,
      u.Nama_Lengkap,
      m.status
    FROM mandor m
    LEFT JOIN user u ON m.id_user = u.id_user
    WHERE m.status = 'aktif'
    ORDER BY u.Nama_Lengkap ASC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};