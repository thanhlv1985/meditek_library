var userRoleController_v0_1=require("../../controllers/Authorization/v0_1/UserRoleController");
module.exports={

	'post /api/user-role/CreateUserRoleWithExistUser':{
		'0.1':{
			enable:true,
			action:userRoleController_v0_1.CreateUserRoleWithExistUser
		}
	},

	'post /api/user-role/CreateUserRoleWhenCreateUser':{
		'0.1':{
			enable:true,
			action:userRoleController_v0_1.CreateUserRoleWhenCreateUser
		}
	},

	'get /api/user-role/GetRolesOfUser':{
		'0.1':{
			enable:true,
			action:userRoleController_v0_1.GetRolesOfUser
		}
	}
}