'use strict';

describe('pipColorPicker', function () {

    describe('directive', function () {
        var $compile,
            $rootScope,
            scope,
            element,
            rootElem,
            colorElems,
            colorsSpan,
            colors = ['purple', '#BD3000', 'green', 'darkred', 'pink', 'rgba(255,200,16,0.8)', 'cyan'],
            template = '<pip-color-picker pip-colors="colors" ng-model="currentColor" ng-change="onChange()"></pip-color-picker>';

        beforeEach(module('ngMaterial'));
        beforeEach(module('pipColorPicker'));
        beforeEach(module('pipSelected'));

        beforeEach(inject(function(_$compile_, _$rootScope_){
            $compile = _$compile_;
            $rootScope = _$rootScope_;

        }));

        beforeEach(function () {
            scope = $rootScope.$new();
            scope.colors = colors;
            scope.currentColor = scope.colors[0];
            scope.count = 0;

            element = $compile(template)(scope);
            scope.$digest();

            rootElem = element.find('.pip-color-picker');
            colorElems = element.find('.pip-selectable');
            colorsSpan = element.find('.pip-color-picker span');
            scope.onChange = function () {
                scope.count += 1;
            };
        });

        it('should inserts the template form templateURL with the appropriate content', function (done) {

            // Check that the compiled element contains the templated content
            assert.equal(rootElem.length, 1);
            //// Check that default color set applies
            assert.equal(colorElems.length, 7);

            done();
        });

        it('keydown', function (done) {
            
            var color = colorElems.eq(3);

            assert.equal(scope.currentColor, colors[0]);
            assert.equal(scope.count, 0);

            rootElem.triggerHandler({type: 'keydown', which: 39});

            assert.equal(scope.currentColor, colors[1]);
            assert.equal(scope.count, 1);

            rootElem.triggerHandler({type: 'keydown', which: 40});
            assert.equal(scope.currentColor, colors[2]);
            assert.equal(scope.count, 2);

            rootElem.triggerHandler({type: 'keydown', which: 37});
            assert.equal(scope.currentColor, colors[1]);
            assert.equal(scope.count, 3);

            rootElem.triggerHandler({type: 'keydown', which: 38});
            assert.equal(scope.currentColor, colors[1]);
            assert.equal(scope.count, 4);

            color.click();
            assert.equal(color.hasClass('selected'), true);
            assert.equal(scope.currentColor, colors[3]);
            assert.equal(scope.count, 5);

            done();
        });


    });

});

