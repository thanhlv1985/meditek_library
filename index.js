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
}