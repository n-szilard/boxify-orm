const { Sequelize, Op } = require('sequelize');

const dbConfig = require('../config/database')

const sequelize = new Sequelize(
    dbConfig.dtbs,
    dbConfig.user,
    dbConfig.pass,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        port: dbConfig.port,
        logging: dbConfig.logging
    }
);

const User = require('./user.model')(sequelize);
const Box = require('./boxes.model')(sequelize);
const Item = require('./items.model')(sequelize);
const BoxItem = require('./box_items.model')(sequelize);

// box_items kapcsolatok
BoxItem.belongsTo(Box, { foreignKey: 'boxId', as: 'box' });
BoxItem.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });
Box.hasMany(BoxItem, { foreignKey: 'boxId', as: 'boxItems' });
Item.hasMany(BoxItem, { foreignKey: 'itemId', as: 'boxItems' });

const operatorMap = {
    eq: Op.eq,
    lt: Op.lt,
    lte: Op.lte,
    gt: Op.gt,
    gte: Op.gte,
    lk: Op.like,
    not: Op.not
};

module.exports = { sequelize, User, Box, Item, BoxItem, operatorMap }