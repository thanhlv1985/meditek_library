//POLICIES
var policy_checkCookieToken=require("./api/policies/checkCookieToken");
var policy_checkVersion=require("./api/policies/checkVersion");
var policy_isActivated=require("./api/policies/isActivated");
var policy_isAdmin=require("./api/policies/isAdmin");
var policy_isAdminOrAssistant=require("./api/policies/isAdminOrAssistant");
var policy_isAdminOrAssistantOrGp=require("./api/policies/isAdminOrAssistantOrGp");
var policy_isAssistant=require("./api/policies/isAssistant");
var policy_isAuthenticated=require("./api/policies/isAuthenticated");
var policy_isClinicTelehealth=require("./api/policies/isClinicTelehealth");
var policy_isExternalPractitioner=require("./api/policies/isExternalPractitioner");
var policy_isInternalPractitioner=require("./api/policies/isInternalPractitioner");
var policy_isPatient=require("./api/policies/isPatient");
var policy_setExposeHeaders=require("./api/policies/setExposeHeaders");
//POLICIES

//SERVICE
var service_s=require("./api/services/Services");
var service_api=require("./api/services/api");
var service_APIService=require("./api/services/APIService");
var service_ErrorWrap=require("./api/services/ErrorWrap");
var service_HelperService=require("./api/services/HelperService");
var service_RedisService=require("./api/services/RedisService");
var service_RedisWrap=require("./api/services/RedisWrap");
var service_SendMailService=require("./api/services/SendMailService");
//var service_SendSMSService=require("./api/services/SendSMSService");
var service_UUIDService=require("./api/services/UUIDService");
var service_RefreshToken=require("./api/services/UserAccount/RefreshToken");
//SERVICE

//RESPONSES
var response_badRequest=require("./api/responses/badRequest");
var response_forbidden=require("./api/responses/forbidden");
var response_movedPermanently=require("./api/responses/movedPermanently");
var response_notActivated=require("./api/responses/notActivated");
var response_notFound=require("./api/responses/notFound");
var response_ok=require("./api/responses/ok");
var response_serverError=require("./api/responses/serverError");
var response_unauthor=require("./api/responses/unauthor");
//RESPONSES


//CONTROLLER
/*var controller_UserRoleController=require("./api/controllers/Authorization/v0_1/UserRoleController");
var controller_RefreshTokenController=require("./api/controllers/UserAccount/v0_1/RefreshTokenController");
var controller_UserAccountController=require("./api/controllers/UserAccount/v0_1/UserAccountController");
var controller_UserActivationController=require("./api/controllers/UserAccount/v0_1/UserActivationController");*/
//CONTROLLER

module.exports={
	//POLICIES BEGIN
	checkCookieToken:policy_checkCookieToken,
	checkVersion:policy_checkVersion,
	isActivated:policy_isActivated,
	isAdmin:policy_isAdmin,
	isAdminOrAssistant:policy_isAdminOrAssistant,
	isAdminOrAssistantOrGp:policy_isAdminOrAssistantOrGp,
	isAssistant:policy_isAssistant,
	isAuthenticated:policy_isAuthenticated,
	isClinicTelehealth:policy_isClinicTelehealth,
	isExternalPractitioner:policy_isExternalPractitioner,
	isInternalPractitioner:policy_isInternalPractitioner,
	isPatient:policy_isPatient,
	setExposeHeaders:policy_setExposeHeaders,
	//POLICIES END
	
	//SERVICE BEGIN
	Services:service_s;
	api:service_api,
	APIService:service_APIService,
	ErrorWrap:service_ErrorWrap,
	HelperService:service_HelperService,
	RedisService:service_RedisService,
	RedisWrap:service_RedisWrap,
	SendMailService:service_SendMailService,
	// SendSMSService:service_SendSMSService,
	UUIDService:service_UUIDService,
	RefreshToken:service_RefreshToken,
	//SERVICE END
	
	//RESPONSES BEGIN
	badRequest:response_badRequest,
	forbidden:response_forbidden,
	movedPermanently:response_movedPermanently,
	notActivated:response_notActivated,
	notFound:response_notFound,
	ok:response_ok,
	serverError:response_serverError,
	unauthor:response_unauthor,
	//RESPONSES END
	
	//CONTROLLER BEGIN
	/*UserRoleController:controller_UserRoleController,
	RefreshTokenController:controller_RefreshTokenController,
	UserAccountController:controller_UserAccountController,
	UserActivationController:controller_UserActivationController,*/
	//CONTROLLER END
}