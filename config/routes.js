var routes = {};
var _ = require('lodash');

//Begin Module User Account 
var userAccountRoutes = require('./routes/userAccountRoutes');
_.extend(routes, userAccountRoutes);
//End Module User Account


var authorizationRoutes = require('./routes/authorizationRoutes');
_.extend(routes, authorizationRoutes);

module.exports.routes = routes;
