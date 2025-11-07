import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",       // isi sesuai MySQL kamu (biasanya kosong di XAMPP)
  database: "renova" // ubah sesuai nama database kamu
});
