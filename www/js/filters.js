angular.module('rugbyapp.filters', [])

    .filter('formatDate', function ($filter) {
        return function (date) {
            return new Date(date.matchDate + ' ' + date.matchTime);
        }
    })

    .filter('formatScore', function () {
        return function (n) {
            if (n < 10)
                return "00" + n;
            else if (n >= 10 && n < 100)
                return "0" + n;
            else
                return n;
        }
    });
