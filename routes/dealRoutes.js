const express = require('express');
const router = express.Router();
const db = require('../db');
const uuid = require('uuid');
const checkAdminRole = require('../middleware/isAdmin');

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
router.put('/deal/:id/:uid', (req, res) => {
    const { id, uid } = req.params;
    const updatedDeal = req.body;

    const sql = 'UPDATE deals SET ? WHERE deal_id = ?';
    db.query(sql, [updatedDeal, id], (err, results) => {
        if (err) throw err;
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Deal not found' });
        }

        db.query("INSERT INTO activities (deal_id, user_id, activity_type, details) VALUES (?, ?, ?, ?)", [id, uid, "stage change", `Deal updated on ${new Date().toUTCString()} by User Id: ${uid} Deal Id: ${id} Deal updated content ${JSON.stringify(updatedDeal)}`], () => {
            console.info(`UPDATE IN DEAL ACTIVITY RECORDED [UID: ${uid}, DID: ${JSON.stringify(updatedDeal)}]`)
        });

        res.json({ message: 'Deal updated successfully', updatedDeal });
    });
});

// Delete deal by ID
router.delete('/deal', (req, res) => {
    const deal_id = req.body.deal_id;
    console.log(deal_id)
    const sql = 'DELETE FROM deals WHERE deal_id = ?';
    db.query(sql, deal_id, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

router.get('/deals/pipeline/:pipelineId/:assigned_id', checkAdminRole, (req, res) => {
    const { pipelineId, assigned_id } = req.params;
    var query = "";

    if (req.isAdmin) {
        query = 'SELECT * FROM deals WHERE pipeline_id = ?';

        db.query(query, [pipelineId], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        });
    } else {
        query = 'SELECT * FROM deals WHERE pipeline_id = ? AND assign_to = ?';

        db.query(query, [pipelineId, assigned_id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        });
    };
});

module.exports = router;