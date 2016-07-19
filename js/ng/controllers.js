var module = angular.module("FsmApp.controllers", []);

module.controller("MainController", function ($scope, $location, HttpService) {
    //todo App Controller
});
module.controller("IndexController", function ($scope, $location, HttpService) {
    //todo Index Controller
});
module.controller("LoginController", function ($scope, $location, HttpService) {
    var storage = localStorage;
    storage.clear();
    $scope.error = null;
    $scope.login = function (usr, pwd) {
        console.log(usr, pwd);
        // Comprueba si se han completado los campos usuario y contraseña
        if ("undefined" === typeof usr || "" === usr.trim()) {
            $scope.error = "El usuario no puede estar vacío";
        } else if ("undefined" === typeof pwd || "" === pwd.trim()) {
            $scope.error = "La contraseña no puede estar vacía";
        } else {
            HttpService.authenticate(usr, pwd).success(function (data) {
                if (!data.error) {
                    storage.setItem("token",data.response);
                    // Redirige al index
                    $location.path("/");
                } else {
                    $scope.error = data.response.message;
                }
            });
        }
    }
});