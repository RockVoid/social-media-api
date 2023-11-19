import mysql from "mysql"
import dotenv from "dotenv"

dotenv.config()

export const db = mysql.createConnection({
  host: "localhost",
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DB
});