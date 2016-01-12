/**
 * app.js - app main entry point
 */

var app = angular.module('app', ['ionic', 'settings'])

.run(['$ionicPlatform', function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if(window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
        if(window.navigator && window.navigator.splashscreen) {
            window.navigator.splashscreen.hide();
        }
    });
}])

.config([
    '$stateProvider',
    '$urlRouterProvider',
    'id',
    'product_name',
    'version',
    function($stateProvider, $urlRouterProvider, id, product_name, version) {
        $stateProvider
            .state('/', {
                url: '/',
                templateUrl: 'start.html',
                controller: ['$scope', function ($scope) {
                    $scope.name = product_name;
                    $scope.id = id;
                    $scope.version = version;
                }]
            });

        $urlRouterProvider.otherwise('/');
}]);
