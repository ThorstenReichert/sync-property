'use strict';

const expect = require('chai').expect;
const property = require('../bundle.js').property;

describe('decorate', function () {

    const modifyingVal = 'replaced value by modification';
    const modifyingDecorator = function (target, key, descriptor) {
        descriptor.get = function () { return modifyingVal; };
    };

    const returningVal = 'replaced value by returning';
    const returningDecorator = function (target, key, descriptor) {
        return {
            get: function () { return returningVal; }
        };
    };

    it('should decorate property for non-returning decorator', function () {
        const obj = { prop: 'property value' };
        property(obj, 'synced').decorate(modifyingDecorator).sync('prop');

        expect(obj.synced).to.equal(modifyingVal);
    });

    it('should decorate property for returning decorator', function () {
        const obj = { prop: 'property value' };
        property(obj, 'synced').decorate(returningDecorator).sync('prop');

        expect(obj.synced).to.equal(returningVal);
    });

    it('should chain decorators', function () {
        const obj = { prop: 'property value' };
        property(obj, 'synced').decorate([modifyingDecorator, returningDecorator]).sync('prop');

        expect(obj.synced).to.equal(returningVal);
    });

});