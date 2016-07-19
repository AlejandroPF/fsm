var module = angular.module("FsmApp.services", []);
module.service("HttpService", function ($http, $q) {
    var host = "http://fsm-ws.dev/";
    var endPoints = {
        authenticate: host + "authenticate/"
    };
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
    }
});