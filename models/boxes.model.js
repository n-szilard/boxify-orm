const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Box = sequelize.define(
        'boxes',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            userId: {
                // FK a users táblához
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
            },
            code: {
                type: DataTypes.STRING(9),
                allowNull: false,
                unique: 'code',
            },
            labelType: {
                type: DataTypes.ENUM('QR', 'BARCODE'),
                allowNull: false,
                defaultValue: 'QR'
            },
            lengthCm: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            widthCm: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            heightCm: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            maxWeightKg: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            location: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            note: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM('ACTIVE', 'ARCHIVED', 'DAMAGED'),
                defaultValue: 'ACTIVE'
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
            
        }
    );

    return Box;
}