/**
 * Created by tannguyen on 29/09/2016.
 */
var o=require("../services/HelperService");
modules.exports = {
    isAdmin: function(req) {
        var isAdmin=false;
        if(o.checkData(req.user))
        {
            _.each(req.user.roles,function(role){
                if(role.RoleCode==o.const.roles.admin)
                    isAdmin=true;
            });
        }
        return isAdmin;
    },

    isInternalPractitioner: function(req) {
        var isInternalPractitioner=false;
        if(o.checkData(req.user))
        {
            _.each(req.user.roles,function(role){
                if(role.RoleCode==o.const.roles.internalPractitioner)
                    isExternalPractitioner=true;
            });
        }
        return isInternalPractitioner;
    },

    isExternalPractitioner: function(req) {
        var isExternalPractitioner=false;
        if(o.checkData(req.user))
        {
            _.each(req.user.roles,function(role){
                if(role.RoleCode==o.const.roles.externalPractitioner)
                    isExternalPractitioner=true;
            });
        }
        return isExternalPractitioner;
    },

    isPatient: function(req) {
        var isPatient=false;
        if(o.checkData(req.user))
        {
            _.each(req.user.roles,function(role){
                if(role.RoleCode==o.const.roles.patient)
                    isPatient=true;
            });
        }
        return isPatient;
    },

    isOwn: function(req, userUID) {
        var isOwn = false;
        if(o.checkData(req.user) && req.user.UID == userUID) {
            isOwn = true;
        }
        return isOwn;
    },

    orOperator: function() {
        var result = false;
        for(var i = 0; i< arguments.length; i++) {
            result = (result || arguments[i]);
        }
        return result;
    },

    andOperator: function() {
        var result = true;
        for(var i = 0; i< arguments.length; i++) {
            result = (result && arguments[i]);
        }
        return result;
    }
}