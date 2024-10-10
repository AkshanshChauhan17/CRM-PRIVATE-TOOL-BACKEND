const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all users
router.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Get user by ID
router.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

// Add new user
router.post('/users', (req, res) => {
    const newUser = { name: req.body.name, email: req.body.email };
    const sql = 'INSERT INTO users SET ?';
    db.query(sql, newUser, (err, results) => {
        if (err) throw err;
        res.json({ id: results.insertId, ...newUser });
    });
});

module.exports = router;