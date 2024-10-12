const express = require('express');
const router = express.Router();
const db = require('../db');
const uuid = require('uuid');

// Get all deals
router.get('/deals', (req, res) => {
    const sql = 'SELECT * FROM deals';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Get deal by ID
router.get('/deal/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM deals WHERE deal_id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

// Add new deal
router.post('/deal', (req, res) => {
    const newDeal = { deal_id: uuid.v4(), ...req.body };
    const sql = 'INSERT INTO deals SET ?';
    db.query(sql, newDeal, (err, results) => {
        if (err) {
            return res.json({ error: "INVALID BODY INPUT" });
        }
        res.json({...newDeal });
    });
});

// Update deal by ID
router.put('/deal/:id', (req, res) => {
    const { id } = req.params;
    const updatedDeal = req.body;

    const sql = 'UPDATE deals SET ? WHERE deal_id = ?';
    db.query(sql, [updatedDeal, id], (err, results) => {
        if (err) throw err;
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Deal not found' });
        }
        res.json({ message: 'Deal updated successfully', updatedDeal });
    });
});

// Delete deal by ID
router.delete('/deal', (req, res) => {
    const deal_id = req.body.deal_id;
    const sql = 'DELETE FROM deals WHERE deal_id = ?';
    db.query(sql, deal_id, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

module.exports = router;