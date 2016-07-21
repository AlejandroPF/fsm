var module = angular.module("FsmApp.controllers", []);

module.controller("MainController", function ($scope, $location, HttpService) {
    //todo App Controller
});
module.controller("BreadcrumbController", function ($scope) {
    var pathLevel = function (route) {
        return {
            source: route,
            name: null,
            isIcon: false // Si es TRUE crean un elemento span con attr. class cuyo valor ese el pathLevel.name
        }
    }
    $scope.pathLevel = [];
    var path = $scope.source;
    var root = new pathLevel("/");
    root.isIcon = true;
    root.name = "fa fa-home";
    $scope.pathLevel.push(root);
    if (path !== "/") {
        var routes = path.split("/");
        var currentPath = "";
        for (var index = 0; index < routes.length; index++) {
            if (routes[index].length > 0) {
                currentPath += "/" + routes[index];
                var el = new pathLevel(currentPath);
                el.name = routes[index];
                $scope.pathLevel.push(el);
            }
        }
    }
});
module.controller("NavController", function ($scope) {

});
module.controller("FsController", function ($scope, $location, HttpService, $routeParams) {
    if ("undefined" === typeof $routeParams.path) {
        $routeParams.path = "/";
    } else {
        // Quita los posibles "/" repetidos
        $routeParams.path = $routeParams.path.replace(/[/]{1,}/g, "/");
    }
    $scope.source = $routeParams.path;
    $scope.alert = false;
    $scope.error = false;
    $scope.resources = [];
    var Resource = function () {
        return {
            anchor: "",
            icon: "",
            class: "",
            iconNormal: "",
            iconHover: "",
            name: ""
        }
    };
    var Alert = function () {
        return {
            class: "",
            message: "",
        }
    }

    $scope.changeIcon = function (resource, newIcon) {
        resource.icon = newIcon;
    }
    $scope.cd = function (path) {
        var src = $scope.source + path;
        // Elimina los posibles "/" repetidos
        src = src.replace(/[/]{1,}/g, "/");
        // Quita el slash inicial
        src = src.substr(0, 1) == "/" ? src.substr(1) : src;
        $location.path("/!/" + src);
    }
    HttpService.getResources($scope.source).success(function (data) {
        if (!data.error) {
            var directories = data.response.directories;
            var files = data.response.files;
            if (directories.length === 0 && files.length === 0) {
                var al = new Alert();
                al.class = "info";
                al.message = "Directorio vacío";
                $scope.alert = al;

            }
            for (var index = 0; index < directories.length; index++) {
                var res = new Resource();
                res.anchor = directories[index];
                res.name = directories[index].replace("/", "");
                res.icon = "fa fa-folder";
                res.iconNormal = res.icon;
                res.iconHover = "fa fa-folder-open";
                $scope.resources.push(res);
            }
            for (var index = 0; index < files.length; index++) {
                var res = new Resource();
                res.anchor = files[index];
                res.name = files[index].replace("/", "");
                res.icon = "fa fa-file-o";
                res.class = "resource-file";
                res.iconNormal = res.icon;
                res.iconHover = "fa fa-file";
                $scope.resources.push(res);
            }

        } else {
            if ($location.path() !== "/!/") {
                $location.path("/!/");
            } else {
                $scope.error = "Se ha producido un error al obtener el sistema de ficheros. Contacte con el administrador";
            }
        }
    });
    //todo Comprobar la ruta con el servicio web
});
module.controller("LoginController", function ($scope, $location, HttpService) {
    var storage = localStorage;
    storage.clear();
    $scope.error = null;
    $scope.login = function (usr, pwd) {
        // Comprueba si se han completado los campos usuario y contraseña
        if ("undefined" === typeof usr || "" === usr.trim()) {
            $scope.error = "El usuario no puede estar vacío";
        } else if ("undefined" === typeof pwd || "" === pwd.trim()) {
            $scope.error = "La contraseña no puede estar vacía";
        } else {
            HttpService.authenticate(usr, pwd).success(function (data) {
                if (!data.error) {
                    storage.setItem("token", data.response);
                    // Redirige al index
                    $location.path("/!/");
                } else {
                    $scope.error = data.response.message;
                }
            });
        }
    }
});