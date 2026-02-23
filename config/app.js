require('dotenv').config()

const express = require('express');
const cors = require('cors');

const userRoutes = require('../routes/users.routes');
const boxRoutes = require('../routes/boxes.routes');
const itemRoutes = require('../routes/items.routes');
const boxItemRoutes = require('../routes/boxitems.routes');


const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use('/users', userRoutes);
app.use('/boxes', boxRoutes);
app.use('/items', itemRoutes);
app.use('/boxitems', boxItemRoutes);


app.use('/uploads', express.static('uploads'));

module.exports = app;
