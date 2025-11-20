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

// ✅ Tambah user baru (REGISTER) - DIPERBAIKI
export const createUser = async (req, res) => {
  const connection = await new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) reject(err);
      else resolve(connection);
    });
  });

  try {
    await new Promise((resolve, reject) => {
      connection.beginTransaction(err => {
        if (err) reject(err);
        else resolve();
      });
    });

    const { Nama_Lengkap, password, alamat, no_telp, email, id_role } = req.body;

    if (!Nama_Lengkap || !password || !email) {
      return res.status(400).json({ message: "Nama, password, dan email wajib diisi" });
    }

    // Cek email duplikat
    const checkEmail = await new Promise((resolve, reject) => {
      connection.query("SELECT * FROM user WHERE email = ?", [email], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (checkEmail.length > 0) {
      await new Promise((resolve, reject) => {
        connection.rollback(() => {
          connection.release();
          resolve();
        });
      });
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert ke tabel user
    const insertUser = await new Promise((resolve, reject) => {
      const query = "INSERT INTO user (Nama_Lengkap, password, alamat, no_telp, email, id_role) VALUES (?, ?, ?, ?, ?, ?)";
      connection.query(query, [Nama_Lengkap, hashedPassword, alamat, no_telp, email, id_role || 2], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const userId = insertUser.insertId;

    // Otomatis insert ke tabel sesuai role
    if (id_role == 1) { // Admin
      await new Promise((resolve, reject) => {
        const query = "INSERT INTO admin (id_user, status) VALUES (?, 'aktif')";
        connection.query(query, [userId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    } else if (id_role == 3) { // Arsitek
      await new Promise((resolve, reject) => {
        const query = "INSERT INTO arsitek (id_user, status) VALUES (?, 'aktif')";
        connection.query(query, [userId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    } else if (id_role == 4) { // Mandor
      await new Promise((resolve, reject) => {
        const query = "INSERT INTO mandor (id_user, status) VALUES (?, 'aktif')";
        connection.query(query, [userId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    } else if (id_role == 5) { // CEO
      await new Promise((resolve, reject) => {
        const query = "INSERT INTO ceo (id_user, status) VALUES (?, 'aktif')";
        connection.query(query, [userId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // Commit transaction
    await new Promise((resolve, reject) => {
      connection.commit(err => {
        if (err) reject(err);
        else resolve();
      });
    });

    connection.release();

    res.status(201).json({
      message: "User created successfully",
      id_user: userId,
    });

  } catch (error) {
    // Rollback jika ada error
    await new Promise((resolve, reject) => {
      connection.rollback(() => {
        connection.release();
        resolve();
      });
    });
    
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update user - DIPERBAIKI untuk handle role change
export const updateUser = async (req, res) => {
  const connection = await new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) reject(err);
      else resolve(connection);
    });
  });

  try {
    await new Promise((resolve, reject) => {
      connection.beginTransaction(err => {
        if (err) reject(err);
        else resolve();
      });
    });

    const { id } = req.params;
    const { Nama_Lengkap, alamat, no_telp, email, id_role } = req.body;

    // Dapatkan role lama
    const oldUser = await new Promise((resolve, reject) => {
      connection.query("SELECT id_role FROM user WHERE id_user = ?", [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });

    const oldRole = oldUser.id_role;
    const newRole = parseInt(id_role);

    // Update data user
    const updateUserQuery = "UPDATE user SET Nama_Lengkap=?, alamat=?, no_telp=?, email=?, id_role=? WHERE id_user=?";
    await new Promise((resolve, reject) => {
      connection.query(updateUserQuery, [Nama_Lengkap, alamat, no_telp, email, newRole, id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Jika role berubah, update tabel terkait
    if (oldRole !== newRole) {
      // Hapus dari tabel role lama
      if (oldRole == 1) {
        await new Promise((resolve, reject) => {
          connection.query("DELETE FROM admin WHERE id_user = ?", [id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      } else if (oldRole == 3) {
        await new Promise((resolve, reject) => {
          connection.query("DELETE FROM arsitek WHERE id_user = ?", [id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      } else if (oldRole == 4) {
        await new Promise((resolve, reject) => {
          connection.query("DELETE FROM mandor WHERE id_user = ?", [id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      } else if (oldRole == 5) {
        await new Promise((resolve, reject) => {
          connection.query("DELETE FROM ceo WHERE id_user = ?", [id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }

      // Tambah ke tabel role baru
      if (newRole == 1) {
        await new Promise((resolve, reject) => {
          connection.query("INSERT INTO admin (id_user, status) VALUES (?, 'aktif')", [id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      } else if (newRole == 3) {
        await new Promise((resolve, reject) => {
          connection.query("INSERT INTO arsitek (id_user, status) VALUES (?, 'aktif')", [id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      } else if (newRole == 4) {
        await new Promise((resolve, reject) => {
          connection.query("INSERT INTO mandor (id_user, status) VALUES (?, 'aktif')", [id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      } else if (newRole == 5) {
        await new Promise((resolve, reject) => {
          connection.query("INSERT INTO ceo (id_user, status) VALUES (?, 'aktif')", [id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
    }

    await new Promise((resolve, reject) => {
      connection.commit(err => {
        if (err) reject(err);
        else resolve();
      });
    });

    connection.release();
    res.json({ message: "User updated successfully" });

  } catch (error) {
    await new Promise((resolve, reject) => {
      connection.rollback(() => {
        connection.release();
        resolve();
      });
    });
    
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Hapus user - DIPERBAIKI untuk hapus dari semua tabel
export const deleteUser = async (req, res) => {
  const connection = await new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) reject(err);
      else resolve(connection);
    });
  });

  try {
    await new Promise((resolve, reject) => {
      connection.beginTransaction(err => {
        if (err) reject(err);
        else resolve();
      });
    });

    const { id } = req.params;

    // Dapatkan role user untuk tahu tabel mana yang perlu dihapus
    const user = await new Promise((resolve, reject) => {
      connection.query("SELECT id_role FROM user WHERE id_user = ?", [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });

    // Hapus dari tabel role spesifik
    if (user.id_role == 1) {
      await new Promise((resolve, reject) => {
        connection.query("DELETE FROM admin WHERE id_user = ?", [id], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    } else if (user.id_role == 3) {
      await new Promise((resolve, reject) => {
        connection.query("DELETE FROM arsitek WHERE id_user = ?", [id], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    } else if (user.id_role == 4) {
      await new Promise((resolve, reject) => {
        connection.query("DELETE FROM mandor WHERE id_user = ?", [id], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    } else if (user.id_role == 5) {
      await new Promise((resolve, reject) => {
        connection.query("DELETE FROM ceo WHERE id_user = ?", [id], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // Hapus dari tabel user
    await new Promise((resolve, reject) => {
      connection.query("DELETE FROM user WHERE id_user = ?", [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await new Promise((resolve, reject) => {
      connection.commit(err => {
        if (err) reject(err);
        else resolve();
      });
    });

    connection.release();
    res.json({ message: "User deleted successfully" });

  } catch (error) {
    await new Promise((resolve, reject) => {
      connection.rollback(() => {
        connection.release();
        resolve();
      });
    });
    
    console.error("Error deleting user:", error);
    res.status(500).json({ error: error.message });
  }
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