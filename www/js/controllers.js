angular.module('rugbyapp.controllers', ['rugbyapp.filters'])

    .controller('AppController', function ($scope, $ionicPopup, $rootScope, $state, $ionicHistory, MatchFactory, SettingFactory, TeamFactory) {
        $rootScope.page = "new-match";
        $rootScope.back = function () {
            $ionicHistory.goBack();
        };

        $scope.icon = 'new-match-icon';

        var redirectToMTeam = function () {
            $rootScope.page = "my-team";
            $scope.icon = 'my-team-icon';
            var myTeam = SettingFactory.myTeam;
            if (myTeam != 0) {
                var team = TeamFactory.get(myTeam);
                TeamFactory.mapEntity(team);
            }
            else {
                TeamFactory.resetEntity();
            }
            $state.go('app.myteam');
        }

        var redirectToNewMatch = function () {
            $rootScope.page = "new-match";
            $scope.icon = 'new-match-icon';

            MatchFactory.match.teamName1 = '';
            MatchFactory.match.teamName2 = '';
            MatchFactory.resetEntity();
            $state.go('app.newmatch');
        }

        var redirectToTeams = function () {
            TeamFactory.searchTeams = TeamFactory.teams;
            $rootScope.page = "team";
            $scope.icon = 'team-icon';
            $state.go('app.teams');
        }

        var redirectToAbout = function () {
            $rootScope.page = "about";
            $state.go('app.aboutmain');
        }

        var redirectToResults = function () {
            $scope.icon = 'result-icon';
            $rootScope.page = "results";

            MatchFactory.searchMatch = MatchFactory.matches;
            $state.go('app.results');
        }

        var showLeavingConfirmation = function (redirect) {
            var template = 'If you leave the tracking screen you will lose your current score. Are you sure you want to leave?';
            if ($state.current.name == 'app.score')
                template = 'If you leave the Final Score page you will lose your current score. Are you sure you want to leave?';

            if ($state.current.name == 'app.match' || $state.current.name == 'app.score') {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Important',
                    template: template,
                    cancelText: 'No',
                    okText: 'Yes'
                }).then(function (res) {
                    if (res) {
                        redirect();
                    }
                });
            }
            else
                redirect();
        }

        $scope.showMyTeam = function () {
            showLeavingConfirmation(redirectToMTeam);
        };

        $scope.showMatch = function () {
            showLeavingConfirmation(redirectToNewMatch);
        };

        $scope.showTeams = function () {
            showLeavingConfirmation(redirectToTeams);
        };

        $scope.showAboutMain = function () {
            showLeavingConfirmation(redirectToAbout);
        };

        $scope.showScore = function () {

            if ($rootScope.page != 'start-match')
                return;

            MatchFactory.match.teamName1 = MatchFactory.match.teamName1 != '' ? MatchFactory.match.teamName1 : 'TEAM A';
            MatchFactory.match.teamName2 = MatchFactory.match.teamName2 != '' ? MatchFactory.match.teamName2 : 'TEAM B';

            $scope.icon = 'score-icon';
            $rootScope.page = "score";
            $state.go('app.score');
        };

        $scope.showResults = function () {
            showLeavingConfirmation(redirectToResults);
        };
    })

    .controller('MatchController', function ($q, $scope, $rootScope, $state, $filter, $ionicPopup, $ionicHistory, $cordovaSocialSharing, MatchFactory, TeamFactory, SettingFactory) {
        $rootScope.page = $state.current.name == 'app.match' ? 'start-match' : 'new-match';

        //properties
        if ($state.params.resetSearchMatch == undefined || $state.params.resetSearchMatch == true)
            MatchFactory.searchMatch = MatchFactory.matches;

        $scope.matchFactory = MatchFactory;
        $scope.searchTeamName = $state.params.team;

        $scope.data = {
            search: '',
            matchId: MatchFactory.match.matchId,
            team1: MatchFactory.match.team1,
            team2: MatchFactory.match.team2,
            location: MatchFactory.match.location,
            team1Try: MatchFactory.match.team1Try,
            team1Penalty: MatchFactory.match.team1Penalty,
            team1Conversion: MatchFactory.match.team1Conversion,
            team1DropGoal: MatchFactory.match.team1DropGoal,
            team2Try: MatchFactory.match.team2Try,
            team2Penalty: MatchFactory.match.team2Penalty,
            team2Conversion: MatchFactory.match.team2Conversion,
            team2DropGoal: MatchFactory.match.team2DropGoal,
            matchDate: MatchFactory.match.matchDate,
            matchTime: MatchFactory.match.matchTime,
            isMyTeam: MatchFactory.match.isMyTeam,
            teamName1: MatchFactory.match.teamName1,
            teamName2: MatchFactory.match.teamName2,
        };

        $scope.$watch("data.teamName1", function (newValue, oldValue) {
            if (newValue.length > 38) {
                $scope.data.teamName1 = oldValue;
            }
        });

        $scope.$watch("data.teamName2", function (newValue, oldValue) {
            if (newValue.length > 38) {
                $scope.data.teamName2 = oldValue;
            }
        });

        //functions
        var getScopeMatch = function () {
            return {
                matchId: $scope.data.matchId,
                team1: $scope.data.team1,
                team2: $scope.data.team2,
                teamName1: $scope.data.teamName1.trim(),
                teamName2: $scope.data.teamName2.trim(),
                location: $scope.data.location,
                team1Try: $scope.data.team1Try,
                team1Penalty: $scope.data.team1Penalty,
                team1Conversion: $scope.data.team1Conversion,
                team1DropGoal: $scope.data.team1DropGoal,
                team2Try: $scope.data.team2Try,
                team2Penalty: $scope.data.team2Penalty,
                team2Conversion: $scope.data.team2Conversion,
                team2DropGoal: $scope.data.team2DropGoal,
                matchDate: $scope.data.matchDate,
                matchTime: $scope.data.matchTime
            };
        };

        var spliceTeamName = function (teamName) {
            var team1Array = teamName.split(' ');
            var team11stLine = '';
            var team12ndLine = '';
            for (var i = 0; i < team1Array.length; i++) {
                if (team11stLine.length <= 18) {
                    team11stLine = team11stLine + team1Array[i] + ' ';
                }
                else {
                    team12ndLine = team12ndLine + team1Array[i] + ' ';
                }
            }

            return [team11stLine, team12ndLine];
        }

        $scope.showAutoCompleteTeam1 = false;
        $scope.showAutoCompleteTeam2 = false;
        $scope.showAutoCompleteTeamResult = false;

        $scope.hideAutoComplete = function () {
            $scope.showAutoCompleteTeam1 = false;
            $scope.showAutoCompleteTeam2 = false;
            $scope.showAutoCompleteTeamResult = false;
        }

        $scope.selectAutoCompleteTeam = function (team, teamName) {
            if (team == 'team1') {
                $scope.data.teamName1 = teamName;
                $scope.showAutoCompleteTeam1 = false;

                if ($state.current.name == 'app.match') MatchFactory.match.teamName1 = teamName;
            }
            else {
                $scope.data.teamName2 = teamName;
                $scope.showAutoCompleteTeam2 = false;

                if ($state.current.name == 'app.match') MatchFactory.match.teamName2 = teamName;
            }

        };

        $scope.selectAutoCompleteSearchTeam = function (teamName) {
            $scope.data.search = teamName;
            $scope.showAutoCompleteTeamResult = false;
        };


        $scope.searchTeam = function (team, teamName) {

            if (teamName.length > 0) {
                var searchResult = MatchFactory.autoCompleteTeam(teamName);
                MatchFactory.autoCompleteTeamResult = searchResult;

                if (team == 'team1')
                    $scope.showAutoCompleteTeam1 = true;
                else
                    $scope.showAutoCompleteTeam2 = true;
            }
            else {
                MatchFactory.autoCompleteTeamResult = [];
                $scope.hideAutoComplete();
            }
        };

        $scope.searchTeamResult = function (teamId) {

            if ($scope.data.search.length > 0) {
                var searchResult = MatchFactory.autoCompleteTeamSearch(teamId, $scope.data.search);
                MatchFactory.autoCompleteTeamResult = searchResult;
                $scope.showAutoCompleteTeamResult = true;
            }
            else {
                MatchFactory.autoCompleteTeamResult = [];
                $scope.hideAutoComplete();
            }
        };

        $scope.searchMatchResult = function () {

            if ($scope.data.search.length > 0) {
                var searchResult = MatchFactory.autoCompleteResultSearch($scope.data.search);
                MatchFactory.autoCompleteTeamResult = searchResult;
                $scope.showAutoCompleteTeamResult = true;
            }
            else {
                MatchFactory.autoCompleteTeamResult = [];
                $scope.hideAutoComplete();
            }
        };



        $scope.startMatch = function () {


            $rootScope.page = "start-match";

            MatchFactory.resetEntity();

            MatchFactory.match.teamName1 = $scope.data.teamName1 != '' ? $scope.data.teamName1 : 'TEAM A';
            MatchFactory.match.teamName2 = $scope.data.teamName2 != '' ? $scope.data.teamName2 : 'TEAM B';
            MatchFactory.match.location = $scope.data.location;
            MatchFactory.match.isMyTeam = $scope.data.isMyTeam;

            MatchFactory.match.team1Try = $scope.data.team1Try;
            MatchFactory.match.team1Penalty = $scope.data.team1Penalty;
            MatchFactory.match.team1Conversion = $scope.data.team1Conversion;
            MatchFactory.match.team1DropGoal = $scope.data.team1DropGoal;

            MatchFactory.match.team2Try = $scope.data.team2Try;
            MatchFactory.match.team2Penalty = $scope.data.team2Penalty;
            MatchFactory.match.team2Conversion = $scope.data.team2Conversion;
            MatchFactory.match.team2DropGoal = $scope.data.team2DropGoal;
            MatchFactory.match.matchTime = $filter('date')(new Date(), 'HH:mm');
            MatchFactory.match.matchDate = $filter('date')(new Date(), 'MM/dd/yyyy');

            $state.go('app.match');
        };

        $scope.addScoreTry = function (team, point) {
            if (team == 1) {
                if ($scope.data.team1Try + point >= 0) {
                    $scope.data.team1Try += parseInt(point);
                    MatchFactory.match.team1Try = $scope.data.team1Try;
                }
            }
            else {
                if ($scope.data.team2Try + point >= 0) {
                    $scope.data.team2Try += parseInt(point);
                    MatchFactory.match.team2Try = $scope.data.team2Try;
                }
            }
        };

        $scope.addScoreConversion = function (team, point) {
            if (team == 1) {
                if ($scope.data.team1Conversion + point >= 0) {
                    $scope.data.team1Conversion += parseInt(point);
                    MatchFactory.match.team1Conversion = $scope.data.team1Conversion;
                }
            }
            else {
                if ($scope.data.team2Conversion + point >= 0) {
                    $scope.data.team2Conversion += parseInt(point);
                    MatchFactory.match.team2Conversion = $scope.data.team2Conversion;
                }
            }
        };

        $scope.addScorePenalty = function (team, point) {
            if (team == 1) {
                if ($scope.data.team1Penalty + point >= 0) {
                    $scope.data.team1Penalty += parseInt(point);
                    MatchFactory.match.team1Penalty = $scope.data.team1Penalty;
                }
            }
            else {
                if ($scope.data.team2Penalty + point >= 0) {
                    $scope.data.team2Penalty += parseInt(point);
                    MatchFactory.match.team2Penalty = $scope.data.team2Penalty;
                }
            }
        };

        $scope.addScoreDropGoal = function (team, point) {
            if (team == 1) {
                if ($scope.data.team1DropGoal + point >= 0) {
                    $scope.data.team1DropGoal += parseInt(point);
                    MatchFactory.match.team1DropGoal = $scope.data.team1DropGoal;
                }
            }
            else {
                if ($scope.data.team2DropGoal + point >= 0) {
                    $scope.data.team2DropGoal += parseInt(point);
                    MatchFactory.match.team2DropGoal = $scope.data.team2DropGoal;
                }
            }
        };

        $scope.team1Score = function () {
            return $scope.data.team1Try + $scope.data.team1Conversion + $scope.data.team1Penalty + $scope.data.team1DropGoal;
        };

        $scope.team2Score = function () {
            return $scope.data.team2Try + $scope.data.team2Conversion + $scope.data.team2Penalty + $scope.data.team2DropGoal;
        };

        $scope.team1KeyUp = function () {
            MatchFactory.match.teamName1 = $scope.data.teamName1;
        };

        $scope.team2KeyUp = function () {
            MatchFactory.match.teamName2 = $scope.data.teamName2;
        };

        $scope.useMyTeam = function () {
            if ($scope.data.isMyTeam) {
                if (SettingFactory.myTeam == 0) {
                    TeamFactory.resetEntity();
                    TeamFactory.team.teamName = $scope.data.teamName1;
                    $state.go('app.addmyteam');
                }
                else {
                    //display my team
                    var myTeam = TeamFactory.get(SettingFactory.myTeam);
                    $scope.data.teamId = myTeam.teamId;
                    $scope.data.teamName1 = myTeam.teamName;
                }
            }
            else {
                $scope.data.teamId = 0;
                $scope.data.teamName1 = '';
            }
        };

        $scope.saveResult = function () {
            MatchFactory.createMatch(getScopeMatch(), function () {
                $state.go('app.results');
            });
        };

        $scope.editScore = function () {
            MatchFactory.mapEntity(getScopeMatch());
            $state.go('app.editscore');
        };

        $scope.editResult = function () {
            var route = $state.current.name == 'app.teamresultdetail' ? 'app.editteamresult' : 'app.editresult';
            MatchFactory.mapEntity(getScopeMatch());
            $state.go(route);
        };

        $scope.saveScore = function (id) {
            var match = getScopeMatch();

            //validate inputted score
            if ((parseInt(match.team1Try) % 5) > 0) {
                alert('Invalid Try score for ' + match.team1);
                return;
            }
            else if ((parseInt(match.team1Penalty) % 3) > 0) {
                alert('Invalid Penalty score for ' + match.team1);
                return;
            }
            else if ((parseInt(match.team1Conversion) % 2) > 0) {
                alert('Invalid Conversion score for ' + match.team1);
                return;
            }
            else if ((parseInt(match.team1DropGoal) % 3) > 0) {
                alert('Invalid Drop Goal score for ' + match.team1);
                return;
            }
            else if ((parseInt(match.team2Try) % 5) > 0) {
                alert('Invalid Try score for ' + match.team2);
                return;
            }
            else if ((parseInt(match.team2Penalty) % 3) > 0) {
                alert('Invalid Penalty score for ' + match.team2);
                return;
            }
            else if ((parseInt(match.team2Conversion) % 2) > 0) {
                alert('Invalid Conversion score for ' + match.team2);
                return;
            }
            else if ((parseInt(match.team2DropGoal) % 3) > 0) {
                alert('Invalid Drop Goal score for ' + match.team2);
                return;
            }

            if (new Date($scope.data.matchDate) == 'Invalid Date') {
                alert('Invalid Date');
                return;
            }
            if (new Date($scope.data.matchDate + ' ' + $scope.data.matchTime) == 'Invalid Date') {
                alert('Invalid Time');
                return;
            }

            MatchFactory.mapEntity(match);
            if ($state.current.tabGroup == 'score') {
                $rootScope.back();
            }
            else {
                MatchFactory.updateMatch(match, function () {
                    $rootScope.back();
                });
            }
        };

        $scope.matchDetail = function (id) {

            var match = MatchFactory.getMatch(id);
            MatchFactory.mapEntity(match);

            var route = '';
            if ($state.current.tabGroup == 'results')
                route = 'app.resultdetail';
            else if ($state.current.tabGroup == 'teams')
                route = 'app.teamresultdetail';
            else
                route = 'app.myteamresultdetail';

            $state.go(route, { resetSearchMatch: false });
        };

        $scope.deleteScore = function () {
            MatchFactory.resetEntity();
            $rootScope.page = "start-match";
            $state.go('app.match');
        };

        $scope.deleteMatch = function (id) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Confirmation',
                template: 'Are you sure you want to delete this entry?',
                cancelText: 'No',
                okText: 'Yes'
            }).then(function (res) {
                if (res) {
                    MatchFactory.deleteMatch(id, function () {

                        var route = '';
                        if ($state.current.tabGroup == 'results')
                            route = 'app.results';
                        else if ($state.current.tabGroup == 'teams')
                            route = 'app.teamresult';
                        else
                            route = 'app.myteamresult';
                        $state.go(route);
                    });
                }
            });
        };

        var buildImage = function () {
            var deferred = $q.defer();

            var canvas = document.createElement('canvas');
            canvas.width = 612;
            canvas.height = 612;
            var ctx = canvas.getContext('2d');

            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.rect(1, 1, 610, 610);
            ctx.fill();
            ctx.stroke();

            // Header
            ctx.fillStyle = "black";
            ctx.font = "bold 27px Arial";
            ctx.textAlign = "left";
            ctx.fillText('Rugby Score Tracker', 185, 65);

            ctx.font = "18px Arial";
            ctx.textAlign = "left";
            ctx.fillText('Track match scores and share results', 185, 85);
            ctx.fillStyle = "blue";
            ctx.fillText('www.rugbyscoretracker.com', 185, 105);
            ctx.fillStyle = "black";
            ctx.fillText('Download FREE from the app store', 185, 125);

            //Final Scores            
            ctx.font = "30px Arial";
            ctx.textAlign = "right";
            ctx.fillText($scope.team1Score(), 275, 170);
            ctx.textAlign = "center";
            ctx.fillText("-", 305, 170);
            ctx.textAlign = "left";
            ctx.fillText($scope.team2Score(), 335, 170);

            var team1Name = spliceTeamName($scope.data.teamName1);
            var team2Name = spliceTeamName($scope.data.teamName2);

            ctx.font = "bold 18px Arial";
            ctx.textAlign = "right";
            ctx.fillText(team1Name[0], 275, 200);
            ctx.fillText(team1Name[1], 275, 220);

            ctx.textAlign = "center";
            ctx.fillText("V", 305, 200);
            ctx.textAlign = "left";

            ctx.fillText(team2Name[0], 335, 200);
            ctx.fillText(team2Name[1], 335, 220);

            /*Vertical Line*/
            ctx.moveTo(305, 230);
            ctx.lineTo(305, 435);
            ctx.stroke();

            /*Horizontal Line*/
            ctx.moveTo(30, 435);
            ctx.lineTo(580, 435);
            ctx.stroke();

            /*Team 1*/
            ctx.font = "18px Arial";
            ctx.textAlign = "left";
            ctx.fillText('Try', 30, 240);

            ctx.font = "bold 18px Arial";
            ctx.textAlign = "left";
            ctx.fillText($scope.data.team1Try, 30, 260);


            ctx.font = "18px Arial";
            ctx.textAlign = "left";
            ctx.fillText('Conversion', 30, 295);

            ctx.font = "bold 18px Arial";
            ctx.textAlign = "left";
            ctx.fillText($scope.data.team1Conversion, 30, 315);

            ctx.font = "18px Arial";
            ctx.textAlign = "left";
            ctx.fillText('Drop Goal', 30, 350);

            ctx.font = "bold 18px Arial";
            ctx.textAlign = "left";
            ctx.fillText($scope.data.team1DropGoal, 30, 370);

            ctx.font = "18px Arial";
            ctx.textAlign = "left";
            ctx.fillText('Penalty', 30, 405);

            ctx.font = "bold 18px Arial";
            ctx.textAlign = "left";
            ctx.fillText($scope.data.team1Penalty, 30, 425);


            ctx.font = "18px Arial";
            ctx.textAlign = "left";
            ctx.fillText('Match Date', 30, 470);

            ctx.font = "bold 18px Arial";
            ctx.textAlign = "left";
            ctx.fillText($scope.data.matchDate, 30, 490);


            /*Team 2*/
            ctx.font = "18px Arial";
            ctx.textAlign = "left";
            ctx.fillText('Try', 335, 240);

            ctx.font = "bold 18px Arial";
            ctx.textAlign = "left";
            ctx.fillText($scope.data.team2Try, 335, 260);


            ctx.font = "18px Arial";
            ctx.textAlign = "left";
            ctx.fillText('Conversion', 335, 295);

            ctx.font = "bold 18px Arial";
            ctx.textAlign = "left";
            ctx.fillText($scope.data.team2Conversion, 335, 315);

            ctx.font = "18px Arial";
            ctx.textAlign = "left";
            ctx.fillText('Drop Goal', 335, 350);

            ctx.font = "bold 18px Arial";
            ctx.textAlign = "left";
            ctx.fillText($scope.data.team2DropGoal, 335, 370);

            ctx.font = "18px Arial";
            ctx.textAlign = "left";
            ctx.fillText('Penalty', 335, 405);

            ctx.font = "bold 18px Arial";
            ctx.textAlign = "left";
            ctx.fillText($scope.data.team2Penalty, 335, 425);

            ctx.font = "18px Arial";
            ctx.textAlign = "left";
            ctx.fillText('Match Time', 335, 470);

            ctx.font = "bold 18px Arial";
            ctx.textAlign = "left";
            ctx.fillText($scope.data.matchTime, 335, 490);


            //Bottom
            ctx.font = "18px Arial";
            ctx.textAlign = "left";
            ctx.fillText('Match Location', 30, 525);

            ctx.font = "bold 18px Arial";
            ctx.textAlign = "left";
            ctx.fillText($scope.data.location, 30, 545);

            var img = new Image();
            img.onload = function () {
                ctx.drawImage(img, 35, 15, 125, 125);
                deferred.resolve(canvas);
            };

            img.src = 'img/share.png';
            return deferred.promise;
        };


        $scope.shareResult = function () {
            buildImage().then(function (canvas) {

                var team1Wins = parseInt($scope.team1Score()) > parseInt($scope.team2Score());
                var message = team1Wins ? $scope.data.teamName1 + ' beats ' + $scope.data.teamName2 : $scope.data.teamName2 + ' beats ' + $scope.data.teamName1;

                if (parseInt($scope.team1Score()) == parseInt($scope.team2Score()))
                    message = 'A draw between ' + $scope.data.teamName1 + ' vs ' + $scope.data.teamName2;

                message += ' with a score of ' + (team1Wins ? $scope.team1Score() + ' - ' + $scope.team2Score() : $scope.team2Score() + ' - ' + $scope.team1Score());
                return $cordovaSocialSharing.share(message, 'RugbyScoreTracker', canvas.toDataURL('image/jpeg', 1), 'www.rugbyscoretracker.com');
            })
        }

        $scope.teamSearch = function (teamId) {
            $ionicPopup.show({
                templateUrl: 'popup-template.html',
                title: 'Enter team name to search',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Search</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if ($scope.data.search.length > 0) {
                                var searchResult = MatchFactory.teamSearchResult(teamId, $scope.data.search);
                                MatchFactory.searchMatch = searchResult;
                            }
                        }
                    }
                ]
            });
        }

        $scope.search = function () {
            $ionicPopup.show({
                templateUrl: 'popup-template.html',
                title: 'Enter team name to search',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Search</b>',
                        type: 'button-positive',
                        onTap: function (e) {

                            if ($scope.data.search.length > 0) {
                                var searchResult = MatchFactory.getTeamMatchesByName($scope.data.search);
                                MatchFactory.searchMatch = searchResult;
                            }
                            else
                                MatchFactory.searchMatch = MatchFactory.matches;
                        }
                    }
                ]
            });
        };
    })


    //Team Controller
    .controller('TeamController', function ($scope, $state, $ionicPopup, $cordovaAppAvailability, TeamFactory, MatchFactory, SettingFactory) {

        //Binding functions
        $scope.lastMatch = function () {
            if ($scope.data != undefined) {
                var lastMatch = MatchFactory.getLastMatch($scope.data.teamId);
                if (lastMatch != null) {
                    return lastMatch;
                }
            }
        }
        

        TeamFactory.searchTeams = TeamFactory.teams;
        $scope.isMyTeam = $state.params.isMyTeam;

        $scope.teamFactory = TeamFactory;
        $scope.data = {
            search: '',
            fullClubName: TeamFactory.team.fullClubName,
            teamId: TeamFactory.team.teamId,
            teamName: TeamFactory.team.teamName,
            clubAddress: TeamFactory.team.clubAddress,
            townCity: TeamFactory.team.townCity,
            country: TeamFactory.team.country,
            postCode: TeamFactory.team.postCode,
        };

        $scope.$watch("data.teamName", function (newValue, oldValue) {
            if (newValue.length > 38) {
                $scope.data.teamName = oldValue;
            }
        });

        $scope.teamLastMatch = $scope.lastMatch();

        $scope.teamResultText = $state.current.tabGroup == 'myteam' ? 'My Team Results' : 'Team Results';
        $scope.myTeamId = SettingFactory.myTeam;
        $scope.showSearch = false;

        //redirects to add new team page
        $scope.addNewTeam = function () {
            TeamFactory.resetEntity();
            $state.go('app.addteam');
        };

        $scope.searchTeam = function () {
            $ionicPopup.show({
                templateUrl: 'popup-template.html',
                title: 'Enter team name to search',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Search</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if ($scope.data.search.length > 0) {
                                var searchResult = TeamFactory.search($scope.data.search);
                                TeamFactory.searchTeams = searchResult;
                            }
                            else
                                TeamFactory.searchTeams = TeamFactory.teams;
                        }
                    }
                ]
            });
        }

        $scope.openGoogleMaps = function (location) {
            var url;
            var device = SettingFactory.device;
            var isWebView = device.isWebView();
            var isIPad = device.isIPad();
            var isIOS = device.isIOS();
            var isAndroid = device.isAndroid();
            var isWindowsPhone = device.isWindowsPhone();

            if (isIPad || isIOS) {
                url = SettingFactory.appdata.url.iOs;
            }
            else if (isAndroid) {
                url = SettingFactory.appdata.url.android;
            }

            window.open(url + location, '_system', 'location=yes');

            // document.addEventListener("deviceready", function () {

            //     var scheme;
            //     var url;
            //     if (device.platform === SettingFactory.appdata.platform.iOs) {
            //         scheme = SettingFactory.appdata.scheme.iOs;
            //         url = SettingFactory.appdata.url.iOs;
            //     }
            //     else if (device.platform === SettingFactory.appdata.platform.android) {
            //         scheme = SettingFactory.appdata.scheme.android;
            //         url = SettingFactory.appdata.url.android;
            //     }

            //     $cordovaAppAvailability.check(scheme)
            //         .then(function () {
            //             try {
            //                 window.open(url + location, '_system', 'location=yes');
            //             }
            //             catch (ex) {
            //                 alert(ex);
            //             }
            //         }, function () {
            //             window.open(SettingFactory.appdata.webUrl.url);
            //         });
            // }, false);
        };

        $scope.editTeam = function (id) {

            var isMyTeam = $state.current.tabGroup == 'myteam';
            if (isMyTeam && SettingFactory.myTeam == 0) {
                $state.go('app.addmyteam');
            }

            var team = TeamFactory.get(isMyTeam ? SettingFactory.myTeam : id);
            if (team != null) {
                TeamFactory.mapEntity(team);
            }

            var route = isMyTeam ? 'app.editmyteam' : 'app.editteam';
            $state.go(route);
        }

        $scope.teamResult = function (team) {
            var route = $state.current.tabGroup == 'myteam' ? 'app.myteamresult' : 'app.teamresult';
            var searchResult = MatchFactory.getTeamMatches(team);
            MatchFactory.searchMatch = searchResult;

            $state.go(route, { team: team, resetSearchMatch: false });
        };

        $scope.teamDetail = function (id) {
            var route = $state.current.tabGroup == 'teams' ? 'app.team' : 'app.myteam';
            var team = TeamFactory.get(id);
            TeamFactory.mapEntity(team);

            $state.go(route);
        }

        $scope.deleteTeam = function (id) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Confirmation',
                template: 'Are you sure you want to delete this entry?',
                cancelText: 'No',
                okText: 'Yes'
            }).then(function (res) {
                if (res) {
                    var isMyTeam = id == SettingFactory.myTeam;
                    TeamFactory.deleteTeam(id, function () {


                        var route = $state.current.tabGroup == 'myteam' ? 'app.myteam' : 'app.teams';
                        if (isMyTeam) {

                            SettingFactory.updateMyTeam(0, function () {
                                TeamFactory.resetEntity();
                                SettingFactory.myTeam = 0;
                                $state.go(route);
                            });

                            return;
                        }

                        $state.go(route);

                    });
                }
            });
        };

        $scope.selectAutoCompleteTeam = function (teamName) {
            $scope.data.search = teamName;
            $scope.showSearch = false;
        };

        $scope.searchTeamAutoComplete = function () {

            if ($scope.data.search.length > 0) {
                TeamFactory.autoCompleteTeam = TeamFactory.searchTeamIncludingAbbr($scope.data.search);
                $scope.showSearch = true;
            }
            else {
                TeamFactory.autoCompleteTeam = [];
                $scope.showSearch = false;
            }
        };

        $scope.saveTeam = function () {
            var isMyTeam = $state.current.tabGroup == 'myteam';
            var team = {
                teamId: $scope.data.teamId,
                isMyTeam: isMyTeam,
                fullClubName: $scope.data.fullClubName,
                teamName: $scope.data.teamName,
                clubAddress: $scope.data.clubAddress,
                townCity: $scope.data.townCity,
                country: $scope.data.country,
                postCode: $scope.data.postCode
            };

            var isEdit = $state.current.name == 'app.editmyteam' || $state.current.name == 'app.editteam';
            if (isMyTeam && SettingFactory.myTeam == 0) isEdit = false;

            TeamFactory.saveTeam(team, isEdit, function (oldTeamName, updateMatchTeams) {
                if (isMyTeam) {
                    var myTeam = TeamFactory.get(SettingFactory.myTeam);
                    TeamFactory.mapEntity(team);
                    $state.go('app.myteam');
                }
                else {
                    $state.go('app.teams');
                }

                if (updateMatchTeams) {
                    MatchFactory.updateTeamNames(oldTeamName, $scope.data.teamName);
                }
            });
        };
    });
