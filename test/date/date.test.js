'use strict';

describe('pipCard', function () {

    describe('directive', function () {
        var compile,
            scope,
            isolateScope,
            elem,
            template = '<pip-date ng-model="dateValue" pip-time-mode="{{timeMode}}" ' +
                'ng-disabled="dateDisabled"></pip-date>';

        beforeEach(module('pipDate'));
        beforeEach(module('pipTranslate'));

        beforeEach(inject(function($compile, $rootScope) {
            compile = $compile;
            scope = $rootScope.$new();

            scope.dateValue = '1975-04-08T00:00:00.00';
            scope.dateDisabled = false;
        }));

        function getCompiledElement(template) {
            var element = angular.element(template),
                compiledElement = compile(element)(scope);

            isolateScope = element.isolateScope();
            scope.$digest();
            return compiledElement;
        }

        it('inserts template from templateURL', function (done) {
            elem = getCompiledElement(template);

            var selected = elem.find('md-select');

            assert.equal(elem.find('.pip-date').length, 1);
            assert.equal(selected.length, 3);

            assert.equal($(selected[0]).find('md-option')[0].innerHTML, '1');
            assert.equal($(selected[0]).find('md-option')[29].innerHTML, '30');
            assert.equal($(selected[0]).find('md-option')[30], undefined);

            assert.equal($(selected[1]).find('md-option')[0].innerHTML, 'MONTH_1');
            assert.equal($(selected[1]).find('md-option')[11].innerHTML, 'MONTH_12');
            assert.equal($(selected[1]).find('md-option')[12], undefined);

            assert.equal($(selected[2]).find('md-option')[0].innerHTML, '1915');
            assert.equal($(selected[2]).find('md-option')[200].innerHTML, '2115');
            assert.equal($(selected[2]).find('md-option')[201], undefined);

            done();
        });

        it('disabled controls', function (done) {
            scope.dateDisabled = true;
            elem = getCompiledElement(template);

            $(elem.find('md-select')).each(function (idx, el) {
                assert.equal($(el).attr('disabled'), 'disabled');
            });

            done();
        });

        it('set future period of years', function (done) {
            scope.timeMode = 'future';
            elem = getCompiledElement(template);

            var yearsControl = $(elem.find('md-select')[2]).find('md-option');

            assert.equal(yearsControl.length, 101);
            assert.equal(yearsControl[0].innerHTML, '2015');
            assert.equal(yearsControl[100].innerHTML, '2115');
            assert.equal(yearsControl[101], undefined)

            done();
        });

        it('set past period of years', function (done) {
            scope.timeMode = 'past';
            elem = getCompiledElement(template);

            var yearsControl = $(elem.find('md-select')[2]).find('md-option');

            assert.equal(yearsControl.length, 101);
            assert.equal(yearsControl[0].innerHTML, '2015');
            assert.equal(yearsControl[100].innerHTML, '1915');
            assert.equal(yearsControl[101], undefined);

            done();
        });

        it('react on date changes', function (done) {
            elem = getCompiledElement(template);

            isolateScope = elem.isolateScope();
            isolateScope.day = 30;
            isolateScope.onDayChanged();
            assert.equal(isolateScope.model.getDate(), 30);

            isolateScope.month = 2;
            isolateScope.year = 2016;
            isolateScope.onYearChanged('year');
            assert.equal(isolateScope.model.getDate(), 29);

            done();
        });

    });

});

