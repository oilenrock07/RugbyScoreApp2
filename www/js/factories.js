
angular.module('rugbyapp.factories', ['ngCordova'])
  .factory('MatchFactory', function ($cordovaSQLite, DataFactory, TeamFactory) {

    //entities
    match = {};
    match.matchId = 0;
    match.team1 = 0;
    match.team2 = 0;
    match.teamName1 = '';
    match.teamName2 = '';

    match.location = '';
    match.matchDate = '';
    match.matchTime = '';
    match.isMyTeam = false;

    match.team1Try = 0;
    match.team1Penalty = 0;
    match.team1Conversion = 0;
    match.team1DropGoal = 0;

    match.team2Try = 0;
    match.team2Penalty = 0;
    match.team2Conversion = 0;
    match.team2DropGoal = 0;

    var matches = [];
    var searchMatch = [];
    var searchTeam = [];

    var updateMatch = function (param, callBack) {
      Promise.all([createTeam1(param), createTeam2(param)]).then(function (data) {
        DataFactory.match.updateMatch(param, function (rs) {
          for (var i in matches) {

            if (matches[i].teamId == param.teamId) {
              matches[i].team1 = data[0].teamId;
              matches[i].team2 = data[1].teamId;
              matches[i].teamName1 = data[0].teamName;
              matches[i].teamName2 = data[1].teamName;
              matches[i].matchDate = param.matchDate;
              matches[i].matchTime = param.matchTime;
              matches[i].location = param.location;
              matches[i].team1Try = param.team1Try;
              matches[i].team1Penalty = param.team1Penalty;
              matches[i].team1Conversion = param.team1Conversion;
              matches[i].team1DropGoal = param.team1DropGoal;
              matches[i].team2Penalty = param.team2Penalty;
              matches[i].team2Conversion = param.team2Conversion;
              matches[i].team2DropGoal = param.team2DropGoal;
              matches[i].team2Try = param.team2Try;
              matches[i].matchDateTime = new Date(param.matchDate + ' ' + param.matchTime);
              break;
            }
          }

          callBack();
        });
      })
    };

    var createTeam1 = function (match) {
      return new Promise(function (resolve, reject) {
        var team1 = TeamFactory.getByTeamName(match.teamName1);
        if (team1 == null) {
          var teamA = {
            teamId: 0,
            isMyTeam: false,
            teamName: match.teamName1,
            fullClubName: '',
            clubAddress: '',
            townCity: '',
            country: '',
            postCode: ''
          };
          DataFactory.team.createTeam(teamA, function (id) {
            teamA.teamId = id;
            TeamFactory.teams.push(teamA);
            resolve(teamA);
          });
        }
        else {
          resolve(team1);
        }
      });
    };

    var createTeam2 = function (match) {
      return new Promise(function (resolve, reject) {
        var team2 = TeamFactory.getByTeamName(match.teamName2);
        if (team2 == null) {
          var teamB = {
            teamId: 0,
            isMyTeam: false,
            fullClubName: '',
            teamName: match.teamName2,
            clubAddress: '',
            townCity: '',
            country: '',
            postCode: ''
          };

          DataFactory.team.createTeam(teamB, function (id) {
            teamB.teamId = id;
            TeamFactory.teams.push(teamB);
            resolve(teamB);
          });
        }
        else {
          resolve(team2);
        }
      });
    };


    var createMatch = function (match, callBack) {
      Promise.all([createTeam1(match), createTeam2(match)]).then(function (data) {
        match.team1 = data[0].teamId;
        match.team2 = data[1].teamId;
        match.teamName1 = data[0].teamName;
        match.teamName2 = data[1].teamName;

        DataFactory.match.createMatch(match, function (id) {
          if (id > 0) {
            match.matchId = id;
            match.matchDateTime = new Date(match.matchDate + ' ' + match.matchTime);
            matches.push(match);
          }

          callBack();
        });
      })
    };

    var deleteMatch = function (id, callBack) {
      DataFactory.match.deleteMatch(id, function (rs) {
        for (var i = 0; i < matches.length; i++) {
          if (matches[i].matchId == id) {
            matches.splice(i, 1);
            break;
          }
        }
        callBack();
      }
      );
    };

    var resetEntity = function () {
      match.matchId = 0;
      match.team1 = '';
      match.team2 = '';
      match.teamName1 = '';
      match.teamName2 = '';
      match.location = '';
      match.matchDate = '';
      match.matchTime = '';
      match.isMyTeam = false;

      match.team1Try = 0;
      match.team1Penalty = 0;
      match.team1Conversion = 0;
      match.team1DropGoal = 0;

      match.team2Try = 0;
      match.team2Penalty = 0;
      match.team2Conversion = 0;
      match.team2DropGoal = 0;
    }

    var mapEntity = function (param) {

      match.matchId = param.matchId;
      match.team1 = param.team1;
      match.team2 = param.team2;
      match.teamName1 = param.teamName1;
      match.teamName2 = param.teamName2;
      match.location = param.location;
      match.matchDate = param.matchDate;
      match.matchTime = param.matchTime;

      match.team1Try = param.team1Try;
      match.team1Penalty = param.team1Penalty;
      match.team1Conversion = param.team1Conversion;
      match.team1DropGoal = param.team1DropGoal;

      match.team2Try = param.team2Try;
      match.team2Penalty = param.team2Penalty;
      match.team2Conversion = param.team2Conversion;
      match.team2DropGoal = param.team2DropGoal;

    }

    var getMatch = function (matchId) {
      for (var i = 0; i < matches.length; i++) {
        if (matches[i].matchId === parseInt(matchId)) {
          return matches[i];
        }
      }

      return null;
    }

    var getTeamMatchesByName = function (team) {
      var teamMatches = [];

      for (var i = 0; i < matches.length; i++) {
        if (matches[i].teamName1.toLowerCase() == team.toLowerCase() || matches[i].teamName2.toLowerCase() == team.toLowerCase()) {
          teamMatches.push(matches[i]);
        }
      }

      return teamMatches;
    }

    var getTeamMatches = function (teamId) {
      var teamMatches = [];

      for (var i = 0; i < matches.length; i++) {
        if (matches[i].team1 == teamId || matches[i].team2 == teamId) {
          teamMatches.push(matches[i]);
        }
      }

      return teamMatches;
    }

    var getLastMatch = function (teamId) {
      var teamMatches = getTeamMatches(teamId);

      if (teamMatches.length > 0) {
        var sortedMatches = teamMatches.sort(function (a, b) {
          return a.matchDateTime - b.matchDateTime;
        });

        return sortedMatches[teamMatches.length - 1];
      }

      return null;
    }

    var teamSearchResult = function (teamId, oposition) {
      var teamMatches = [];

      //brute force searching
      //get all the possible abbreviation
      var possibleAbbr = [];
      for (var i = 0; i < TeamFactory.teams.length; i++) {
        if (TeamFactory.teams[i].teamName.toLowerCase().indexOf(oposition.toLowerCase()) >= 0)
          possibleAbbr.push(TeamFactory.teams[i]);
      }

      //get the matches for the team
      for (var i = 0; i < matches.length; i++) {
        if ((matches[i].team1 == teamId && (matches[i].teamName2.toLowerCase().indexOf(oposition.toLowerCase()) >= 0)) ||
          (matches[i].team2 == teamId && matches[i].teamName1.toLowerCase().indexOf(oposition.toLowerCase()) >= 0)) {
          teamMatches.push(matches[i]);
          continue;
        }

        for (var j = 0; j < possibleAbbr.length; j++) {
          if ((matches[i].team1 == teamId && (matches[i].teamName2.toLowerCase().indexOf(possibleAbbr[j].fullClubName.toLowerCase()) >= 0)) ||
            (matches[i].team2 == teamId && matches[i].teamName1.toLowerCase().indexOf(possibleAbbr[j].fullClubName.toLowerCase()) >= 0)) {
            teamMatches.push(matches[i]);
          }
        }
      }

      return teamMatches;
    }

    var autoCompleteResultSearch = function (team) {
      var teamMatches = [];

      //brute force searching
      //get all the possible abbreviation
      var possibleAbbr = [];
      var teamDistinct = [];
      for (var i = 0; i < TeamFactory.teams.length; i++) {
        if (TeamFactory.teams[i].teamName.toLowerCase().indexOf(team.toLowerCase()) >= 0 || 
            TeamFactory.teams[i].fullClubName.toLowerCase().indexOf(team.toLowerCase()) >= 0)
          possibleAbbr.push(TeamFactory.teams[i]);
      }

      //get the matches for the team
      for (var i = 0; i < matches.length; i++) {
        var inTeam1 = (matches[i].teamName1.toLowerCase().indexOf(team.toLowerCase()) >= 0)
        var inTeam2 = (matches[i].teamName2.toLowerCase().indexOf(team.toLowerCase()) >= 0);

        if (inTeam1 || inTeam2) {

          var t = inTeam1 ? matches[i].teamName1 : matches[i].teamName2;
          teamDistinct.push(t);
          matches[i].display = t;
          teamMatches.push(matches[i]);
          continue;
        }

        for (var j = 0; j < possibleAbbr.length; j++) {
          var inTeam1 = (matches[i].team1 == possibleAbbr[j].teamId);
          var inTeam2 = (matches[i].team2 == possibleAbbr[j].teamId);

          if (inTeam1 || inTeam2) {
            var t = inTeam1 ? matches[i].teamName1 : matches[i].teamName2;
            teamDistinct.push(t);
            matches[i].display = t;
            teamMatches.push(matches[i]);
          }
        }
      }


      //remove duplicate
      var distinct = [];
      for (var i = 0; i < teamMatches.length; i++) {
        var exists = false;
        for (var j = 0; j < distinct.length; j++) {
          if (distinct[j].display.toLowerCase() == teamMatches[i].display.toLowerCase()) {
            exists = true;
            break;
          }
        }

        if (!exists)
          distinct.push(teamMatches[i]);
      }

      return distinct.splice(0, 3);
    }


    var autoCompleteTeamSearch = function (teamId, oposition) {
      var teamMatches = teamSearchResult(teamId, oposition);
      var teamDistinct = [];

      for (var i = 0; i < teamMatches.length; i++) {
        var exists = false;
        for (var j = 0; j < teamDistinct.length; j++) {
          if ((teamDistinct[j].team1 == teamMatches[i].team1 && teamDistinct[j].team2 == teamMatches[i].team2) ||
            (teamDistinct[j].team1 == teamMatches[i].team2 && teamDistinct[j].team2 == teamMatches[i].team1)) {
            exists = true;
            break;
          }
        }

        if (!exists) {
          teamDistinct.push(teamMatches[i]);
        }
      }

      return teamDistinct.splice(0, 3);
    }

    var autoCompleteTeamResult = [];
    var autoCompleteTeam = function (team) {
      var teams = TeamFactory.searchTeamIncludingAbbr(team).sort(function (a, b) {
        return a.fullClubName > b.fullClubName;
      });

      if (teams.length > 0)
        return teams.splice(0, 3);
      else
        return [];
    }

    var updateTeamNames = function (oldTeamName, teamName) {

      for (var i = 0; i < matches.length; i++) {
        if (matches[i].teamName1.toLowerCase() == oldTeamName.toLowerCase()) {
          matches[i].teamName1 = teamName;
        }

        if (matches[i].teamName2.toLowerCase() == oldTeamName.toLowerCase()) {
          matches[i].teamName2 = teamName;
        }
      }

      DataFactory.match.updateMatchTeamName(oldTeamName, teamName);
    }

    return {
      match: match,
      matches: matches,
      updateMatch: updateMatch,
      createMatch: createMatch,
      deleteMatch: deleteMatch,
      mapEntity: mapEntity,
      resetEntity: resetEntity,
      getMatch: getMatch,
      getTeamMatches: getTeamMatches,
      getTeamMatchesByName: getTeamMatchesByName,
      getLastMatch: getLastMatch,
      searchMatch: searchMatch,
      teamSearchResult: teamSearchResult,
      autoCompleteTeam: autoCompleteTeam,
      autoCompleteTeamResult: autoCompleteTeamResult,
      autoCompleteTeamSearch: autoCompleteTeamSearch,
      autoCompleteResultSearch: autoCompleteResultSearch,
      updateTeamNames: updateTeamNames
    };
  })

  .factory('SettingFactory', function (DataFactory) {
    //entities
    setting = {};
    device = {};
    setting.myTeam = 0;
    var updateMyTeam = function (value, callBack) {
      DataFactory.setting.updateSetting(value, callBack);
    };

    var appdata = {
      platform: {
        iOs: 'iOS',
        android: 'Android'
      },
      scheme: {
        iOs: 'comgooglemaps://',
        android: 'com.google.android.apps.maps'
      },
      url: {
        iOs: 'comgooglemaps://?q=',
        android: 'geo:?q='
      },
      webUrl: {
        url: 'https://www.google.com.ph/maps'
      }
    };

    return {
      myTeam: setting.myTeam,
      updateMyTeam: updateMyTeam,
      appdata: appdata,
      device: device
    }
  })


  .factory('TeamFactory', function ($cordovaSQLite, $ionicPlatform, DataFactory, SettingFactory) {
    var teams = [];
    var searchTeams = [];

    //entities
    var team = {};
    team.teamId = 0;
    team.teamName = '';
    team.fullClubName = '';
    team.clubAddress = '';
    team.townCity = '';
    team.country = '';
    team.postCode = '';
    team.isMyTeam = false;

    var getbyTeamId = function (teamId) {
      for (var i = 0; i < teams.length; i++) {
        if (teams[i].teamId === parseInt(teamId)) {
          return teams[i];
        }
      }

      return null;
    }

    var resetEntity = function () {
      team.teamId = 0;
      team.teamName = '';
      team.fullClubName = '';
      team.clubAddress = '';
      team.townCity = '';
      team.country = '';
      team.postCode = '';
      team.isMyTeam = false;
    }

    var mapTeam = function (param) {
      team.teamId = param.teamId;
      team.teamName = param.teamName;
      team.fullClubName = param.fullClubName;
      team.clubAddress = param.clubAddress;
      team.townCity = param.townCity;
      team.country = param.country;
      team.postCode = param.postCode;
      team.isMyTeam = param.isMyTeam;
    }

    var saveTeam = function (param, isEdit, callBack) {
      if (!isEdit) {
        var id = DataFactory.team.createTeam(param, function (id) {
          if (id > 0) {
            param.teamId = id;
            teams.push(param);

            if (param.isMyTeam) {
              DataFactory.setting.createSetting(id, function () { });
              SettingFactory.myTeam = id;
            }

            callBack(false);
          }
        });
      }
      else {
        DataFactory.team.updateTeam(param, function (rs) {

          var isTeamNameChanged = false;
          var oldTeamName = '';

          for (var i in teams) {
            if (teams[i].teamId == param.teamId) {

              isTeamNameChanged = teams[i].teamName != param.teamName;
              oldTeamName = teams[i].teamName;

              teams[i].fullClubName = param.fullClubName;
              teams[i].teamName = param.teamName;
              teams[i].clubAddress = param.clubAddress;
              teams[i].townCity = param.townCity;
              teams[i].country = param.country;
              teams[i].postCode = param.postCode;
              break;
            }
          }

          callBack(oldTeamName, isTeamNameChanged);
        });
      }


    }

    var deleteTeam = function (id, callBack) {
      DataFactory.team.deleteTeam(id, function (rs) {
        for (var i = 0; i < teams.length; i++)
          if (teams[i].teamId == id) {
            teams.splice(i, 1);
            break;
          }

        callBack();
      });
    }

    var search = function (teamName) {
      var searchResult = [];
      for (var i = 0; i < teams.length; i++) {
        if (teams[i].fullClubName.toLowerCase().indexOf(teamName.toLowerCase()) >= 0 || 
            teams[i].teamName.toLowerCase().indexOf(teamName.toLowerCase()) >= 0) {
          searchResult.push(teams[i]);
        }
      }

      return searchResult;
    }
    var autoCompleteTeam = [];
    var searchTeamIncludingAbbr = function (teamName) {
      var searchResult = [];
      for (var i = 0; i < teams.length; i++) {
        if (teams[i].fullClubName.toLowerCase().indexOf(teamName.toLowerCase()) >= 0
          || teams[i].teamName.toLowerCase().indexOf(teamName.toLowerCase()) >= 0) {
          searchResult.push(teams[i]);
        }
      }
      
      return searchResult;
    }

    var getByTeamName = function (teamName) {
      for (var i = 0; i < teams.length; i++) {
        if (teams[i].teamName.toLowerCase() == teamName.toLowerCase()) {
          return teams[i];
        }
      }

      return null;
    }

    return {
      teams: teams,
      team: team,
      get: getbyTeamId,
      getByTeamName: getByTeamName,
      deleteTeam: deleteTeam,
      saveTeam: saveTeam,
      mapEntity: mapTeam,
      search: search,
      searchTeamIncludingAbbr: searchTeamIncludingAbbr,
      resetEntity: resetEntity,
      searchTeams: searchTeams,
      autoCompleteTeam: autoCompleteTeam
    }


  })
