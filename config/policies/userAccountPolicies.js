module.exports={
	'UserAccount/v0_1/UserAccountController':{
      // 'Test':['checkCookieToken'],
      'Test':['isAuthenticated'],
	    'TestPost':['isAuthenticated'],
	    'TestURL':'checkVersion',
	    'CreateUserAccount':['isAuthenticated','isAdmin'],
	    'DisableUserAccount':['isAuthenticated','isAdmin'],
	    'EnableUserAccount':['isAuthenticated','isAdmin'],
	    'GetListUsers':['isAuthenticated','isAdmin'],
	    'RemoveIdentifierImage':['isAuthenticated','isAdmin'],
      'CheckExistUser':true,
      'forceChangePass':true,
  	},

  	'UserAccount/v0_1/UserActivationController':{
  		
  	},

  	'UserAccount/v0_1/AuthController':{
  		'login':true,
  		'logout':'isAuthenticated',
  	},

  	'UserAccount/v0_1/UserActivationController':{
  		'CreateUserActivation':true,
  		'Activation':true,
  		'DeactivationUserAccount':['isAuthenticated','isAdmin'],
  		'ActivationUserAccount':['isAuthenticated','isAdmin']
  	},

    'UserAccount/v0_1/UserTokenController':{
      '*':true,
    },
}