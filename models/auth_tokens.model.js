const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AuthToken = sequelize.define(
        'auth_tokens',
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
            type: {
                type: DataTypes.ENUM('VERIFY_EMAIL', 'RESET_PASSWORD'),
                allowNull: false
            },
            token: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            expiresAt: {
                type: DataTypes.DATE,
                
            }
            
        },
        {
            timestamps: true,
            indexes: [
                {
                    fields: ['userId']
                }
            ]
        }
    );

    return AuthToken;
};