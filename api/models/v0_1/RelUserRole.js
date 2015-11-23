module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            primaryKey: true
        },
        UserAccountId: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            references: {
                model: 'UserAccount',
                key: 'ID'
            }
        },
        RoleId: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            references: {
                model: 'Role',
                key: 'ID'
            }
        },
        SiteId: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            references: {
                model: 'Site',
                key: 'ID'
            }
        },
        CreatedDate: {
            type: Sequelize.DATE,
            allowNull: true,
            validate: {
                isDate: {
                    msg: 'Invalid!'
                }
            }
        },
        CreatedBy: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            }
        },
        ModifiedDate: {
            type: Sequelize.DATE,
            allowNull: true,
            validate: {
                isDate: {
                    msg: 'Invalid!'
                }
            }
        },
        ModifiedBy: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            }
        },
        Enable: {
            type: Sequelize.STRING(1),
            allowNull: true,
            comment: 'Y/N',
            defaultValue: 'Y',
            validate: {
                len: {
                    args: [0, 1],
                    msg: 'Too long!'
                }
            }
        }
    },
    associations: function() {},
    options: {
        tableName: 'RelUserRole',
        timestamps: false,
        hooks: {
            beforeCreate: function(reluserrole, options, callback) {
                reluserrole.CreatedDate = new Date();
                callback();
            },
            beforeBulkCreate: function(reluserroles, options, callback) {
                reluserroles.forEach(function(reluserrole, index) {
                    reluserroles[index].CreatedDate = new Date();
                });
                callback();
            },
            beforeBulkUpdate: function(reluserrole, callback) {
                reluserrole.fields.push('ModifiedDate');
                reluserrole.attributes.ModifiedDate = new Date();
                callback();
            }
        }
    }
};
