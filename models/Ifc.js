const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ifc = sequelize.define('Ifc', {
    survey_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },      
    data: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: []
    },
}, {
    timestamps: true,
});

module.exports = Ifc;
