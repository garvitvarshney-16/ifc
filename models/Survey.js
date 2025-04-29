const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Survey = sequelize.define('Survey', {
    survey_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    ifc_data: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: true, // or false if required
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    assigned_to: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
});

module.exports = Survey;
