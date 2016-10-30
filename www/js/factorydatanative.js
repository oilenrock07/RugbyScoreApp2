angular.module('rugbyapp.data', ['ngCordova'])
    .factory('DataFactory', function ($cordovaSQLite) {
        database = null;

        var createTables = function () {
            $cordovaSQLite.execute(database, "CREATE TABLE IF NOT EXISTS team (teamId integer primary key, abbrTeamName text, fullTeamName text, clubAddress text, townCity text, country text, postCode text)");
            $cordovaSQLite.execute(database, "CREATE TABLE IF NOT EXISTS match (matchId integer primary key, team1 integer, team2 integer, matchDate text, matchTime text, location text, team1Try integer, team1Penalty integer, team1Conversion integer, team1DropGoal integer, team2Try integer, team2Penalty integer, team2Conversion integer, team2DropGoal integer)");
            $cordovaSQLite.execute(database, "CREATE TABLE IF NOT EXISTS settings (settingsId integer primary key, teamId integer)");
        };

        var initialize = function () {
            try {
                database = $cordovaSQLite.openDB({ name: "rugbyapp.db", location: 'default' });
                createTables();
            }
            catch (ex) {
                alert(ex);
            }
        }

        var insert = function (query, params, callBack) {
            $cordovaSQLite.execute(database, query, params).then(function (res) {
                callBack(res.insertId);
            }, function (err) {
                alert(err);
            });
        }

        var executeQuery = function (query, params, callBack) {
            try {
                database.executeSql(query, params, function (rs) {
                    callBack(rs);
                }, function (error) {
                    alert(error);
                });
            }
            catch (ex) {
                alert(ex);
            }
        }

        //MATCH******************************************************************
        var loadMatches = function (callBack) {
            executeQuery('SELECT * FROM match', [], callBack);
        }

        var createMatch = function (match, callBack) {
            var query = "INSERT INTO match (team1, team2, matchDate, matchTime, location, team1Try, team1Penalty, team1Conversion, team1DropGoal, team2Try, team2Penalty, team2Conversion, team2DropGoal) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
            insert(query, [match.team1, match.team2, match.matchDate, match.matchTime, match.location, match.team1Try, match.team1Penalty, match.team1Conversion, match.team1DropGoal, match.team2Try, match.team2Penalty, match.team2Conversion, match.team2DropGoal], callBack);
        }

        var updateMatch = function (team, callBack) {
            var query = "UPDATE match SET team1 =?, team2 =?, matchDate=?, matchTime=?, location=?, team1Try=?, team1Penalty=?, team1Conversion=?, team1DropGoal=?, team2Try=?, team2Penalty=?, team2Conversion=?, team2DropGoal=? WHERE matchId=?";
            executeQuery(query, [match.team1, match.team2, match.matchDate, match.matchTime, match.location, match.team1Try, match.team1Penalty, match.team1Conversion, match.team1DropGoal, match.team2Try, match.team2Penalty, match.team2Conversion, match.team2DropGoal, match.matchId], callBack);
        }

        var deleteMatch = function (id, callBack) {
            var query = 'DELETE FROM match WHERE matchId = ?';
            executeQuery(query, [id], callBack);
        }

        //SETTINGS****************************************************************
        var createSetting = function (teamId, callBack) {
            executeQuery('DELETE FROM settings', null, function () {
                var query = "INSERT INTO settings (teamId) VALUES (?)";
                insert(query, [teamId], callBack);
            })
        }

        var loadSetting = function (callBack) {
            executeQuery('SELECT * FROM settings', [], callBack);
        }

        var updateSetting = function (teamId, callBack) {
            var query = "UPDATE settings SET teamId = ?";
            executeQuery(query, [teamId], callBack);
        }

        //TEAMS********************************************************************
        var loadTeams = function (callBack) {
            executeQuery('SELECT * FROM team', [], callBack);
        }

        var createTeam = function (team, callBack) {
            var query = "INSERT INTO team (abbrTeamName, fullTeamName, clubAddress, townCity, country, postCode) VALUES (?,?,?,?,?,?)";
            insert(query, [team.abbrTeamName, team.fullTeamName, team.clubAddress, team.townCity, team.country, team.postCode], callBack);
        }

        var updateTeam = function (team, callBack) {
            var query = "UPDATE team SET abbrTeamName = ?, fullTeamName = ?, clubAddress = ?, townCity = ?, country=?, postCode=? WHERE teamId=?";
            executeQuery(query, [team.abbrTeamName, team.fullTeamName, team.clubAddress, team.townCity, team.country, team.postCode, team.teamId], callBack);
        }

        var updateMatchTeamName = function (oldTeamName, newTeamName) {
            var query = "UPDATE match SET team1 = ? WHERE team1=?";
            executeQuery(query, [newTeamName, oldTeamName]);

            var query = "UPDATE match SET team2 = ? WHERE team2=?";
            executeQuery(query, [newTeamName, oldTeamName]);
        }

        var deleteTeam = function (id, callBack) {
            var query = 'DELETE FROM team WHERE teamId = ?';
            executeQuery(query, [id], callBack);
        }

        return {
            database: database,
            initialize: initialize,
            team: {
                loadTeams: loadTeams,
                createTeam: createTeam,
                updateTeam: updateTeam,
                deleteTeam: deleteTeam
            },
            setting: {
                createSetting: createSetting,
                updateSetting: updateSetting,
                loadSetting: loadSetting
            },
            match: {
                loadMatches: loadMatches,
                updateMatch: updateMatch,
                createMatch: createMatch,
                deleteMatch: deleteMatch,
                updateMatchTeamName: updateMatchTeamName
            }
        };
    })