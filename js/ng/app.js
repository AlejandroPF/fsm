var app = angular.module('FsmApp', [
    'FsmApp.controllers',
    'FsmApp.services',
    'ngRoute',
    'angularFileUpload',
]);
app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
                when("/login/", {templateUrl: "partials/login.html", controller: "LoginController"}).
                when("/users/", {templateUrl: "partials/users.html", controller: "UsersController"}).
                when("/chpwd/", {templateUrl: "partials/chpwd.html", controller: "ChangePasswordController"}).
                when("/!/:path*?",{templateUrl: "partials/fs.html",controller: "FsController"}).
                otherwise({redirectTo: '/login/'});
    }]);
app.run(function ($location, HttpService) {
    // Redirect to login if token is not set
    if ($location.path() !== "/login/") {
        var token = localStorage.getItem("token");
        if (null !== token) {
            HttpService.authenticateToken(token).success(function (data) {
                if (data.error) {
                    $location.path("/login/");
                }
            });
        } else {
            $location.path("/login/");
        }
    }
});