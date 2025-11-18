import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "renova",
});


db.connect((err) => {
  if (err) {
    console.error("Gagal koneksi ke database:", err.message);
  } else {
    console.log("Berhasil koneksi ke database MySQL");
  }
});

export default db;
