angular.module('rugbyapp.routes', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html'
            })

            //about
            .state('app.aboutmain', {
                url: '/aboutmain',
                tabGroup: 'about',
                views: {
                    'match': {
                        templateUrl: 'templates/about/main.html'
                    }
                }
            })

            .state('app.about', {
                url: '/about',
                tabGroup: 'about',
                views: {
                    'match': {
                        templateUrl: 'templates/about/about.html'
                    }
                }
            })

            .state('app.scoring', {
                url: '/scoring',
                tabGroup: 'about',
                views: {
                    'match': {
                        templateUrl: 'templates/about/scoring.html'
                    }
                }
            })

            .state('app.using', {
                url: '/using',
                tabGroup: 'about',
                views: {
                    'match': {
                        templateUrl: 'templates/about/using.html'
                    }
                }
            })


            //match
            .state('app.match', {
                url: '/match',
                tabGroup: 'match',
                cache: false,
                views: {
                    'match': {
                        templateUrl: 'templates/match/match.html',
                        controller: 'MatchController'
                    }
                }
            })

        $urlRouterProvider.otherwise('/app/match');
    });