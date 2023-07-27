const pool = require("../db/db");
const bcrypt = require("bcrypt");

const userService = {
  createUser: async (email, password) => {
    const res = await pool.query(
      "INSERT INTO users (email, password) VALUES (?, ?) ",
      [email, password]
    );
    const result = res[0];
    return result; 
  },
  findUserById: async (id) => {
    const result = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return result[0]; 
  },
  findByEmail: async (email) => {
    const res = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const res1 = res[0];
    const result = res1[0]; 
    return result;
  },
};

module.exports = userService;