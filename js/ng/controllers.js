var module = angular.module("FsmApp.controllers", []);

module.controller("MainController", function ($scope, $location, $routeParams, HttpService) {
    $scope.$on("loadFiles", function (event, args) {
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
                            this.iconNormal = "fa fa-file-video-o";
                            this.iconHover = "fa fa-file-video-o";
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
                    $('#modalFileInfo').modal("show");
                } else {
                    $scope.alert.class = "danger";
                    $scope.alert.message = data.response.message;
                }
            })

        }
        HttpService.getResources($scope.source).success(function (data) {
            $scope.resources = [];
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
    });
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
module.controller("NavController", function ($scope, $location, HttpService, FileUploader) {
    $scope.changeViewMode = function (mode) {
        localStorage.setItem("viewMode", mode);
        window.location.reload();
    }

    $scope.showNewFolderModal = function () {
        $('#modalNewFolder').modal('show');
    }
    $scope.showUsersModal = function () {
        $('#modalUsers').modal('show');
    }
    $scope.usersCanBeShown = function () {
        var usr = localStorage.getItem("user");
        return (usr === "root");
    }
});
module.controller("FileUploadController", function ($scope, FileUploader, $routeParams) {
    var uploader = new FileUploader({
        url: "http://webfms-ws.dev/upload/",
    });
// FILTERS
    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 100;
        }
    });
    // CALLBACKS
    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function (fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function (addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function (item) {
        item.formData.push({
            path: $routeParams.path
        });
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function (fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function (progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
        $scope.$emit("loadFiles");
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function (a, b, c, d) {

        console.info('onCompleteAll');
    };
    $scope.uploader = uploader;
})
module.controller("FsController", function ($scope, $location, HttpService, $routeParams) {
    $scope.$emit("loadFiles");
    $scope.showModal = function () {
        $('#modalNewFolder').modal('show');
    }
    $scope.deleteFile = function (file) {

        var path = $scope.source;
        if ("undefined" !== typeof file) {
            path += "/" + file;
        }
        HttpService.deleteFile(path).success(function (data) {
            if (!data.error) {
                $('#modalFileInfo').modal('hide');
                $scope.$emit("loadFiles");
            } else {
                $scope.error = data.response;
            }
        });
    }
    $scope.errorCreatingFolder = false;
    $scope.createNewFolder = function () {

        HttpService.createNewFolder($('#newFolderName').val(), $scope.source).success(function (data) {
            if (!data.error) {
                $('#modalNewFolder').modal('hide');
                $scope.$emit("loadFiles");
            } else {
                $scope.errorCreatingFolder = data.response;
            }
        });
    }
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
                    storage.setItem("user", usr);
                    // Redirige al index
                    $location.path("/!/");
                } else {
                    $scope.error = data.response.message;
                }
            });
        }
    }
});
module.controller("ChangePasswordController", function ($scope, $location, HttpService) {
    var storage = localStorage;
    $scope.user = localStorage.getItem("user");
    $scope.pwdError = false;
    $scope.changePassword = function () {
        var pwd = $('#chpwd').val();
        var repPwd = $('#repChpwd').val();
        if (pwd === repPwd) {
            HttpService.changeUserPassword(pwd).success(function (data) {
                if (!data.error) {
                    $location.path("/login/");
                } else {
                    $scope.pwdError = data.response;
                }
            });
        } else {
            $scope.pwdError = "Las contaseñas no coinciden";
        }
    }
});
module.controller("UsersController", function ($scope, $location, HttpService) {
    $scope.errorCreatingUser = false;
    $scope.showUserModal = function () {
        $('#modalNewUser').modal('show');
    }
    $scope.createNewUser = function () {
        var usr = $('#userAddName').val();
        var pwd = $('#userAddPassword').val();
        HttpService.createNewUser(usr, pwd).success(function (data) {
            if (!data.error) {
                window.location.reload();
            } else {
                $scope.errorCreatingUser = data.response;
            }
        });
    }
    $scope.deleteUser = function (user) {
        HttpService.deleteUser(user).success(function (data) {
            if (!data.error) {
                window.location.reload();
            } else {
                $scope.error = data.response;
            }
        });
    }
    $scope.users = [];
    HttpService.getUsers().success(function (data) {
        if (!data.error) {
            var users = data.response;
            for (var index = 0; index < users.length; index++) {
                $scope.users[index] = users[index];
            }
        } else {
            $scope.error = data.response;
        }
    });
});
