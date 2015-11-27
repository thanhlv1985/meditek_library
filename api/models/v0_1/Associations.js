module.exports = {
    associations: function() {

        //UserAccount
        UserAccount.hasMany(UserActivation, {
            foreignKey: 'UserAccountID'
        });

        UserActivation.belongsTo(UserAccount, {
            foreignKey: 'UserAccountID'
        })

        UserAccount.hasMany(RelUserRole, {
            foreignKey: 'UserAccountId'
        })
        RelUserRole.belongsTo(UserAccount, {
            foreignKey: 'UserAccountId'
        })
        
        Role.hasMany(RelUserRole, {
            foreignKey: 'RoleId'
        })
        RelUserRole.belongsTo(Role, {
            foreignKey: 'RoleId'
        })

        Role.belongsToMany(UserAccount, {
            through: 'RelUserRole',
            foreignKey: 'RoleId'
        });
        UserAccount.belongsToMany(Role, {
            through: 'RelUserRole',
            foreignKey: 'ID'
        });

    }
};
