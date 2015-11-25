module.exports={

	'post /api/user-role/CreateUserRoleWithExistUser':{
		controller:'Authorization/v0_1/UserRoleController',
		action:'CreateUserRoleWithExistUser'
	},

	'post /api/user-role/CreateUserRoleWhenCreateUser':{
		controller:'Authorization/v0_1/UserRoleController',
		action:'CreateUserRoleWhenCreateUser'
	},

	'get /api/user-role/GetRolesOfUser':{
		controller:'Authorization/v0_1/UserRoleController',
		action:'GetRolesOfUser'
	}
}