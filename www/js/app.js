// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('rugbyapp', ['ionic','ngCordova', 'rugbyapp.controllers', 'rugbyapp.factories', 'rugbyapp.routes'])



  .run(function ($ionicPlatform, $cordovaSQLite) {

    if (!ionic.Platform.is('browser')) {
      setTimeout(function () {
        navigator.splashscreen.hide();
      }, 3000);
    }

    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }

      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

    });
  });

app.config(function ($ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
});

app.directive('ngHideOnEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                        scope.$apply(function(){
                                scope.$eval(attrs.ngEnter);
                        });
                        
                        cordova.plugins.Keyboard.close();
                        event.preventDefault();
                }
            });
        };
});
