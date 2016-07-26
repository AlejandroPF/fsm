var module = angular.module("FsmApp.controllers", []);

module.controller("MainController", function ($scope, $location, HttpService) {
    $scope.viewMode = localStorage.getItem("viewMode") || "icon";
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
module.controller("NavController", function ($scope,$location) {
    console.log("NAVCOTROLLER");    
    $scope.changeViewMode = function (mode) {
        localStorage.setItem("viewMode",mode);
        window.location.reload();
    }
});
module.controller("FsController", function ($scope, $location, HttpService, $routeParams) {
    console.log($scope.viewMode);
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
    $scope.downloadFile = function (url) {
        console.log(url);
        if ("undefined" !== typeof url) {
            window.open(url);
        }
    }
    var Resource = function () {
        return {
            anchor: "",
            icon: "",
            class: "",
            iconNormal: "",
            iconHover: "",
            name: "",
            isFile: false,
            click: function () {
                // Click event
            },
            parseFileType: function () {
                var split = this.name.split(".");
                switch (split[split.length - 1]) {
                    /**
                     * ZIP/PACKAGE FILES
                     */
                    case "zip":
                    case "rar":
                    case "7z":
                    case "tar":
                    case "gz":
                        this.iconNormal = "fa fa-file-archive-o";
                        this.iconHover = "fa fa-file-archive-o";
                        break;
                        /**
                         * VIDEO FILES
                         */
                    case "mp4":
                        this.iconNormal = "fa fa-video-o";
                        this.iconHover = "fa fa-video-o";
                        break;
                        /**
                         * AUDIO FILES
                         */
                    case "mp3":
                    case "wav":
                    case "wma":
                        this.iconNormal = "fa fa-audio-o";
                        this.iconHover = "fa fa-audio-o";
                        break;
                        /**
                         * MS WORD FILES
                         */
                    case "doc":
                    case "docx":
                        this.iconNormal = "fa fa-file-word-o";
                        this.iconHover = "fa fa-file-word-o";
                        break;
                        /**
                         * MS EXCEL FILES
                         */
                    case "xls":
                    case "xlsx":
                        this.iconNormal = "fa fa-file-excel-o";
                        this.iconHover = "fa fa-file-excel-o";
                        break;
                        /**
                         * TEXT FILES
                         */
                    case "md":
                    case "txt":
                    case "csv":
                        this.iconNormal = "fa fa-file-text-o";
                        this.iconHover = "fa fa-file-text";
                        break;
                        /*
                         * SOURCE FILES
                         */
                    case "php":
                    case "html":
                    case "js":
                    case "css":
                    case "scss":
                    case "bat":
                    case "cmd":
                    case "sh":
                    case "bash":
                        this.iconNormal = "fa fa-file-code-o";
                        this.iconHover = "fa fa-file-code-o";
                        break;
                        /**
                         * PDF FILE
                         */
                    case "pdf":
                        this.iconNormal = "fa fa-file-pdf-o";
                        this.iconHover = "fa fa-file-pdf-o";
                        break;
                        /**
                         * IMAGE FILE
                         */
                    case "img":
                    case "png":
                    case "jpeg":
                    case "jpg":
                    case "gif":
                    case "svg":
                    case "ico":
                        this.iconNormal = "fa fa-file-image-o";
                        this.iconHover = "fa fa-file-image-o";
                        break;
                        /**
                         * DATABASE FILES
                         */
                    case "mdb":
                    case "db":
                    default:
                        this.iconNormal = "fa fa-file-o";
                        this.iconHover = "fa fa-file";
                        break;
                }

                this.icon = this.iconNormal;
            }
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
        src = src.substr(0, 1) === "/" ? src.substr(1) : src;
        $location.path("/!/" + src);
    }
    $scope.modal = {
        title: "",
        element: null
    }
    $scope.openFileInfo = function (source, name) {
        $scope.modal.title = name;
        HttpService.getFileInfo($scope.source + "/" + name).success(function (data) {
            if (!data.error) {
                $scope.modal.element = data.response;
                $('.modal').modal("show");
                console.log(data);
            } else {
                console.log(data);
                $scope.alert.class = "danger";
                $scope.alert.message = data.response.message;
            }
        })

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
                res.click = function () {
                    $scope.cd(this.anchor);
                }
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
                res.isFile = true;
                res.click = function () {
                    $scope.openFileInfo(this.anchor, this.name);
                }
                res.parseFileType();
                $scope.resources.push(res);
            }

        } else {
            if ($location.path() !== "/!/") {
                $location.path("/!/");
            } else {
                $scope.error = "Se ha producido un error al obtener el sistema de ficheros. Contacte con el administrador";
            }
        }
    }).error(function (data) {
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