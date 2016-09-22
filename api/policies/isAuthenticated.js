var jwt = require('jsonwebtoken');
var secret = 'ewfn09qu43f09qfj94qf*&H#(R';
var o = require("../services/HelperService");
var ErrorWrap = require("../services/ErrorWrap");
var jwt = require('jsonwebtoken');
var moment = require('moment');
/**
 * isAuthenticated: Kiểm tra user đã login hay chưa, và token của user có hợp lệ hay không
 * Input:
 *  - req.headers:
 * 		+authorization
 * 		+systemtype
 * 		+deviceid
 * Output:
 * - nếu thành công --->next()
 * - nếu thất bại trả error
 * 		error.errors[0]:
 * 			+ isAuthenticated.tokenInvalid: token quá hạn
 * 			+ isAuthenticated.authorizationFailPattern: lỗi sai định dạng authorization (Bearer ...)
 * 			+ isAuthenticated.authorizationNotProvided: header không có authorization field
 */
module.exports = function(req, res, next) {
    var error = new Error("Policies.isAuthenticated.Error");
    var authorization = req.headers.authorization;
    if (o.checkData(authorization)) {
        if (authorization.startsWith('Bearer ')) {
            var token = authorization.slice('Bearer '.length);
            var sessionUser = req.user;
            if(sessionUser) {
                var userAccess = {
                    UserUID: req.user.UID,
                    SystemType: req.headers.systemtype,
                    DeviceID: req.headers.deviceid,
                    AppID: req.headers.appid,
                };

                function systemValidation() {
                    return (sessionUser.DeviceID == userAccess.DeviceID && sessionUser.SystemType == userAccess.SystemType && sessionUser.AppID == userAccess.AppID);
                }

                if (!systemValidation()) {
                    error.pushError("isAuthenticated.sessionUserMismatchedUserAccess");
                    return res.unauthor(ErrorWrap(error));
                }

                jwt.verify(token, sessionUser.SecretKey, { algorithms: ['HS256'] }, function(err, decoded) {
                    if (o.checkData(err)) {
                        o.exlog(err);
                        //Nếu là lỗi token quá hạn
                        if (err.name == 'TokenExpiredError') {
                            console.log("============================TOKEN EXPIRE HANDLE");
                            error.pushError("isAuthenticated.TokenExpiredError");
                            return res.unauthor(ErrorWrap(error));
                        } else {
                            console.log(err);
                            error.pushError("isAuthenticated.tokenInvalid");
                            return res.unauthor(ErrorWrap(error));
                        }
                    } else {
                        next();
                    }
                })
            } else {
                error.pushError('isAuthenticated.sessionUserNotFound');
                return res.unauthor(ErrorWrap(error));
            }

        } else {
            error.pushError("isAuthenticated.authorizationFailPattern");
            return res.unauthor(ErrorWrap(error));
        }

    } else {
        error.pushError("isAuthenticated.authorizationNotProvided");
        return res.unauthor(ErrorWrap(error));
    }
};
