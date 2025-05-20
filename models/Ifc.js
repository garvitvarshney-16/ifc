const { DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config/database');

const Ifc = sequelize.define('Ifc', {
    IfcId: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    SurveyId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    Name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    Data: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {}
    },
    StartDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    EndDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    Notes: {
        type: DataTypes.STRING(250),
        allowNull: true
    },
    DateCreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal(`timezone('utc', now())`)
    },
    DateModified: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal(`timezone('utc', now())`)
    },
    CreatedBy: {
        type: DataTypes.UUID,
        allowNull: false
    },
    UpdatedBy: {
        type: DataTypes.UUID,
        allowNull: false
    },
    Status: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    IpAddress: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    tableName: 'Ifcs',
    schema: 'public',
    timestamps: false
});

module.exports = Ifc;