const express = require('express');
const router = express.Router();
const { BoxItem, Box, Item } = require('../models/index');
const { authenticate } = require('../middlewares/auth.middleware');

// GET /api/boxitems/:boxId — doboz összes tárgyának lekérése
router.get('/:boxId', authenticate, async (req, res) => {
    try {
        const data = await BoxItem.findAll({
            where: { boxId: req.params.boxId },
            include: [{ model: Item, as: 'item' }]
        });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/boxitems/:boxId/fill — telítettség számítás
router.get('/:boxId/fill', authenticate, async (req, res) => {
    try {
        const box = await Box.findByPk(req.params.boxId);
        if (!box) return res.status(404).json({ error: 'Doboz nem található' });

        const boxItemList = await BoxItem.findAll({
            where: { boxId: req.params.boxId },
            include: [{ model: Item, as: 'item' }]
        });

        // Box: heightCm, widthCm, lengthCm, maxWeightKg
        const boxVolumeCm3 = box.heightCm * box.widthCm * box.lengthCm;
        let usedWeightKg = 0;
        let usedVolumeCm3 = 0;

        for (const bi of boxItemList) {
            const qty = bi.quantity;
            // Item: heightCm, widthCm, lengthCm, weightKg
            usedWeightKg  += (bi.item.weightKg  ?? 0) * qty;
            usedVolumeCm3 += (bi.item.heightCm  ?? 0) * (bi.item.widthCm ?? 0) * (bi.item.lengthCm ?? 0) * qty;
        }

        res.json({
            boxId:          box.id,
            boxCode:        box.code,
            maxWeightKg:    box.maxWeightKg,
            boxVolumeCm3,
            usedWeightKg:   Math.round(usedWeightKg * 100) / 100,
            usedVolumeCm3:  Math.round(usedVolumeCm3),
            weightPercent:  box.maxWeightKg > 0 ? Math.round((usedWeightKg / box.maxWeightKg) * 100) : 0,
            volumePercent:  boxVolumeCm3   > 0 ? Math.round((usedVolumeCm3 / boxVolumeCm3) * 100)   : 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/boxitems — tárgy hozzáadása (ha már benne van: quantity++)
router.post('/', authenticate, async (req, res) => {
    try {
        const { boxId, itemId, quantity = 1 } = req.body;
        if (!boxId || !itemId) return res.status(400).json({ error: 'boxId és itemId kötelező' });

        const box  = await Box.findByPk(boxId);
        const item = await Item.findByPk(itemId);
        if (!box)  return res.status(404).json({ error: 'Doboz nem található' });
        if (!item) return res.status(404).json({ error: 'Tárgy nem található' });

        const existing = await BoxItem.findOne({ where: { boxId, itemId } });
        if (existing) {
            await existing.update({ quantity: existing.quantity + quantity });
            const updated = await BoxItem.findByPk(existing.id, { include: [{ model: Item, as: 'item' }] });
            return res.json(updated);
        }

        const created = await BoxItem.create({ boxId, itemId, quantity });
        const result  = await BoxItem.findByPk(created.id, { include: [{ model: Item, as: 'item' }] });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/boxitems/:id — quantity módosítása
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { quantity } = req.body;
        if (!quantity || quantity < 1) return res.status(400).json({ error: 'quantity legalább 1 kell' });

        const boxItem = await BoxItem.findByPk(req.params.id);
        if (!boxItem) return res.status(404).json({ error: 'BoxItem nem található' });

        await boxItem.update({ quantity });
        res.json(boxItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/boxitems/:id — eltávolítás
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const boxItem = await BoxItem.findByPk(req.params.id);
        if (!boxItem) return res.status(404).json({ error: 'BoxItem nem található' });

        await boxItem.destroy();
        res.json({ message: 'Tárgy eltávolítva' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Doboz kiürítése (minden BoxItem törlése egy boxId-vel)
router.delete('/empty/:boxId', authenticate, async (req, res) => {
    try {
        const boxId = req.params.boxId;
        const box = await Box.findByPk(boxId);
        if (!box) return res.status(404).json({ error: 'Doboz nem található' });

        await BoxItem.destroy({ where: { boxId } });
        res.json({ message: 'Doboz kiürítve' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;