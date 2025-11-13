import db from "../config/database.js";

// GET semua project
export const getAllProjects = (req, res) => {
  const query = `
    SELECT p.id_proyek, p.nama_proyek, p.tgl_proyek, p.status, p.id_user, p.id_mandor, p.id_arsitek
    FROM proyek p
    ORDER BY p.tgl_proyek DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// GET detail project by id_proyek, termasuk laporan project dan laporan design
export const getProjectById = (req, res) => {
  const { id } = req.params;

  // Query 1: data project
  const projectQuery = `SELECT * FROM proyek WHERE id_proyek = ?`;
  // Query 2: laporanproject terkait
  const laporanProjectQuery = `SELECT * FROM laporanproject WHERE id_proyek = ?`;
  // Query 3: laporan design terkait
  const laporanDesignQuery = `SELECT * FROM laporandesign WHERE id_proyek = ?`;

  db.query(projectQuery, [id], (err, projectResults) => {
    if (err) return res.status(500).json({ error: err.message });
    if (projectResults.length === 0)
      return res.status(404).json({ message: "Project tidak ditemukan" });

    const project = projectResults[0];

    db.query(laporanProjectQuery, [id], (err2, laporanProjectResults) => {
      if (err2) return res.status(500).json({ error: err2.message });

      db.query(laporanDesignQuery, [id], (err3, laporanDesignResults) => {
        if (err3) return res.status(500).json({ error: err3.message });

        res.json({
          project,
          laporanProjects: laporanProjectResults,
          laporanDesigns: laporanDesignResults,
        });
      });
    });
  });
};

// POST tambah project baru
export const createProject = (req, res) => {
  const { nama_proyek, tgl_proyek, status = "Proses", id_user, id_mandor, id_arsitek } = req.body;

  if (!nama_proyek || !tgl_proyek || !id_user || !id_mandor || !id_arsitek) {
    return res.status(400).json({ message: "Field wajib diisi semua" });
  }

  const query = `
    INSERT INTO proyek (nama_proyek, tgl_proyek, status, id_user, id_mandor, id_arsitek)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [nama_proyek, tgl_proyek, status, id_user, id_mandor, id_arsitek], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({
      message: "Project berhasil dibuat",
      id_proyek: result.insertId,
    });
  });
};

// PUT update project
export const updateProject = (req, res) => {
  const { id } = req.params;
  const { nama_proyek, tgl_proyek, status, id_user, id_mandor, id_arsitek } = req.body;

  const query = `
    UPDATE proyek SET nama_proyek = ?, tgl_proyek = ?, status = ?, id_user = ?, id_mandor = ?, id_arsitek = ?
    WHERE id_proyek = ?
  `;

  db.query(
    query,
    [nama_proyek, tgl_proyek, status, id_user, id_mandor, id_arsitek, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Project tidak ditemukan" });

      res.json({ message: "Project berhasil diperbarui" });
    }
  );
};

// DELETE project by id
export const deleteProject = (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM proyek WHERE id_proyek = ?`;
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Project tidak ditemukan" });

    res.json({ message: "Project berhasil dihapus" });
  });
};

// Tambahan: CRUD untuk laporanproject dan laporandesign bisa dibuat di controller lain jika diperlukan

