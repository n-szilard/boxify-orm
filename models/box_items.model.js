const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const BoxItem = sequelize.define(
        'box_items',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            boxId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'boxes',
                    key: 'id'
                }
            },
            itemId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'items',
                    key: 'id'
                }
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            timestamps: true,
            indexes: [
                {
                    fields: ['boxId']
                },
                {
                    fields: ['itemId']
                }
            ]
        }
    );

    return BoxItem;
};