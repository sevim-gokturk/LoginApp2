const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('./db/database.sqlite');

// Kullanıcı kayıt
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
        `INSERT INTO users(username,email,password) VALUES(?,?,?)`,
        [username, email, hashedPassword],
        function(err) {
            if(err) return res.status(400).json({ error: err.message });
            res.json({ message: 'User registered', id: this.lastID });
        }
    );
});

// Kullanıcı giriş
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, row) => {
        if(err) return res.status(500).json({ error: err.message });
        if(!row) return res.status(400).json({ error: 'User not found' });

        const match = await bcrypt.compare(password, row.password);
        if(match) res.json({ message: 'Login successful', user: { id: row.id, username: row.username } });
        else res.status(400).json({ error: 'Incorrect password' });
    });
});

module.exports = router;
