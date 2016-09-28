var redis=require("./RedisWrap");
var o=require("./HelperService");

var userConnectKeyPrefix="userConnect:";
var concatp=function()
{
	var str="";
	for (var i = 0; i < arguments.length; i++)
	{
		if(o.checkData(arguments[i]))
		{
			str=str+arguments[i]+':';
		}
	}
	str=str.substring(0,str.length-1);
	return str;
}

module.exports={
	pushSessionConnect: function(key, sessionUser) {
		redis.set(key, sessionUser);
		return key;
	},

	removeSessionConnect: function(key) {
		redis.del(key);
		return key;
	},

	getSessionConnect: function(key) {
		return redis.get(key)
			.then(function(sessionConnectInfo){
				if(sessionConnectInfo) {
					return JSON.parse(sessionConnectInfo);
				} else {
					return null;
				}
			}, function(err){
				throw err;
			})
	},

	pushUserConnect:function(connectInfo)
	{
		o.exlog("REDIS SERVICE-> pushUserConnect");
		var key=userConnectKeyPrefix+connectInfo.UserUID;
		var hashKey=concatp(connectInfo.SystemType,connectInfo.DeviceID,connectInfo.AppID);
		return redis.hget(key,hashKey)
			.then(function(obj){
				if(obj && obj.sid)
				{
					if(connectInfo.sid!=obj.sid)
						redis.del('sess:'+obj.sid);
					return "next";
				}
			},function(err){
				throw err;
			})
			.then(function(data){
				redis.hset(key,hashKey,connectInfo);
				console.log("pushUserConnect:",key,hashKey,connectInfo);
				return {status:'success'};
			},function(err){
				throw err;
			})
	},

	removeUserConnect:function(connectInfo)
	{
		o.exlog("REDIS SERVICE-> removeUserConnect");
		var key=userConnectKeyPrefix+connectInfo.UserUID;
		var hashKey=concatp(connectInfo.SystemType,connectInfo.DeviceID,connectInfo.AppID);
		return redis.hdel(key,hashKey)
			.then(function(success){
				return success;
			},function(err){
				throw err;
			})
	},

	getUserConnects:function(uid,connectInfo)
	{
		o.exlog("REDIS SERVICE-> getUserConnects");
		var key=userConnectKeyPrefix+uid;
		return redis.hkeysvals(key)
			.then(function(vals){
				console.log(vals);
			})
	},

	checkCurrentAccessWeb:function(uid)
	{
		o.exlog("REDIS SERVICE-> checkCurrentAccessWeb");
		var error=new Error("checkCurrentAccessWeb.Error");
		if(!o.checkData(uid))
		{
			error.pushError("uid.notProvided");
			throw error;
		}

		var key=userConnectKeyPrefix+uid;
		var hashKey=concatp(o.const.systemType.website);

		return redis.hget(key,hashKey)
			.then(function(obj){
				if(o.checkData(obj))
				{
					return {status:'exist'};
				}
				else
				{
					return {status:'notExist'};
				}
			},function(err){
				throw err;
			})
	}
}
