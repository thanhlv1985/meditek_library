/**
 * Created by tannguyen on 19/09/2016.
 */
var tracklog = {
    log: function(info) {
        var postData = {
            UserAccountID: Cookies.get("userInfo")?Cookies.get("userInfo").ID: null,
            SystemType: Cookies.get('systemtype'),
            DeviceID: Cookies.get('__browserFingerprint'),
            AppID: Cookies.get('appid'),
            TrackingName: info.name,
            Content: info.content,
            ClientTime: moment().format("DD/MM/YYYY HH:mm:ss")
        }

        $.ajax({
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            url: this.authBaseUrl + '/api/pushTrack',
            data: JSON.stringify(postData),
            contentType: 'application/json',
            success: function(data) {
                console.log("====================pushTrack=======================");
            },
        });
    }
}

function AuthAPI(authBaseUrl) {

    this.tokenTimeout = null;

    this.authBaseUrl = authBaseUrl;

    this.tokenInterval = null;

    this.removeRefreshCode = function () {
        if(localStorage.getItem('refreshCode')!==null) {
            localStorage.removeItem('refreshCode')
        }
    }

    this.clearAuthInfo = function() {
        Cookies.remove('token',{ path: '' });
        Cookies.remove('needRunTokenInterval',{ path: '' });
        Cookies.remove('userInfo',{ path: '' });
        Cookies.remove('userprofile',{ path: '' });
        localStorage.removeItem('refreshCode');
    }

    this.tranferAuth=function(selector, iframeSrc, authInfo, targetOrigin) {
        $(selector).on('load', function() {
            selector[0].contentWindow.postMessage({
                eventName: 'receiveAuthInfo',
                authInfo: authInfo
            }, targetOrigin);
        });
        $(selector).attr('src', iframeSrc);
    }

    this.tranferAuthToTargetUrl = function(authInfo, targetOrigin) {
        window.opener.postMessage({
            eventName: 'receiveAuthInfo',
            authInfo: authInfo
        }, targetOrigin)
    }

    this.receiveAuth= function(crossOrigin) {
        var self = this;
        var parseQueryString= function(location){
            var params = location.split('?');
            var str = params[1];
            var objURL = {};
            if(str) {
                str.replace(
                    new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
                    function( $0, $1, $2, $3 ){
                        objURL[ $1 ] = $3;
                    }
                );
            }
            return objURL;
        }

        var url = window.location.href;
        var paramUrl = parseQueryString(url);

        //Receive Auth from Params
        if(paramUrl.systemtype) Cookies.set('systemtype', paramUrl.systemtype);
        if(paramUrl.deviceid) Cookies.set('__browserFingerprint', paramUrl.deviceid);
        if(paramUrl.appid) Cookies.set('appid', paramUrl.appid);
        if(paramUrl.token) Cookies.set('token', paramUrl.token);
        if(paramUrl.refreshCode) localStorage.refreshCode =  paramUrl.refreshCode;
        tracklog.log.bind(self)({name:'_receiveAuth_url', content: url});
        //-----------------------------------------------

        //Receive Auth from postMessage
        window.addEventListener('message', function(event) {
            tracklog.log.bind(self)({name: 'eform_event_listener_message', content: {origin: event.origin, data: event.data}});
            // IMPORTANT: Check the origin of the data!
            if (~event.origin.indexOf(crossOrigin)) {
                // The data has been sent from your site
                // The data sent with postMessage is stored in event.data
                console.log("EFORM: RECEIVE MESSAGE:", event.data);
                if(event.data.eventName== 'receiveAuthInfo') {
                    var authInfo = event.data.authInfo||null;
                    self.getNewToken();
                    if(authInfo.needRunTokenInterval=='true') {
                        console.log("EFORM: RUN TOKEN INTERVAL");
                        Cookies.set('needRunTokenInterval', authInfo.needRunTokenInterval);
                        self.RunTokenInterval();
                    }
                    if(authInfo.refreshCode && authInfo.refreshCode!==localStorage.refreshCode) {
                        console.log("EFORM FIRST AUTHENTICATION");
                        Cookies.set('systemtype', authInfo.systemtype);
                        Cookies.set('__browserFingerprint', authInfo.deviceid);
                        Cookies.set('appid', authInfo.appid);
                        Cookies.set('token', authInfo.token);
                        Cookies.set('userInfo', authInfo.userInfo);
                        localStorage.refreshCode = authInfo.refreshCode;
                        window.location.reload(true);
                    } else {
                        console.log('EFORM HAD BEEN AUTHENTICATED');
                    }
                } else {
                    var error = new Error ("EFORM: This eventName not support");
                    console.error(error);
                }
            } else {
                // The data hasn't been sent from your site!
                // Be careful! Do not use it.
                var error = new Error ("EFORM:SecurityError: Blocked a frame with origin from accessing a cross-origin frame");
                console.error(error);
                return;
            }
        });
    }




    this.tracklog = tracklog

    this.getBrowserFingerPrint = function () {
        var self = this;
        $.ajax({
            type: "GET",
            xhrFields: {
                withCredentials: true
            },
            url: self.authBaseUrl + '/api/getBrowserFingerprint',
            success: function(data, status, xhr) {
                tracklog.log.bind(self)({name: 'getBrowserFingerPrint', content: data});
            },
            error: function(xhr,status,error) {
                tracklog.log.bind(self)({name: 'getBrowserFingerPrint', content: error});
            }
        });
    }


    this.getNewToken = function () {
        console.log('GETTING TOKEN FOR APP MODULE: ' + localStorage.appmoduleid);
        var self = this;
        if(Cookies.get('token') && Cookies.get('systemtype') && Cookies.get('__browserFingerprint') && Cookies.get('appid') && localStorage.refreshCode) {
            $.ajax({
                type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                headers: {
                    Authorization: 'Bearer ' + Cookies.get('token'),
                    systemtype: Cookies.get('systemtype'),
                    deviceid: Cookies.get('__browserFingerprint'),
                    appid: Cookies.get('appid'),

                },
                url: this.authBaseUrl + '/api/refresh-token/GetNewToken',
                data: {
                    refreshCode: localStorage.refreshCode
                },
                success: function(data, status, xhr) {
                    if (data && data.token) {
                        Cookies.set("token", data.token);
                        localStorage.refreshCode = data.refreshCode;
                        tracklog.log.bind(self)({name: 'getNewToken', content: data});
                    }
                },
                error: function(xhr,status,error) {
                    tracklog.log.bind(self)({name: 'getNewToken', content: error});
                }
            });
        }
    }

    this.RunTokenInterval = function() {
        if(Cookies.get('needRunTokenInterval')!='true') return;
        var self = this;
        $.ajax({
            type: "GET",
            xhrFields: {
                withCredentials: true
            },
            url: this.authBaseUrl + '/api/getAuthTokenTimeout/WEB',
            success: function(data, status, xhr) {
                self.tokenTimeout = data.timeout;
                if(data.timeout) {
                    if(!self.tokenInterval) {
                        self.tokenInterval=setInterval(function(){
                            self.getNewToken();
                        }, self.tokenTimeout*1000);
                    }
                }
            },
            error: function(xhr,status,error) {
                console.error(error);
            }
        });
    }
}
