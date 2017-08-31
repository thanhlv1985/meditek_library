// var redis=require("redis");
// var client = redis.createClient();
// client.on("error", function (err) {
//     console.log("Error " + err);
// });
var o = require("./HelperService");
var $q = require("q");
var redis = require("redis");
//var client = redis.createClient(6378, 'redis');
//var client = redis.createClient(6378, '115.79.192.205', 'redis');
//var client = redis.createClient(6378, 'redis6378.jozjfj.ng.0001.apse2.cache.amazonaws.com', 'redis');
var client = redis.createClient({
    host: 'redis6378.jozjfj.ng.0001.apse2.cache.amazonaws.com',
    port: 6378
});
client.on("error", function(err) {
    console.log("REDIS ERROR", err);
});

var logHeader = "REDIS LOG: ";

module.exports = {


    del: function(key) {
        console.log(logHeader, 'del: ', key);
        client.del(key);
    },

    set: function(key, obj) {
        var objStr = JSON.stringify(obj);
        client.set(key, objStr);
        console.log(logHeader, 'set: ', key, obj);
    },

    hset: function(key, hashKey, obj) {
        var objStr = JSON.stringify(obj);
        client.hset(key, hashKey, objStr);
        console.log(logHeader, 'hset: ', key, hashKey, obj);
    },

    get: function(key) {
        var q = $q.defer();
        client.get(key, function(err, obj) {
            q.resolve(obj);
        })
        return q.promise;

    },

    hget: function(key, hashKey) {
        var q = $q.defer();
        try {
            client.hget(key, hashKey, function(err, objStr) {
                if (err) {
                    console.log(logHeader, 'hget: ', 'error: ', err);
                    throw err;
                } else {
                    var obj = JSON.parse(objStr);
                    console.log(logHeader, 'hget: ', obj);
                    q.resolve(obj);
                }
            })
        } catch (e) {
            q.reject(e);
        }
        return q.promise;
    },

    hkeys: function(key) {
        var q = $q.defer();
        try {
            client.hkeys(key, function(err, hashKeys) {
                if (err) {
                    throw err;
                } else {
                    q.resolve(hashKeys);
                }
            })
        } catch (e) {
            q.reject(e);
        }

        return q.promise;
    },

    hvals: function(key) {
        var q = $q.defer();
        try {
            client.hvals(key, function(err, vals) {
                if (err) {
                    throw err;
                } else {
                    var returnArr = [];
                    if (vals) {
                        vals.forEach(function(val) {
                            returnArr.push(JSON.parse(val));
                        })
                    }
                    q.resolve(returnArr);
                }
            })
        } catch (e) {
            q.reject(e);
        }

        return q.promise;
    },

    //{key:value,key:value}
    hgetall: function(key) {
        var q = $q.defer();
        try {
            client.hgetall(key, function(err, items) {
                if (err) {
                    throw err;
                } else {
                    var returnObj = {};
                    if (items) {
                        _.forEach(items, function(value, key) {
                            returnObj[key] = JSON.parse(value);
                        });
                    }
                    q.resolve(returnObj);
                }
            })
        } catch (e) {
            q.reject(e);
        }
        return q.promise;
    },

    //[{key:,val:}]
    hkeysvals: function(key) {
        var q = $q.defer();
        try {
            client.hgetall(key, function(err, items) {
                if (err) {
                    throw err;
                } else {
                    var returnArr = [];
                    if (items) {
                        _.forEach(items, function(value, key) {
                            var item = {
                                key: key,
                                val: JSON.parse(value)
                            }
                            returnArr.push(item);
                        });
                    }
                    q.resolve(returnArr);
                }
            })
        } catch (e) {
            q.reject(e);
        }
        return q.promise;
    },

    hdel: function(key, hashKey) {
        var q = $q.defer();
        try {
            client.hdel(key, hashKey, function(err, success) {
                if (err) {
                    throw err;
                } else {
                    q.resolve(success);
                }
            })

        } catch (err) {
            q.reject(err);
        }
        return q.promise;
    },

    setex: function(key, time, obj) {
        var objStr = JSON.stringify(obj);
        client.setex(key, time, objStr);
        console.log(logHeader, 'setex: ', key, time, obj);
    }

};