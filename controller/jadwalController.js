// controller/jadwalController.js
import db from "../config/database.js";

// ================================
// GET Jadwal Arsitek
// ================================
export const getJadwalArsitek = (req, res) => {
  const query = "SELECT * FROM jadwal_arsitek ORDER BY tanggal_Kerja DESC";

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
// GET Jadwal Mandor
// ================================
export const getJadwalMandor = (req, res) => {
  const query = "SELECT * FROM jadwal_mandor ORDER BY tanggal_Kerja DESC";

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
