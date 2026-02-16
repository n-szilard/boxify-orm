const router = require('express').Router()
const { Box, operatorMap } = require('../models/index')
const { authenticate } = require('../middlewares/auth.middleware');

// get all boxes
router.get('/', authenticate, async (req, res) => {
    try {
        const boxes = await Box.findAll();
        res.status(200).json(boxes);
    } catch (error) {
        console.error('Error fetching boxes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// TODO: all endpoints
// Create a new box
router.post('/', authenticate, async (req, res) => {
    try {
        const payload = req.body;
        if (!payload || Object.keys(payload).length === 0) {
            return res.status(400).json({ error: 'Request body is required' });
        }
        const box = await Box.create(payload);
        res.status(201).json(box);
    } catch (error) {
        console.error('Error creating box:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a single box by id
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const box = await Box.findByPk(id);
        if (!box) return res.status(404).json({ error: 'Box not found' });
        res.status(200).json(box);
    } catch (error) {
        console.error('Error fetching box:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a box by id
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const box = await Box.findByPk(id);
        if (!box) return res.status(404).json({ error: 'Box not found' });
        await box.update(payload);
        res.status(200).json(box);
    } catch (error) {
        console.error('Error updating box:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a box by id
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const box = await Box.findByPk(id);
        if (!box) return res.status(404).json({ error: 'Box not found' });
        await box.destroy();
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting box:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;