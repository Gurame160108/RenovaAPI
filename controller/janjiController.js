import db from "../config/database.js";

export const buatJanji = async (req, res) => {
  const { keperluan, id_user } = req.body;

  if (!keperluan || !id_user) {
    return res.status(400).json({ message: "Keperluan dan id_user wajib diisi" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO janji (keperluan, status, id_user) VALUES (?, 'Diterima', ?)",
      [keperluan, id_user]
    );

    const id_janji = result.insertId;

 
   const [admins] = await db.query("SELECT id_user FROM user WHERE id_role = 1");

    for (const admin of admins) {
      await db.query(
        "INSERT INTO notif (judul, id_user, id_janji) VALUES (?, ?, ?)",
        [`Janji baru dari user ID ${id_user}`, admin.id_user, id_janji]
      );
    }

    res.status(201).json({
      message: "Janji berhasil dibuat dan diteruskan ke admin",
      id_janji,
    });
  } catch (error) {
    console.error("Error buat janji:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};


export const getAllJanji = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT j.id_janji, j.keperluan, j.status, u.Nama_Lengkap AS nama_user
      FROM janji j
      JOIN user u ON j.id_user = u.id_user
      ORDER BY j.id_janji DESC
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error getAllJanji:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};


export const getJanjiByUser = async (req, res) => {
  const { id_user } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM janji WHERE id_user = ? ORDER BY id_janji DESC",
      [id_user]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error getJanjiByUser:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
