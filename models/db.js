const low = require('lowdb');
const path = require('path');
const file = path.join(__dirname, 'data.json')
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(file);
const db = low(adapter);
module.exports = db;