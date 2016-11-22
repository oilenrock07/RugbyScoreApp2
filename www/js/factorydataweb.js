angular.module('rugbyapp.data', [])
    .factory('DataFactory', function () {


        var selectCallBack = function (array, callBack) {
            var rsFunction = function (index) {
                return array[index];
            }

            var rs = {
                rows: {
                    item: rsFunction,
                    length: array.length
                }
            };

            if (typeof(callBack)== 'function')
                return callBack(rs);
        }

        var loadTeams = function (callBack) {
            var teams = [{
                teamId: 1,
                fullClubName: 'Chicago Bulls',
                townCity: 'Chicago',
                teamName: 'cb'
            },
            {
                teamId: 2,
                fullClubName: 'XYZ Team',
                townCity: 'Planet X',
                teamName: 'xxx'
            },
            {
                teamId:3,
                fullClubName: 'ABCD1234',
                townCity: 'Baras',
                teamName: 'a1'
            },
            {
                teamId: 4,
                fullClubName: 'Chicago Balls',
                teamName: 'bl',
                townCity: 'Balls'
            }];

            return selectCallBack(teams, callBack);
        }

        var createTeam = function () {

        }

        var saveMyTeam = function () {

        }

        var updateTeam = function () {

        }

        var loadSetting = function (callBack) {
            var settings = [{
                teamId: 1
            }];

            return selectCallBack(settings, callBack);
        }
        var deleteTeam = function() {

        }

        var deleteMatch = function(id, callBack) {
            callBack();
        }

        var createMatch = function() {

        }

        var updateMatch = function() {

        }

        var loadMatches = function(callBack) {
            var matches = [{
                matchId: 1,
                team1: 'Chicago Bulls',
                team2: 'Test',
                team1Try: 5,
                team1DropGoal: 3,
                team1Penalty: 3,
                team1Conversion: 2,
                team2Try: 5,
                team2DropGoal: 3,
                team2Penalty: 3,
                team2Conversion: 2,
                matchDate: '09/20/2010',
                matchTime: '13:00',
            },
            {
                matchId:2,
                team1: 'XYZ Team',
                team2: 'Chicago Bulls',
                team1Try: 0,
                team1DropGoal: 3,
                team1Penalty: 3,
                team1Conversion: 2,
                team2Try: 5,
                team2DropGoal: 3,
                team2Penalty: 3,
                team2Conversion: 2,
                matchDate: '09/20/2010',
                matchTime: '08:00',
            },
            {
                matchId:3,
                team1: 'Test Team',
                team2: 'XYZ Team',
                team1Try: 0,
                team1DropGoal: 3,
                team1Penalty: 3,
                team1Conversion: 2,
                team2Try: 5,
                team2DropGoal: 3,
                team2Penalty: 3,
                team2Conversion: 2,
                matchDate: '09/20/2010',
                matchTime: '10:00',
            },
            {
                matchId:4,
                team1: 'Test Team',
                team2: 'Rugby',
                team1Try: 0,
                team1DropGoal: 3,
                team1Penalty: 3,
                team1Conversion: 2,
                team2Try: 5,
                team2DropGoal: 3,
                team2Penalty: 3,
                team2Conversion: 2,
                matchDate: '09/20/2010',
                matchTime: '10:00',
            },
            {
                matchId:5,
                team1: 'Test Team',
                team2: 'New Tram',
                team1Try: 0,
                team1DropGoal: 3,
                team1Penalty: 3,
                team1Conversion: 2,
                team2Try: 5,
                team2DropGoal: 3,
                team2Penalty: 3,
                team2Conversion: 2,
                matchDate: '09/20/2010',
                matchTime: '10:00',
            }
            ];

            return selectCallBack(matches, callBack);
        }

        return {
            database: null,
            initialize: function () { },
            team: {
                loadTeams: loadTeams,
                createTeam: createTeam,
                updateTeam: updateTeam,
                deleteTeam: deleteTeam 
            },
            setting: {
                saveMyTeam: saveMyTeam,
                loadSetting: loadSetting
            },
            match: {
                loadMatches: loadMatches,
                updateMatch: updateMatch,
                createMatch: createMatch,
                deleteMatch: deleteMatch
            }
        };
    })