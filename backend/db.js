// db.js
const fs = require('fs').promises;
const path = require('path');
const DB_PATH = path.join(__dirname, 'db.json');

async function readDB() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    // if file doesn't exist or is invalid, return default structure
    return { tickets: [] };
  }
}

async function writeDB(data) {
  const tmp = DB_PATH + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(tmp, DB_PATH);
}

module.exports = { readDB, writeDB, DB_PATH };
