var module = angular.module("FsmApp.services", []);
module.service("HttpService", function ($http, $q) {
    var host = "http://localhost/";
    var endPoints = {
        authenticate: host + "authenticate/",
        files: host + "files/",
        fileInfo: host + "info/",
        uploadSource: host + "upload/",
        createNewFolder: host + "folder/add/",
        changePassword: host + "changePassword/",
        getUsers: host + "users/",
        addUser: host + "/users/add/",
        deleteUser: host + "/users/delete/",
        deleteFile: host + "delete/",
    };
    var getToken = function () {
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
        },
        getFileInfo: function (path) {
            return $http({
                method: "post",
                url: endPoints.fileInfo + path,
                data: {
                    token: getToken()
                }
            });
        },
        createNewFolder: function (folderName, path) {
            return $http({
                method: "post",
                url: endPoints.createNewFolder,
                data: {
                    token: getToken(),
                    folder: folderName,
                    path: path
                }
            });
        },
        changeUserPassword: function (newPassword) {
            return $http({
                method: "post",
                url: endPoints.changePassword,
                data: {
                    token: getToken(),
                    password: newPassword,
                }
            });
        },
        getUsers: function () {
            return $http({
                method: "post",
                url: endPoints.getUsers,
                data: {
                    token: getToken()
                }
            });
        },
        createNewUser: function (user, password) {
            return $http({
                method: "post",
                url: endPoints.addUser,
                data: {
                    token: getToken(),
                    user: user,
                    password: password
                }
            });
        },
        deleteUser: function (user) {
            return $http({
                method: "post",
                url: endPoints.deleteUser,
                data: {
                    token: getToken(),
                    user: user,
                }
            });
        },
        deleteFile: function (file) {
            return $http({
                method: "post",
                url: endPoints.deleteFile + file,
                data: {
                    token: getToken(),
                }
            });
        },
        uploadFileSource: endPoints.uploadSource
    }
});