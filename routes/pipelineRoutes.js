const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL connection setup

// Get all pipelines
router.get('/pipelines', (req, res) => {
    const query = 'SELECT * FROM pipelines';

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Get a specific pipeline by ID
router.get('/pipelines/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM pipelines WHERE pipeline_id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Pipeline not found' });
        }
        res.json(result[0]);
    });
});

// Create a new pipeline
router.post('/pipelines', (req, res) => {
    const { pipeline_name, description } = req.body;
    const query = 'INSERT INTO pipelines (pipeline_name, description) VALUES (?, ?)';

    db.query(query, [pipeline_name, description], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Pipeline created successfully', pipeline_id: result.insertId });
    });
});

// Update a pipeline by ID
router.put('/pipelines/:id', (req, res) => {
    const { id } = req.params;
    const { pipeline_name, description } = req.body;
    const query = 'UPDATE pipelines SET pipeline_name = ?, description = ? WHERE pipeline_id = ?';

    db.query(query, [pipeline_name, description, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pipeline not found' });
        }
        res.json({ message: 'Pipeline updated successfully' });
    });
});

// Delete a pipeline by ID
router.delete('/pipelines/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM pipelines WHERE pipeline_id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pipeline not found' });
        }
        res.json({ message: 'Pipeline deleted successfully' });
    });
});

// Get all stages for a specific pipeline
router.get('/pipelines/:pipelineId/stages', (req, res) => {
    const { pipelineId } = req.params;
    const query = `
    SELECT s.stage_name, s.stage_order, s.description
    FROM stages s
    JOIN pipelines p ON p.pipeline_id = s.pipeline_id
    WHERE p.pipeline_id = ?
    ORDER BY s.stage_order;
  `;

    db.query(query, [pipelineId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

module.exports = router;