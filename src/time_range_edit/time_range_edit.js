
(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipTimeRangeEdit', ['pipUtils', 'pipTranslate']);

    thisModule.directive('pipTimeRangeEdit',
        function () {
            return {
                restrict: 'EA',
                scope: {
                    pipStartDate: '=',
                    pipChanged: '&',
                    pipEndDate: '=',
                    pipStartLabel: '@',
                    pipEndLabel: '@',
                    disabled: '&ngDisabled',
                    pipSize: '='
                },
                templateUrl: 'time_range_edit/time_range_edit.html',
                controller: 'pipTimeRangeEditController'
            };
        }
    );

    thisModule.controller('pipTimeRangeEditController',
        function ($scope, $element, $attrs, pipDates, pipTranslate) {

            function getDateJSON(value) {
                return value ? new Date(value) : null;
            }

            function setDuration() {
                var start, end;

                if (!$scope.data.startDate || !$scope.data.endDate) {
                    return null;
                }
                start = new Date($scope.data.startDate.getTime() + $scope.data.startTime * 60 * 1000);
                end = new Date($scope.data.endDate.getTime() + $scope.data.endTime * 60 * 1000);

                return end - start;
            }

            function validateStartDate() {
                var date, start, end;

                // если начальная дата не задана, обнуляем и выходим
                if (!$scope.data.startDate) {
                    $scope.data.startTime = null;

                    return;
                }

                // еcли не задано начальное время - задаем его
                if (!$scope.data.startTime) {
                    if (!$scope.data.endTime) {
                        date = new Date();
                        date = date.getTime() - pipDates.toStartDay(date);
                        $scope.data.startTime = Math.floor(date / (30 * 60 * 1000)) * 30;
                    } else {
                        $scope.data.startTime = $scope.data.endTime === 0 ? 0 : $scope.data.endTime - 30;
                    }
                }

                // если конечная дата не задана, обнуляем и выходим
                if (!$scope.data.endDate) {
                    $scope.data.endTime = null;

                    return;
                }

                start = new Date($scope.data.startDate.getTime() + $scope.data.startTime * 60 * 1000);

                // Если есть длительность, то сохраняем ее. Длительность можно изменить только изменяя конечную дату
                if ($scope.data.duration) {
                    end = new Date(start.getTime() + $scope.data.duration);
                    $scope.data.endDate = pipDates.toStartDay(end);
                    end = end.getTime() - $scope.data.endDate.getTime();
                    $scope.data.endTime = Math.floor(end / (30 * 60 * 1000)) * 30;
                } else {
                    // Если нет длительности сравниваем даты
                    end = new Date($scope.data.endDate.getTime() + $scope.data.endTime * 60 * 1000);
                    if (start >= end) {
                        // Если начальная дата больше, то двигаем конечную дату
                        $scope.data.endDate = pipDates.toStartDay(new Date(start.getTime() + 30 * 60000));
                        $scope.data.endTime = ($scope.data.startTime + 30) % 1440;
                    }
                }
            }

            function validateEndDate() {
                var date, start, end;

                // если начальная дата не задана, обнуляем и выходим
                if (!$scope.data.endDate) {
                    $scope.data.endTime = null;

                    return;
                }

                // еcли не задано конечное время - задаем его
                if (!$scope.data.endTime) {
                    if (!$scope.data.startTime) {
                        date = new Date();
                        date = date.getTime() - pipDates.toStartDay(date);
                        $scope.data.endTime = Math.floor(date / (30 * 60 * 1000)) * 30;
                    } else {
                        $scope.data.endTime = $scope.data.startTime === 1410 ? 1410 : $scope.data.startTime + 30;
                    }
                }

                // если yачальная дата не задана, обнуляем и выходим
                if (!$scope.data.startDate) {
                    $scope.data.startTime = null;

                    return;
                }

                start = new Date($scope.data.startDate.getTime() + $scope.data.startTime * 60 * 1000);
                end = new Date($scope.data.endDate.getTime() + $scope.data.endTime * 60 * 1000);

                if (start >= end) {
                    // Если начальная дата больше, то двигаем начальную дату
                    $scope.data.startDate = pipDates.toStartDay(new Date(end.getTime() - 30 * 60000));
                    $scope.data.startTime = $scope.data.endTime % 1440 === 0 ? 1410 : $scope.data.endTime - 30;
                }

                $scope.data.duration = setDuration();
            }

            function setDate() {
                var time;

                $scope.data.bind = false;

                if ($scope.data.startDate) {
                    time = $scope.data.startTime ? $scope.data.startTime * 60 * 1000 : 0;
                    $scope.pipStartDate = new Date($scope.data.startDate.getTime() + time);
                }

                if ($scope.data.endDate) {
                    time = $scope.data.endTime ? $scope.data.endTime * 60 * 1000 : 0;
                    $scope.pipEndDate = new Date($scope.data.endDate.getTime() + time);
                }

                $scope.data.bind = true;
            }

            function defineDate() {
                var start, end;

                if ($scope.pipStartDate !== null && $scope.pipStartDate !== undefined) {
                    start = _.isDate($scope.pipStartDate) ? $scope.pipStartDate : null;

                    if (!start) {
                        start = getDateJSON($scope.pipStartDate);
                    }

                    $scope.data.startDate = pipDates.toStartDay(start);
                    $scope.data.startTime = (new Date(start) - $scope.data.startDate) / (60 * 1000);
                }

                if ($scope.pipEndDate !== null && $scope.pipEndDate !== undefined) {
                    end = _.isDate($scope.pipEndDate) ? $scope.pipEndDate : null;

                    if (!start) {
                        end = getDateJSON($scope.pipEndDate);
                    }

                    $scope.data.endDate = pipDates.toStartDay(end);
                    $scope.data.endTime = (new Date(end) - $scope.data.endDate) / (60 * 1000);
                }

                validateStartDate();
                $scope.data.duration = setDuration();
                setDate();
            }

            function getTimeInterval() {
                var result, i, j, minutes;

                result = [];
                for (i = 0; i < 24; i++) {
                    for (j = 0; j < 2; j++) {
                        minutes = j * 30;
                        result.push({
                            id: i * 60 + minutes,
                            time: _.pad(i.toString(), 3, '0').substr(0, 2) + ':' + _.pad(minutes.toString(), 2, '0')
                        });
                    }
                }

                return result;
            }

            function initDate() {
                $scope.data.startDate = null;
                $scope.data.startTime = null;
                $scope.data.endDate = null;
                $scope.data.endTime = null;
                $scope.data.duration = null;
            }

            // initialize data
            $scope.intervalTimeCollection = getTimeInterval();
            $scope.data = {};
            $scope.startLabel = $scope.pipStartLabel ? pipTranslate.translate($scope.pipStartLabel)
                : pipTranslate.translate('EVENT_NEW_START_TIME');
            $scope.endLabel = $scope.pipEndLabel ? pipTranslate.translate($scope.pipEndLabel)
                : pipTranslate.translate('EVENT_NEW_END_TIME');
            initDate();
            defineDate();

            // process function
            $scope.onChangeStartDate = function () {
                validateStartDate();
                $scope.data.duration = setDuration();
                setDate();
                $scope.pipChanged();
            };

            $scope.onChangeEndDate = function () {
                validateEndDate();
                $scope.data.duration = setDuration();
                setDate();
                $scope.pipChanged();
            };

            $scope.onChangeStartTime = function () {
                if (!$scope.data.startDate) {
                    $scope.data.startDate = pipDates.toStartDay(new Date());
                }
                validateStartDate();
                $scope.data.duration = setDuration();
                setDate();
                $scope.pipChanged();
            };

            $scope.onChangeEndTime = function () {
                if (!$scope.data.endDate) {
                    $scope.data.endDate = pipDates.toStartDay(new Date());
                }

                validateEndDate();
                $scope.data.duration = setDuration();
                setDate();
                $scope.pipChanged();
            };

            $scope.isDisabled = function () {
                if ($scope.disabled) {
                    return $scope.disabled();
                }

                return false;
            };

            $scope.$watchGroup([$scope.pipStartDate, $scope.pipEndDate], function () {
                if ($scope.data.bind) {
                    initDate();
                    defineDate();
                }
            });

            $scope.$watch($scope.disabled, function (newValue) {
                $scope.disableControls = newValue;
            });

            // Add class
            $element.addClass('pip-time-range-edit');
        }
    );

})(window.angular, window._);
