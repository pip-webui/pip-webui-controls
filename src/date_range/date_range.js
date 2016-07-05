/**
 * @file Date range control
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Improve samples int sampler app
 * - Optimize. It is way to slow on samples
 */

/*
 pip-date-range-type
 [ daily,  weekly,  monthly,  yearly ]
 */

(function (angular, _) {
    'use strict';
    var thisModule = angular.module('pipDateRange', []);

    thisModule.directive('pipDateRange',
        function () {
            return {
                restrict: 'EA',
                require: 'ngModel',
                scope: {
                    timeMode: '@pipTimeMode',
                    disabled: '&ngDisabled',
                    model: '=ngModel',
                    pipChanged: '&',
                    pipDateRangeType: '@',
                    pipDateFormat: '@',
                    pipNoLine: '@'
                },
                templateUrl: 'date_range/date_range.html',
                controller: 'pipDateRangeController'
            };
        });

    thisModule.controller('pipDateRangeController',
        function ($scope, $element, pipTranslate, $mdMedia, $rootScope) {
            var currentDate,
                currentYear,
                currentMonth,
                currentDay,
                prevState = {}, currentState = {};

            currentDate = new Date();
            currentYear = currentDate.getUTCFullYear();
            currentMonth = currentDate.getUTCMonth() + 1;
            currentDay = currentDate.getUTCDate();
            $scope.daysWeek = {
                en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
            };

            $scope.onDayChanged = function () {
                setValue();
            };

            $scope.onMonthChanged = function () {
                if ($scope.pipDateRangeType === 'weekly') {
                    var date, dayOfWeek;

                    date = new Date(Date.UTC($scope.year, $scope.month - 1, 1));
                    dayOfWeek = date.getUTCDay() ? date.getUTCDay() : 7;
                    $scope.week = getWeekByDate(dayOfWeek, $scope.month - 1, $scope.year);
                    correctWeek();
                    adjustWeek();
                } else {
                    adjustDay();
                }
                setValue();
            };

            $scope.onYearChanged = function () {
                var date, dayOfWeek;

                date = new Date(Date.UTC($scope.year, $scope.month - 1, 1));
                dayOfWeek = date.getUTCDay() ? date.getUTCDay() : 7;
                if ($scope.pipDateRangeType === 'weekly') {
                    $scope.week = getWeekByDate(dayOfWeek, $scope.month - 1, $scope.year);
                    adjustWeek();
                    correctWeek();
                } else {
                    adjustDay();
                }
                setValue();
            };

            $scope.onWeekChange = function () {
                if ($scope.pipDateRangeType === 'weekly') {
                    adjustWeek();
                    correctWeek();
                } else {
                    adjustDay();
                }
                setValue();
            };

            // visibility
            $scope.isDay = function () {
                return $scope.pipDateRangeType === 'daily';
            };

            $scope.isWeek = function () {
                return $scope.pipDateRangeType === 'weekly';
            };

            $scope.isMonth = function () {
                return $scope.pipDateRangeType === 'daily' ||
                    $scope.pipDateRangeType === 'weekly' ||
                    $scope.pipDateRangeType === 'monthly';
            };

            $scope.onChange = function () {
                if ($scope.pipChanged) {
                    $scope.pipChanged();
                }
            };

            function setCurrent() {
                currentState.day = $scope.day;
                currentState.month = $scope.month;
                currentState.year = $scope.year;
                currentState.week = $scope.week;
                currentState.dateRangeType = $scope.pipDateRangeType;
                currentState.model = $scope.model;
            }

            function fillLists() {
                $scope.days = dayList($scope.month, $scope.year);
                $scope.weeks = weekList($scope.month, $scope.year);
                $scope.months = monthList();
                $scope.shortMonths = monthList(true);
                $scope.years = yearList();

            }

            function correctWeek() {
                if (!prevState.model || prevState.model && prevState.model.getTime() >= $scope.model.getTime()) {
                    // if shift week -> increase month
                    if ($scope.weeks && $scope.weeks[$scope.week] && $scope.weeks[$scope.week].id <= 0) {
                        if ($scope.month < 12) {
                            $scope.month += 1;
                        } else {
                            $scope.month = 1;
                            $scope.year += 1;
                        }
                        fillLists();
                    }
                }
            }

            function init() {
                var value;

                value = $scope.model ? new Date($scope.model) : null;
                $scope.day = value ? value.getUTCDate() : null;
                $scope.month = value ? value.getUTCMonth() + 1 : null;
                $scope.year = value ? value.getUTCFullYear() : null;
                $scope.week = value ? getWeekByDate($scope.day, $scope.month - 1, $scope.year) : null;

                fillLists();

                if ($scope.pipDateRangeType === 'weekly') {
                    correctWeek();
                    adjustWeek();
                } else {
                    adjustDay();
                }
                setValue();
            }

            // Set initial values
            $scope.$mdMedia = $mdMedia;

            init();

            $scope.disableControls = $scope.disabled ? $scope.disabled() : false;

            // React on changes
            $scope.$watch('model', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    getValue(newValue);
                }
            });

            $scope.$watch($scope.disabled, function (newValue) {
                $scope.disableControls = newValue;
            });

            $scope.$watch('pipDateRangeType', function (newValue, oldValue) {
                if (newValue !== oldValue && oldValue) {
                    init();
                }
            });

            $scope.onYearClick = function () {
                if (!$scope.year) {
                    $scope.year = currentYear;
                }
            };

            $scope.onMonthClick = function () {
                if (!$scope.month) {
                    $scope.month = currentMonth;
                }
            };

            $scope.onDayClick = function () {
                if (!$scope.year) {
                    $scope.day = currentDay;
                }
            };
            // ---------------------------------------------------------------------------------------

            function getCountDay(month, year) {
                var count = 31;

                if (month === 4 || month === 6 || month === 9 || month === 11) {
                    count = 30;
                } else if (month === 2) {
                    if (year) {
                        // Calculate leap year (primitive)
                        count = year % 4 === 0 ? 29 : 28;
                    } else {
                        count = 28;
                    }
                }

                return count;
            }

            function dayList(month, year) {
                var count, days, i, ln;

                ln = $rootScope.$language || 'en';
                count = getCountDay(month, year);
                $scope.nameDays = [];
                days = [];
                for (i = 1; i <= count; i++) {
                    days.push(i);
                    $scope.nameDays.push($scope.daysWeek[ln][new Date(year, month - 1, i).getDay()]);
                }

                return days;
            }

            function getWeekByDate(day, month, year) {
                var date, dayOfWeek, startWeek;

                date = new Date(Date.UTC(year, month, day));
                dayOfWeek = date.getUTCDay() ? date.getUTCDay() : 7;

                if (dayOfWeek === 1) {
                    startWeek = day;
                } else {
                    startWeek = day + 1 - dayOfWeek;
                }

                return startWeek;
            }

            function getWeek(day, countDay, countPrevMonthDay) {
                var endDay, startDay;

                endDay = day + 6 > countDay ? countDay - day - 6 : day + 6;
                startDay = day > 0 ? day : countPrevMonthDay + day;

                return startDay.toString() + ' - ' + (Math.abs(endDay)).toString();
            }

            function weekList(month, year) { // возвращает список начала надели
                var weeks, countDay, countPrevMonthDay, startWeek;

                weeks = [];  // в массиве первые дни недели в текущем месяце
                countDay = getCountDay(month, year);
                startWeek = getWeekByDate(1, month - 1, year);

                countPrevMonthDay = month - 1 ? getCountDay(month - 1, year) : getCountDay(12, year - 1);
                while (startWeek < countDay + 1) {
                    weeks.push({
                        id: startWeek,
                        name: getWeek(startWeek, countDay, countPrevMonthDay)
                    });
                    startWeek = startWeek + 7;
                }

                return weeks;
            }

            function monthList() {
                var months, i;

                months = [];
                for (i = 1; i <= 12; i++) {
                    months.push({
                        id: i,
                        name: pipTranslate.translate('MONTH_' + i)
                    });
                }

                return months;
            }

            function yearList() {
                var startYear, i,
                    endYear,
                    years = [];

                switch ($scope.timeMode) {
                    case 'future':
                        startYear = currentYear;
                        endYear = currentYear + 100;
                        break;
                    case 'past':
                        startYear = currentYear - 100;
                        endYear = currentYear;
                        break;
                    case 'now':
                        startYear = currentYear - 50;
                        endYear = currentYear + 100;
                        break;
                    default:
                        startYear = currentYear - 50;
                        endYear = currentYear + 50;
                        break;
                }
                if ($scope.timeMode === 'future') {
                    for (i = startYear; i <= endYear; i++) {
                        years.push(i);
                    }
                } else {
                    for (i = endYear; i >= startYear; i--) {
                        years.push(i);
                    }
                }

                return years;
            }

            function adjustDay() {
                var days = dayList($scope.month, $scope.year);

                switch ($scope.pipDateRangeType) {
                    case 'monthly':
                        $scope.day = 1;
                        break;
                    case 'yearly':
                        $scope.month = 1;
                        $scope.day = 1;
                        break;
                    default:
                        if ($scope.days.length !== days.length) {
                            if ($scope.day > days.length) {
                                $scope.day = days.length;
                            }
                        }
                        break;
                }
                $scope.days = days;
            }

            function adjustWeek() {
                var weeks;

                weeks = weekList($scope.month, $scope.year);
                $scope.week = getWeekByDate($scope.week, $scope.month - 1, $scope.year);
                $scope.weeks = weeks;
            }

            function getValue(v) {
                var value, day, month, year, week;

                value = v ? new Date(v) : null;
                // Define values
                day = value ? value.getUTCDate() : null;
                month = value ? value.getUTCMonth() + 1 : null;
                year = value ? value.getUTCFullYear() : null;
                week = value ? getWeekByDate(day, month - 1, year) : null;
                // Exit if nothing to update
                if ($scope.day === day && $scope.month === month && $scope.year === year && $scope.week === week) {
                    return;
                }
                // Assign values to scope
                $scope.day = day;
                $scope.month = month;
                $scope.year = year;
                $scope.week = week;

                // Define data sources
                $scope.days = dayList($scope.month, $scope.year);
                $scope.weeks = weekList($scope.month, $scope.year);
            }

            function setValue() {
                var value;

                if ($scope.pipDateRangeType === 'weekly') {
                    value = new Date($scope.year, $scope.month - 1, $scope.week, 0, 0, 0, 0);
                    value = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
                    $scope.model = value;
                } else {
                    value = new Date($scope.year, $scope.month - 1, $scope.day, 0, 0, 0, 0);
                    value = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
                    $scope.model = value;
                }

                prevState = _.cloneDeep(currentState);
                setCurrent();
                $scope.onChange();
            }
        }
    );

})(window.angular, window._);
