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

// delete item by id
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item.findByPk(id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        await item.destroy();
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Patch item
router.patch('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const item = await Item.findByPk(id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        await item.update(payload);
        res.status(200).json(item);
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get Items by field
router.get('/:field/:op/:value', authenticate, async (req, res) => {
    try {
        const { field, op, value } = req.params;
        const operator = operatorMap[op];

        if (!operator) {
            return res.status(400).json({ message: 'Invalid operator' });
        }

        const where = {
            [field]: {
                [operator]: op === 'like' ? `%${value}%` : value,
            },
        };

        const items = await Item.findAll({ where });
        return res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items by field:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
// TODO: all item endpoints

module.exports = router;