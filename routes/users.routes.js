const router = require('express').Router()
const { generateToken, authenticate } = require('../middlewares/auth.middleware');
const { User, operatorMap } = require('../models/index')
const bcrypt = require('bcrypt');


// USER CRUD operations

// get all users
router.get('/', authenticate, async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// get user by id
router.get('/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

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

        const worktimes = await User.findAll({ where });
        return res.status(200).json(worktimes);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.post('/registration',async (req,res) => {
    try {
        const { name,email, password, confirm } = req.body;
        //ide jonnek a validaciok
        const user = await User.create({ name,email, password, confirm });
        res.status(201).json(user);
    }catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// user login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.scope('withPassword').findOne({ where: { email } });

        if (!user) return res.status(401).json({ error: 'Invalid email' });
        if (user.status === false) return res.status(403).json({ error: 'User is disabled' });

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) return res.status(401).json({ error: 'Invalid password' });

        await user.update({ last: new Date() });

        const token = generateToken(user);
        res.status(200).json({
            token: token,
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        });

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.patch('/:id', authenticate, async(req,res) => {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const updatedUser = await user.update(req.body);
    res.status(200).json(updatedUser);
});

router.delete('/:id', authenticate, async (req, res) => {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const deletedUser = await user.destroy();
    res.status(200).json({message: 'User deleted successfully'});
});

module.exports = router;