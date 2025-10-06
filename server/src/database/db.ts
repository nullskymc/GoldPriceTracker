import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'investments.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS investments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    grams REAL NOT NULL,
    totalCostRmb REAL NOT NULL,
    createdAt TEXT DEFAULT (datetime('now'))
  )
`);

export default db;
