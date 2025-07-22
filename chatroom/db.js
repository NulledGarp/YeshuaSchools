const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./chat.db");

// Create tables if not exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      role TEXT,
      socket_id TEXT,
      connected_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender TEXT,
      recipient TEXT,
      message TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = {
  addUser: (username, role, socket_id) => {
    db.run(
      `INSERT OR REPLACE INTO users (username, role, socket_id) VALUES (?, ?, ?)`,
      [username, role, socket_id]
    );
  },

  getUsersByRole: (role, callback) => {
    db.all(`SELECT username FROM users WHERE role = ?`, [role], (err, rows) => {
      if (err) return callback([]);
      callback(rows.map((row) => row.username));
    });
  },

  saveMessage: (sender, recipient, message) => {
    db.run(
      `INSERT INTO messages (sender, recipient, message) VALUES (?, ?, ?)`,
      [sender, recipient, message]
    );
  },

  getHistory: (user, callback) => {
    db.all(
      `SELECT sender, message, timestamp FROM messages
       WHERE sender = ? OR recipient = ?
       ORDER BY timestamp ASC`,
      [user, user],
      (err, rows) => {
        if (err) return callback([]);
        callback(rows);
      }
    );
  }
};
