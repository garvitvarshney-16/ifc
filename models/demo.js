const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
    const MemberProgress = sequelize.define('MemberProgress', {
        MemberProgressId: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        MemberId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        ServiceId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        SurveyId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        State: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        Notes: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        DateCreated: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal(timezone('utc', now()))
        },
        DateModified: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal(timezone('utc', now()))
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
        },
        ImageUrl: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        GroundTruth: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        GroundTruthComment: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        GroundTruthingLocation: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {}
        },
        GroundTruthingDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        SubCategory: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        ConstructionStagesMasterId: {
            type: DataTypes.UUID,
            allowNull: true
        }
    }, {
        tableName: 'MemberProgress',
        schema: 'public',
        timestamps: false
    });

    return MemberProgress;
};


// these column will be present in each table.

// "Notes" varchar(250) NULL,
// 	"DateCreated" timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
// 	"DateModified" timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
// 	"CreatedBy" uuid NOT NULL,
// 	"UpdatedBy" uuid NOT NULL,
// 	"Status" int4 NULL,
// 	"IpAddress" varchar(50) NULL,

//  date always will be UTC to store in database