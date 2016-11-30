// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('rugbyapp', ['ionic', 'rugbyapp.controllers', 'rugbyapp.factories', 'rugbyapp.routes', 'rugbyapp.data', 'rugbyapp.data', 'ngCordova'])

  .run(function ($ionicPlatform, $cordovaSQLite, $filter, DataFactory, SettingFactory, MatchFactory, TeamFactory) {

    setTimeout(function () {
      navigator.splashscreen.hide();
    }, 3000);


    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
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

      SettingFactory.device = device.platform;
      DataFactory.initialize();

      //load data
      DataFactory.team.loadTeams(function (rs) {
        for (var i = 0; i < rs.rows.length; i++) {
          TeamFactory.teams.push(rs.rows.item(i));
        }
      });

      DataFactory.setting.loadSetting(function (rs) {
        if (rs.rows.length > 0) {
          SettingFactory.myTeam = rs.rows.item(0).teamId
        }
      });

      DataFactory.match.loadMatches(function (rs) {
        if (rs.rows.length > 0) {
          for (var i = 0; i < rs.rows.length; i++) {
            var match = rs.rows.item(i);
            match.matchDateTime = new Date(match.matchDate + ' ' + match.matchTime);
            MatchFactory.matches.push(match);
          }
        }
      });

      MatchFactory.match.matchTime = $filter('date')(new Date(), 'HH:mm');
      MatchFactory.match.matchDate = $filter('date')(new Date(), 'MM/dd/yyyy');

     

    });

  });

app.directive('selectOnClick', ['$window', function ($window) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.on('click', function () {
        if (!$window.getSelection().toString()) {
          // Required for mobile Safari
          this.setSelectionRange(0, this.value.length)
        }
      });
    }
  };
}]);

app.directive('ngHideOnEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if (event.which === 13) {
        scope.$apply(function () {
          scope.$eval(attrs.ngEnter);
        });

        cordova.plugins.Keyboard.close();
        event.preventDefault();
      }
    });
  };
});

app.config(function ($ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
});

