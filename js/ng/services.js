var module = angular.module("FsmApp.services", []);
module.service("HttpService", function ($http, $q) {
    var host = "http://fsm-ws.dev";
    return {
        host: host
    }
});