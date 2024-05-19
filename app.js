


// app.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const db = require('./db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // 정적 파일 제공 폴더 설정

io.on('connection', (socket) => {
    console.log('New client connected');

    // 클래스 출발 시간 설정
    socket.on('startMeal', (classId) => {
        const currentTime = new Date().toLocaleTimeString();
        db.run(`INSERT OR REPLACE INTO times (class_id, time) VALUES (?, ?)`, [classId, currentTime], function(err) {
            if (err) {
                return console.log(err.message);
            }
            io.emit('timeUpdated', { classId, currentTime });
        });
    });

    // 클래스 출발 시간 취소
    socket.on('cancelMeal', (classId) => {
        db.run(`DELETE FROM times WHERE class_id = ?`, [classId], function(err) {
            if (err) {
                return console.log(err.message);
            }
            io.emit('timeUpdated', { classId, currentTime: "" });
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Listening on *:3000');
});
