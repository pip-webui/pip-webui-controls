'use strict';

describe('pipToggleButton', function () {

    describe('directive', function () {
        var $compile,
            $rootScope,
            scope,
            element,
            elementContainer,
            buttons, button0, button1, button2,
            buttonCollection = [
                {id: 1, name: 'ONE'},
                {id: 2, name: 'TWO'},
                {id: 3, name: 'THREE'},
                {id: 4, name: 'FOUR'},
                {id: 5, name: 'FIVE'}
            ];

        beforeEach(module('ngMaterial'));
        beforeEach(module('pipToggleButtons'));
        beforeEach(module('pipSelected'));
        beforeEach(module('pipTranslateFilters'));

        beforeEach(inject(function(_$compile_, _$rootScope_){
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        }));

        beforeEach(function () {
            scope = $rootScope.$new();
            scope.buttons = buttonCollection;
            scope.currentButtonIndex = 0;
            scope.currentButton = null;

            element = angular.element('<pip-toggle-buttons pip-buttons="buttons" ng-model="currentButtonIndex" pip-button-object="currentButton" ng-change="onButtonChange()"></div>');

            //to fire jquery events
            //element.appendTo(document.body);
            $compile(element)(scope);
            scope.$digest();

            elementContainer = element.find('.pip-toggle-buttons');
            buttons = element.find('.pip-toggle-buttons .pip-selectable');
            button0 = buttons.eq(0);
            button1 = buttons.eq(1);
            button2 = buttons.eq(2);
        });

        it('should inserts the template form templateURL with the appropriate content', function (done) {
            // Check that the compiled element contains the templated content
            assert.equal(element.length, 1);
            // Check that default buttons set applies
            assert.equal(buttons.length, 5);
            assert.equal(button0.hasClass('selected'), true);

            done();
        });

        it('click and keydown, indices and object', function (done) {
            //Change button by click
            button0.click();
            assert.equal(scope.currentButtonIndex, 0);
            assert.equal(scope.currentButton.id, 1);

            elementContainer.triggerHandler({type: 'keydown', which: 39});

            assert.equal(button1.hasClass('selected'), true);
            assert.equal(button0.hasClass('selected'), false);
            assert.equal(scope.currentButton.id, 2);
            assert.equal(scope.currentButtonIndex, 1);

            elementContainer.triggerHandler({type: 'keydown', which: 40});

            assert.equal(button2.hasClass('selected'), true);
            assert.equal(button1.hasClass('selected'), false);
            assert.equal(scope.currentButton.id, 3);
            assert.equal(scope.currentButtonIndex, 2);

            elementContainer.triggerHandler({type: 'keydown', which: 37});

            assert.equal(button1.hasClass('selected'), true);
            assert.equal(button2.hasClass('selected'), false);
            assert.equal(scope.currentButton.id, 2);
            assert.equal(scope.currentButtonIndex, 1);

            elementContainer.triggerHandler({type: 'keydown', which: 38});

            assert.equal(button0.hasClass('selected'), true);
            assert.equal(button1.hasClass('selected'), false);
            assert.equal(scope.currentButton.id, 1);
            assert.equal(scope.currentButtonIndex, 0);

            done();
        });


    });

});

