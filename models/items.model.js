const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Item = sequelize.define(
        'items',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            userId: {
                // FK a Users táblához
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            category: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            lengthCm: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            widthCm: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            heightCm: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            weightKg: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            imagePath: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: true
            },
        },
        {
            timestamps: true,
            indexes: [
                {
                    fields: ['userId']
                },
                {
                    fields: ['name']
                }
            ]
        }
    );

    return Item;
};