
module.exports={
	'get /api/user-account/test':{
		controller:'UserAccount/v0_1/UserAccountController',
		action:'Test',
		// policy:'hasToken'
	},
	// 'get /api/user-account/test':function(req,res){
	// 	res.json({status:"heheehehhehe"});
	// },
	// 
	'get /api/user-account/test-url/:param1/:param2/:param3':{
		controller:'UserAccount/v0_1/UserAccountController',
		action:'TestURL',
	},

	'post /api/user-account/testPost':{
		controller:'UserAccount/v0_1/UserAccountController',
		action:'TestPost'
	},

	'post /api/user-account/CreateUserAccount':{
		controller:'UserAccount/v0_1/UserAccountController',
		action:'CreateUserAccount'
	},

	'put /api/user-account/UpdateUserAccount':{
		controller:'UserAccount/v0_1/UserAccountController',
		action:'UpdateUserAccount'
	},


	'delete /api/user-account/DisableUserAccount':{
		controller:'UserAccount/v0_1/UserAccountController',
		action:'DisableUserAccount'
	},

	'put /api/user-account/EnableUserAccount':{
		controller:'UserAccount/v0_1/UserAccountController',
		action:'EnableUserAccount'
	},

	'delete /api/user-account/RemoveIdentifierImage':{
		controller:'UserAccount/v0_1/UserAccountController',
		action:'RemoveIdentifierImage'
	},

	'get /api/user-account/GetIdentifierImageInfo':{
		controller:'UserAccount/v0_1/UserAccountController',
		action:'GetIdentifierImageInfo'
	},

	'get /api/user-account/CheckExistUser':{
		controller:'UserAccount/v0_1/UserAccountController',
		action:'CheckExistUser'
	},

	'put /api/user-activation/DeactivationUserAccount':{
		controller:'UserAccount/v0_1/UserActivationController',
		action:'DeactivationUserAccount'
	},

	'put /api/user-activation/ActivationUserAccount':{
		controller:'UserAccount/v0_1/UserActivationController',
		action:'ActivationUserAccount'
	},

	'get /api/user-account/GetUserAccountDetails':
	{
		controller:'UserAccount/v0_1/UserAccountController',
		action:'GetUserAccountDetails'
	},

	'post /api/user-account/GetListUsers':
	{
		controller:'UserAccount/v0_1/UserAccountController',
		action:'GetListUsers'
	},


	'get /api/user-account/find-by-phone':{
		controller:'UserAccount/v0_1/UserAccountController',
    	action:'FindByPhoneNumber'
	},

	'post /api/user-activation/create-user-activation':{
		controller:'UserAccount/v0_1/UserActivationController',
    	action:'CreateUserActivation'
	},

	
	'get /api/user-activation/activation':{
		controller:'UserAccount/v0_1/UserActivationController',
    	action:'Activation'
	},

	'post /api/refresh-token/GetNewToken':{
		controller:'UserAccount/v0_1/RefreshTokenController',
		action:'GetNewToken'
	},

	'post /api/user-account/get-DetailUser':{
		controller:'UserAccount/v0_1/UserAccountController',
    	action:'getDetailUser'
	},

	'get /api/user-account/force/changepass':{
		controller:'UserAccount/v0_1/UserAccountController',
    	action:'forceChangePass'
	},

	'get /test':'TestController.test',
    'get /testAdmin':'TestController.testAdmin',
    'get /testAssistant':'TestController.testAssistant',
    'get /testGp':'TestController.testGp',
    'get /testDoctor':'TestController.testDoctor',
    'get /testPatient':'TestController.testPatient',
};