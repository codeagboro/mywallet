const { configService } = require("../config/config");
const mysql = require("mysql2");
const logger = require("../logs/logger");

const pool = mysql.createConnection({
  host: configService.dbHost,
  user: configService.dbUser,
  password: configService.dbPassword,
  database: configService.dbName,
  port: configService.dbPort,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, 
  idleTimeout: 60000,
  queueLimit: 0,
});

pool.query("SELECT 1 + 1 AS solution", function (error, results, fields) {
  if (error) throw error;

  logger.info("Database connected successfully 🚀🚀");
})

module.exports = pool.promise();