function CountLogging() {
    CountLogging.count = ++CountLogging.count || 1;
    return CountLogging.count;
};
module.exports = function(request) {
    if (HelperService.CheckExistData(request) &&
        HelperService.CheckExistData(request.options)) {
        var data = null;
        var IP = (request ? request.ip : null);
        if (request.method === 'POST' &&
            HelperService.CheckExistData(request.body)) {
            data = request.body;
        } else if (request.method === 'GET') {
            data = request.allParams();
        }
        sails.log.info('-------------Start Logging-------------', CountLogging());
        sails.log.info('Status request', request.typeResponse);
        sails.log.info('Receive request from client:', new Date());
        sails.log.info('IP address client request:', IP);
        sails.log.info('API request:', request.url);
        sails.log.info('Method request:', request.method);
        sails.log.info('Action request:', request.options.action);
        sails.log.info('Data request:', JSON.stringify(data));
        sails.log.info('-------------End Logging-------------');
    }
};
