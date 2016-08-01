var $q=require('q');

module.exports=function(socketIOClient,sailsIOClient,io,url)
{
	io.sails.url=url;
	var obj={
		pushGlobalNotify:function(body)
		{
			var q=$q.defer();
			try{
				io.socket.post('/CreateGlobalNotifyJob',body,function(resData,jwres){
					q.resolve({resData:resData,jwres:jwres});
				})
			}
			catch(e){
				console.log("e",e);
				q.reject(e);
			}
			return q.promise;
		},
		
		pushNotify:function(body)
		{
			var q=$q.defer();
			try{
				io.socket.post('/CreateNotifyJob',body,function(resData,jwres){
					q.resolve({resData:resData,jwres:jwres});
				})
			}
			catch(e){
				q.reject(e);
			}
			return q.promise;
		},

		pushEmail:function(body)
		{
			var q=$q.defer();
			try{
				io.socket.post('/CreateEmailJob',body,function(resData,jwres){
					q.resolve({resData:resData,jwres:jwres});
				})
			}
			catch(e){
				q.reject(e);
			}
			return q.promise;
		},

		pushSMS:function(body)
		{
			var q=$q.defer();
			try{
				io.socket.post('/CreateSMSJob',body,function(resData,jwres){
					q.resolve({resData:resData,jwres:jwres});
				})
			}
			catch(e){
				q.reject(e);
			}
			return q.promise;
		},

		pushFinishJob:function(queueJobID)
		{
			var q=$q.defer();
			try{
				io.socket.post('/FinishQueueJob',{queueJobID:queueJobID},function(resData,jwres){
					q.resolve({resData:resData,jwres:jwres});
				})
			}	
			catch(e){
				q.reject(e);
			}
			return q.promise;
		},

		pushBuryJob:function(queueJobID,log)
		{
			var q=$q.defer();
			try{
				io.socket.post('/BuryQueueJob',{queueJobID:queueJobID,log:log},function(resData,jwres){
					q.resolve({resData:resData,jwres:jwres});
				})
			}
			catch(e){
				q.reject(e);
			}
			return q.promise;
		},
	}
	return obj;
}