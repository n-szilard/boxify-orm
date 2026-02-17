const router = require('express').Router()
const { Item, operatorMap } = require('../models/index')
const { authenticate } = require('../middlewares/auth.middleware');

// get all items
router.get('/', authenticate, async (req, res) => {
    try {
        const items = await Item.findAll();
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/', authenticate, async (req, res) => {
    try {
        const payload = req.body;
        if (!payload || Object.keys(payload).length === 0) {
            return res.status(400).json({ error: 'Request body is required' });
        }
        const item = await Item.create(payload);
        res.status(201).json(item);
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
// TODO: all item endpoints

module.exports = router;