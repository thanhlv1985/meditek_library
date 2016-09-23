/**
 * Created by tannguyen on 23/09/2016.
 */
var jwt = require('jsonwebtoken');
var o = require('./HelperService');
module.exports = function (req,res, next) {
    if(req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization;
        var token = authorization.slice('Bearer '.length);
        var tokenDecoded = jwt.decode(token, {complete: true});
        if(tokenDecoded && tokenDecoded.payload && tokenDecoded.payload.sessionConnectKey) {
            var sessionConnectKey = tokenDecoded.payload.sessionConnectKey;
            req.sessionConnectKey = sessionConnectKey;
            if (o.isTimeGetNewToken(tokenDecoded.payload.createdAt, tokenDecoded.payload.expiresIn, 'WEB') ) {
                res.set('requireupdatetoken', true);
                //res.header('Access-Control-Expose-Headers', o.const.exposeHeaders);
            }
            return RedisService.getSessionConnect(sessionConnectKey)
                .then(function(sessionConnectInfo){
                    var sessionUser = sessionConnectInfo;
                    req.user = sessionUser;
                    return next();
                }, function(err){
                    return next();
                })
        } else {
            return next();
        }
    } else {
        return next();
    }
}