var directives = angular.module('IssueTrackerApp.directives', []);
directives.directive('appVersion', [
    'version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }]);
directives.directive('log', function () {

    return {
        controller: function ($scope, $element, $attrs, $transclude) {
            console.log($attrs.log + ' (controller)');
        },
        compile: function compile(tElement, tAttributes) {
            console.log(tAttributes.log + ' (compile)');
            return {
                pre: function preLink(scope, element, attributes) {
                    console.log(attributes.log + ' (pre-link)');
                },
                post: function postLink(scope, element, attributes) {
                    console.log(attributes.log + ' (post-link)');
                }
            };
        }
    };

});