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

module.exports = router;