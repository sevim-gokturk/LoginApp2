const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite', (err) => {
    if (err) {
        console.error('Database opening error: ', err);
    } else {
        console.log('Database connected.');
    }
});

// Eğer tablo yoksa oluştur
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    `, (err) => {
        if (err) console.error('Table creation error: ', err);
        else console.log('Users table ready.');
    });
});


app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);


app.listen(3000, "0.0.0.0", () => {
    console.log('Server running on http://0.0.0.0:3000');
});

