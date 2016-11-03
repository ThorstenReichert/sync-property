'use strict';

const expect = require('chai').expect;
const property = require('../bundle.js').property;
const IAE = require('../bundle.js').InvalidArgumentException;
const IOE = require('../bundle.js').InvalidOperationException;

describe('sync', function () {

    it('should return value of synced property', function() {
        const obj = { prop: 'some value' };
        property(obj, 'synced').sync('prop');

        expect(obj.synced).to.equal(obj.prop);
    });

    it('should reflect changes in synced property', function () {
        const obj = { prop: 'some value' };
        property(obj, 'synced').sync('prop');

        obj.prop = 'other value';
        expect(obj.synced).to.equal(obj.prop);
    });

    it('should push values to synced property', function () {
        const obj = { prop: 'some value' };
        property(obj, 'synced').sync('prop');

        const val = 'new value';
        obj.synced = val;
        expect(obj.prop).to.equal(val);
    });

    it('should sync with nested property', function () {
        const obj = {
            sub: {
                prop: 'prop value'
            }
        };
        property(obj, 'synced').sync(obj, 'sub.prop');

        expect(obj.synced).to.equal(obj.sub.prop);
    });

});