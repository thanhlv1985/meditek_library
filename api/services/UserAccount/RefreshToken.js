/**
 * @namespace RefreshTokenService
 * @description Service for RefreshToken model
 */
var $q = require('q');
var o=require("../HelperService");
var moment=require("moment");
var jwt = require('jsonwebtoken');
/**
 * @typedef {object} ValidationException
 * @memberOf RefreshTokenService
 * @property {string} ErrorType	 "RefreshToken.Validation.Error"
 * @property {Array.<string|object>} ErrorsList Chỉ sử dụng ErrorsList[0]
 * - params.notProvided</br>
 * - userUID.notProvided</br>
 * - systemType.notProvided</br>
 * - deviceId.notProvided</br>
 * - appId.notProvided</br>
 * - systemType.unknown</br>
 */
/**
 * @function Validation
 * @description Kiểm tra thông tin user truy cập
 * @memberOf RefreshTokenService
 * @param {object} userAccess Thông tin user truy cập <UserUID,SystemType,DeviceID,AppID>
 * @return {object} obj.status="success"
 * @throws {RefreshTokenService.ValidationException}
 */
function Validation(userAccess)
{
	var error=new Error("RefreshToken.Validation.Error");
	var q=$q.defer();
	try
	{
		var systems=o.getSystems();
		var mobileSystems=o.getMobileSystems();

		//kiểm tra thông tin user request có được cung cấp hay không
		if(!_.isObject(userAccess) || _.isEmpty(userAccess))
		{
			error.pushError("params.notProvided");
			throw error;
		}

		if(!o.checkData(userAccess.UserUID))
		{
			error.pushError("userUID.notProvided");
			throw error;
		}

		//Kiểm tra systemType có được cung cấp hay không,
		//Nếu được cung cấp thì kiểm tra có hợp lệ hay không
		if(!o.checkData(userAccess.SystemType))
		{
			error.pushError("systemType.notProvided");
			throw error;
		}
		else if(systems.indexOf(userAccess.SystemType)>=0)
		{
			//Kiểm tra nếu là mobile system thì cần có deviceId
			if(mobileSystems.indexOf(userAccess.SystemType)>=0)
			{
				if(!userAccess.DeviceID)
				{
					error.pushError('deviceId.notProvided');
					throw error;
				}
				if(!userAccess.AppID)
				{
					error.pushError('appId.notProvided');
					throw error;
				}
				
			}
		}
		else
		{
			error.pushError("systemType.unknown");
			throw error;
		}
		q.resolve({status:'success'});
	}
	catch(err)
	{
		q.reject(err);
	}
	return q.promise;
};


module.exports={
	/**
	 * @typedef {object} MakeRefreshTokenException
	 * @memberOf RefreshTokenService
	 * @property {string} ErrorType value: "MakeRefreshToken.Error"
	 * @property {Array.<object|string>} ErrorsList Sử dụng ErrorsList[0] <br>
	 *   ErrorList[0]: </br>
	 *   - refreshToken.updateError	</br>
	 *   - refreshToken.queryError	</br>
	 *   - userAccount.notFound	</br>
	 *   - userAccount.queryError	</br>
	 */
	/**
	 * @function MakeRefreshToken 
	 * @description Xử lý tạo RefreshToken mới khi login/logout
	 * @memberOf RefreshTokenService
	 * @param { object} userAccess 
	 * @param {string} userAccess.UserUID
	 * @param { string} userAccess.SystemType
	 * @param {string} [userAccess.DeviceID] (mobile)
	 * @param {string} [userAccess.AppID] (mobile)
	 * @param {string} transaction
	 * @return {object} RefreshToken new Refresh Token
	 * @throws {RefreshTokenService.MakeRefreshTokenException}
	 * @throws {RefreshTokenService.ValidationException}
	 */
	MakeRefreshToken:function(userAccess,transaction)
	{
		console.log("=======================MakeRefreshToken==============================");
		var error=new Error("MakeRefreshToken.Error");
		return Validation(userAccess)
		.then(function(data){
			
			return UserAccount.findOne({
				where:{UID:userAccess.UserUID,Enable:'Y'},
				include: {
		            model: RelUserRole,
		            attributes: ['ID', 'UserAccountId', 'RoleId'],
		            include: {
		                model: Role,
		                attributes: ['ID', 'UID', 'RoleCode', 'RoleName']
		            }
		        },
		        transaction:transaction,
			})
			.then(function(u){
				var user=u.dataValues;
				var listRoles = [];
        		_.each(user.RelUserRoles, function(item) {
		            listRoles.push(item.Role.dataValues);
		        });
        		user.roles=listRoles;
				if(o.checkData(user))
				{
					//Truy vấn refreshToken (để xem có tồn tại hay chưa)
					function CheckExist()
					{
						return RefreshToken.findOne({
							where:{
								UserAccountID:user.ID,
								SystemType:userAccess.SystemType,
								DeviceID:userAccess.DeviceID,
								AppID:userAccess.AppID,
							},
							transaction:transaction,
						})
					}

					return CheckExist()	
					.then(function(rt){
						if(o.checkData(rt))
						{
							var refreshToken=rt.dataValues;
							var refreshTokenExpiration=o.getRefreshCodeExpiration(userAccess.SystemType,o.getMaxRole(user.roles));
							var refreshCodeExpiresIn=refreshTokenExpiration.expiresIn;
							var refreshCodePayload = {
								name: 'refreshCode',
								UID: user.UID,
								createdAt: new Date(),
								expiresIn: refreshCodeExpiresIn
							}
							var refreshCode = jwt.sign(refreshCodePayload, refreshToken.SecretKey, {
								expiresIn: refreshCodeExpiresIn
							})

							return rt.updateAttributes({
									RefreshCode: refreshCode,
									Status:o.const.refreshTokenStatus.got
								},{transaction:transaction})
								.then(function(result){
									return result;
								},function(err){
									o.exlog(err);
									error.pushError("refreshToken.updateError");
									throw error;
								})
						}
						else
						{
							console.log("=========================create user token");
							//Nếu refreshToken chưa tồn tại thì tạo mới refreshToken:

							var refreshTokenExpiration=o.getRefreshCodeExpiration(userAccess.SystemType,o.getMaxRole(user.roles));
							var refreshCodeExpiresIn=refreshTokenExpiration.expiresIn;
							var secretKey = UUIDService.Create();
							var refreshCodePayload = {
								name: 'refreshCode',
								UID: user.UID,
								createdAt: new Date(),
								expiresIn: refreshCodeExpiresIn
							}
							var refreshCode = jwt.sign(refreshCodePayload, secretKey, {
								expiresIn: refreshCodeExpiresIn
							})
							
							var insertInfo={
								UserAccountID:user.ID,
								SystemType:userAccess.SystemType,
								DeviceID:userAccess.DeviceID,
								AppID:userAccess.AppID,
								RefreshCode:refreshCode,
								Status:o.const.refreshTokenStatus.got,
								SecretKey:secretKey,
								SecretCreatedAt:new Date(),
							};


							return RefreshToken.create(insertInfo,{transaction:transaction})
							.then(function(result){
								return result;
							},function(err){
								o.exlog(err);
								error.pushError("refreshToken.insertError");
								throw error;
							})
						}
					},function(err){
						o.exlog(err);
						error.pushError("refreshToken.queryError");
						throw error;
					})
				}
				else
				{
					error.pushError("userAccount.notFound");
					throw error;
				}
			},function(err){
				o.exlog(err);
				error.pushError("userAccount.queryError");
				throw error;
			})
		},function(err){
			throw err;
		});
	},

	/**
	 * @typedef GetRefreshTokenException
	 * @memberOf RefreshTokenService
	 * @property {string} ErrorType value:"GetRefreshToken.Error"
	 * @property {Array<string.object>} ErrorsList Chỉ sử dụng ErrorsList[0]</br>
	 * - refreshToken.notFound</br>
	 * - refreshToken.queryError</br>
	 * - userAccount.notFound</br>
	 * - userAccount.queryError</br>
	 */
	/**
	 * @function GetRefreshToken 
	 * @description Trả về một RefreshToken theo điều kiện
	 * @memberOf RefreshTokenService
	 * @param {object} userAccess  Thông tin user truy cập<UserUID,SystemType,DeviceID,AppID>
	 * @param {object} transaction DB transaction
	 * @return {object} refreshToken info
	 * @throws {RefreshTokenService.GetRefreshTokenException} 
	 * @throws { UserAccountService.GetUserAccountDetailsException} 
	 * @throws {RefreshTokenService.ValidationException}
	 */
	GetRefreshToken:function(userAccess,transaction)
	{
		var error=new Error("GetRefreshToken.Error");
		return Validation(userAccess)
		.then(function(data){
			return Services.UserAccount.GetUserAccountDetails({UID:userAccess.UserUID},null,transaction)
			.then(function(user){

				if(o.checkData(user))
				{
					function CheckExist()
					{
						return RefreshToken.findOne({
							where:{
								UserAccountID:user.ID,
								SystemType:userAccess.SystemType,
								DeviceID:userAccess.DeviceID,
								AppID:userAccess.AppID,
							},
							transaction:transaction,
						})
					}
					
					return CheckExist()
					.then(function(rt){
						if(o.checkData(rt))
						{
							return rt;
						}
						else
						{
							error.pushError("refreshToken.notFound");
							throw error;
						}
					},function(err){
						o.exlog(err);
						error.pushError("refreshToken.queryError");
						throw error;
					})
				}
				else
				{
					error.pushError("userAccount.notFound");
					throw error;
				}
				
			},function(err){
				o.exlog(err);
				error.pushError("userAccount.queryError");
				throw error;
			})
			
		},function(err){
			throw err;
		})
	},
	

	UpdateStatus:function(userAccess, status, transaction)
	{
		var error=new Error("UpdateStatus.Error");
		var statusAccept=[o.const.refreshTokenStatus.waitget,o.const.refreshTokenStatus.got];
		if(statusAccept.indexOf(status)<0)
		{
			error.pushError("status.invalid");
			throw error;
		}
		return Validation(userAccess)
		.then(function(data){
			return Services.UserAccount.GetUserAccountDetails({UID:userAccess.UserUID},null,transaction)
			.then(function(user){
				if(o.checkData(user))
				{
					return RefreshToken.update({
						Status:status,
					},{
						where:{
							UserAccountID:user.ID,
							SystemType:userAccess.SystemType,
							DeviceID:userAccess.DeviceID||null,
							AppID:userAccess.AppID||null,
						},
						transaction:transaction,
					})
					.then(function(result){
						if(result && result[0] && result[0]>0)
						{
							return result;
						}
						else
						{
							error.pushError("refreshTokenStatus.noRowUpdate");
							throw error;
						}
					},function(err){
						console.log(err);
						error.pushError("refreshToken.updateError");
						throw error;
					})
				}
				else
				{
					error.pushError("user.notFound");
					throw error;
				}
			},function(err){
				console.log(err);
				error.pushError("user.queryError");
				throw error;
			})
			
		},function(err){
			throw err;
		})
		
	},

	
}
