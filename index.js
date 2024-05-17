const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// SQLite 데이터베이스 연결
const dbPath = path.join(__dirname, 'times.db');
const db = new sqlite3.Database(dbPath);



app.use(express.static(path.join(__dirname, 'public')));




app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/', (req, res) => {
    // render 메서드를 사용하여 index.ejs 템플릿을 렌더링하고 클라이언트에게 전송
    db.all(`SELECT * FROM times ORDER BY id`, [], (err, rows) => {
        if (err) {
            console.error('Error fetching times from database:', err);
            res.status(500).send('Error fetching times from database');
            return;
        }

        // 조회된 데이터를 times 배열에 넣기
        const times = rows.map(row => row.time);
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
 // 반의 갯수에 따라 times 배열 수정
    });
});
// 테이블 생성
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS times (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        time TEXT
    )`);
});





// 출발 버튼을 눌렀을 때 동작할 라우트
app.post('/start/:id', (req, res) => {
    const currentTime = new Date().toISOString();
    db.run(`INSERT INTO times (time) VALUES (?)`, [currentTime], (err) => {
        if (err) {
            console.error('Error inserting time into database:', err);
            res.status(500).send('Error inserting time into database');
        } else {
            res.send('Time recorded: ' + currentTime);
        }
    });
});


// 취소 버튼을 눌렀을 때 동작할 라우트
app.post('/cancel/:id', (req, res) => {
    db.run(`DELETE FROM times WHERE id = ?`, [req.params.id], (err) => {
        if (err) {
            console.error('Error deleting time from database:', err);
            res.status(500).send('Error deleting time from database');
        } else {
            res.send('Time cleared');
        }
    });
});

// 서버 시작
// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
    // 매일 자정마다 시간 초기화
    setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
            db.run(`DELETE FROM times`, (err) => {
                if (err) {
                    console.error('Error clearing times:', err);
                } else {
                    console.log('Times cleared');
                }
            });
        }
    }, 1000); // 1초마다 현재 시간을 체크하여 매일 자정마다 시간을 초기화
});
