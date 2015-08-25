/**
 * app.js - app main entry point
 */

var app = angular.module('app', ['ionic'])

.run(['$ionicPlatform', function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if(window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
}])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('/', {
            url: '/',
            templateUrl: 'start.html'
        });

    $urlRouterProvider.otherwise('/');
}]);
