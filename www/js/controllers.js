angular.module('rugbyapp.controllers', ['rugbyapp.factories'])

    .controller('MatchController', function ($scope, $rootScope, $state, $ionicPopup, MatchFactory) {
        $rootScope.page = "start-match";
        $scope.factory = MatchFactory;

        var showPopUp = function (tab) {
            $ionicPopup.show({
                templateUrl: 'popup-template.html',
                title: tab + ' function available on Pro version only.<br/>Purchase Pro version',
                scope: $scope,
                buttons: [
                    { text: 'No' },
                    {
                        text: '<b>Yes</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            var src = 'market://details?id=ph.com.digify.smphi'//'https://play.google.com/store/apps/details?id=ph.com.digify.smphi';
                            window.open(src, '_system', null);
                        }
                    }
                ]
            });
        }


        $scope.showMyTeam = function () {
            //$rootScope.page = "my-team";
            showPopUp('My Team');
            //$state.go('app.using');
        };

        $scope.openMarket = function () {
            var src = 'market://details?id=ph.com.digify.smphi'//'https://play.google.com/store/apps/details?id=ph.com.digify.smphi';
            window.open(src, '_system', null);
        }

        $scope.showMatch = function () {
            //$rootScope.page = "start-match";

            if ($state.current.tabGroup == 'about') {
                $state.go('app.match');
                return;
            }
            var confirmPopup = $ionicPopup.confirm({
                title: 'New Match',
                template: 'Selecting ‘New Match’ will delete any current score entered',
                cancelText: 'Back',
                okText: 'Proceed'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    MatchFactory.teamName1 = '';
                    MatchFactory.teamName2 = '';
                    MatchFactory.team1Try = 0;
                    MatchFactory.team1Penalty = 0;
                    MatchFactory.team1Conversion = 0;
                    MatchFactory.team1DropGoal = 0;
                    MatchFactory.team2Try = 0;
                    MatchFactory.team2Penalty = 0;
                    MatchFactory.team2Conversion = 0;
                    MatchFactory.team2DropGoal = 0;
                }
            });

        };

        $scope.showTeams = function () {
            //$rootScope.page = "team";
            showPopUp('Teams');
            //$state.go('app.using');
        };

        $scope.showAboutMain = function () {
            //$rootScope.page = "about";
            $state.go('app.aboutmain');
        };

        $scope.showScore = function () {
            showPopUp('Save');
            //$state.go('app.using');
        };

        $scope.showResults = function () {
            showPopUp('Results');
            //$state.go('app.using');
        };

        $scope.addScoreTry = function (team, point) {
            if (team == 1) {
                if (MatchFactory.team1Try + point >= 0) {
                    MatchFactory.team1Try += parseInt(point);
                }
            }
            else {
                if (MatchFactory.team2Try + point >= 0) {
                    MatchFactory.team2Try += parseInt(point);
                }
            }
        };

        $scope.addScoreConversion = function (team, point) {
            if (team == 1) {
                if (MatchFactory.team1Conversion + point >= 0) {
                    MatchFactory.team1Conversion += parseInt(point);
                }
            }
            else {
                if (MatchFactory.team2Conversion + point >= 0) {
                    MatchFactory.team2Conversion += parseInt(point);
                }
            }
        };

        $scope.addScorePenalty = function (team, point) {
            if (team == 1) {
                if (MatchFactory.team1Penalty + point >= 0) {
                    MatchFactory.team1Penalty += parseInt(point);
                }
            }
            else {
                if (MatchFactory.team2Penalty + point >= 0) {
                    MatchFactory.team2Penalty += parseInt(point);
                }
            }
        };

        $scope.addScoreDropGoal = function (team, point) {
            if (team == 1) {
                if (MatchFactory.team1DropGoal + point >= 0) {
                    MatchFactory.team1DropGoal += parseInt(point);
                }
            }
            else {
                if (MatchFactory.team2DropGoal + point >= 0) {
                    MatchFactory.team2DropGoal += parseInt(point);
                }
            }
        };

        $scope.team1Score = function () {
            return MatchFactory.team1Try + MatchFactory.team1Conversion + MatchFactory.team1Penalty + MatchFactory.team1DropGoal;
        };

        $scope.team2Score = function () {
            return MatchFactory.team2Try + MatchFactory.team2Conversion + MatchFactory.team2Penalty + MatchFactory.team2DropGoal;
        };
    });
