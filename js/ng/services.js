var module = angular.module("FsmApp.services", []);
module.service("HttpService", function ($http, $q) {
    var host = "http://fsm-ws.dev/";
    var endPoints = {
        authenticate: host + "authenticate/",
        files: host + "files/",
    };
    var getToken= function(){
        return localStorage.getItem("token");
    }
    return {
        authenticate: function (user, password) {
            var request = $http({
                method: "post",
                url: endPoints.authenticate,
                data: {
                    user: user,
                    password: password
                }
            });
            return request;
        },
        authenticateToken: function (token) {
            return $http({
                method: "post",
                url: endPoints.authenticate,
                data: {
                    token: token
                }
            });
        },
        getResources: function (path) {
            return $http({
                method: "post",
                url: endPoints.files + path,
                data: {
                    token: getToken()
                }
            })
        }
    }
});