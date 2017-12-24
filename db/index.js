const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('database.json');
const db = low(adapter);

// Set some defaults
db.defaults({ channels: [] })
    .write();

module.exports = db;
