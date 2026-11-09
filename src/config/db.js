const mysql = require("mysql2/promise");
require("dotenv").config();

// Enable SSL automatically for remote cloud MySQL providers (TiDB Cloud, Aiven, Clever Cloud, etc.)
const isRemoteHost =
  process.env.DB_HOST &&
  !process.env.DB_HOST.includes("localhost") &&
  !process.env.DB_HOST.includes("127.0.0.1");

const ssl =
  process.env.DB_SSL === "true" ||
  process.env.DB_PORT === "4000" ||
  isRemoteHost
    ? {
        minVersion: "TLSv1.2",
        rejectUnauthorized: false,
      }
    : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  ssl,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL database connected successfully!");
    connection.release();
  } catch (error) {
    console.error("MySQL connection failed:", error.message || error);
    throw error;
  }
}

module.exports = {
  pool,
  testConnection,
};
