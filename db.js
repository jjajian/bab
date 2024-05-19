// db.js
const sqlite3 = require('sqlite3').verbose();

// 데이터베이스 연결
let db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to database');
    }
});

// 테이블 생성
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS times (
        class_id TEXT PRIMARY KEY,
        time TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error('Could not create table', err);
        } else {
            console.log('Table created or already exists');
        }
    });
});

module.exports = db;
