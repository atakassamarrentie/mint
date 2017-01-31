(function () {
    'use strict';

    angular.module('BlurAdmin.pages')
        .filter('relativeDate', function () {
            return function (time) {
                
                
                var _cutoffDay_, _defaultFallbackFormat_;
                _defaultFallbackFormat_ = "MMM d, yyyy";
                _cutoffDay_ = 22;
                function defaultFallbackFormat(format) {
                    return _defaultFallbackFormat_ = format;
                };
                function cutoffDayCount(numDays) {
                    return _cutoffDay_ = numDays;
                };


                var fallbackFormat, time_ago;
                fallbackFormat = function (formatOverride) {
                    if (typeof formatOverride !== 'undefined') {
                        return formatOverride;
                    } else {
                        return _defaultFallbackFormat_;
                    }
                };
                time_ago = function (time, override) {
                    var date, day_diff, diff;
                    date = new Date(time || "");
                    console.log(date)
                    diff = ((new Date()).getTime() - date.getTime()) / 1000;
                    day_diff = Math.floor(diff / 86400);
                    if (isNaN(day_diff) || day_diff < 0 || day_diff >= _cutoffDay_) {
                        return dateFilter(date, fallbackFormat(override));
                    }
                    return day_diff === 0 && (diff < 60 && "just now" || diff < 120 && "about 1 minute ago" || diff < 3600 && Math.floor(diff / 60) + " minutes ago" || diff < 7200 && "about 1 hour ago" || diff < 86400 && Math.floor(diff / 3600) + " hours ago") || day_diff === 1 && "Yesterday" || day_diff < 7 && day_diff + " days ago" || day_diff === 7 && "a week ago" || Math.ceil(day_diff / 7) + " weeks ago";
                };
                

                
                        
                        var error, iterator, notice, relDate, success;
                        relDate = time_ago(date, optionalFormat);
                        console.log('relDate: ', relDate)
                        iterator = $interval(function () {
                            relDate = time_ago(date, optionalFormat);
                            return callback(relDate);
                        }, 60000);
                        success = function () { };
                        error = function () { };
                        notice = function () {
                            if (!(relDate.slice(-3) === "now" || relDate.slice(-3) === "ago" || relDate.slice(-3) === "day")) {
                                return $interval.cancel(iterator);
                            }
                        };
                        iterator.then(success, error, notice);
                        callback(relDate);
                        return iterator;
                    }

        })
})();