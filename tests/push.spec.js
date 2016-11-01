'use strict';

const expect = require('chai').expect;
const property = require('../bundle.js').property;
const IAE = require('../bundle.js').InvalidArgumentException;
const IOE = require('../bundle.js').InvalidOperationException;

describe('push', function () {

    it('should push value to property', function () {
        class Foo {
            constructor() {
                this.prop = '';

                const prop = property.bind(this);
                prop('pushing').push('prop');
            }
        }

        const foo = new Foo();
        const val = 'new value';
        foo.pushing = val;
        expect(foo.prop).to.equal(val);
    });

    it('should push value to property of subobject', function () {
        class Foo {
            constructor() {
                this.sub = {
                    prop: ''
                };

                const prop = property.bind(this);
                prop('pushing').push('sub.prop');
            }
        }

        const foo = new Foo();
        const val = 'new value';
        foo.pushing = val;
        expect(foo.sub.prop).to.equal(val);
    });

    it('should attach pushing property to specified object', function () {
        const obj = { prop: '' };
        property(obj, 'pushing').push('prop');

        const val = 'new value';
        obj.pushing = val;
        expect(obj.prop).to.equal(val);
    });

    it('should push to property of foreign object', function () {
        const obj = {};
        const other = { prop: '' };
        property(obj, 'pushing').push(other, 'prop');

        const val = 'new value';
        obj.pushing = val;
        expect(other.prop).to.equal(val);
    });

    it('should throw InvalidOperationException on attempt to get value', function () {
        const obj = { prop: '' };
        property(obj, 'pushing').push('prop');

        function test() {
            console.log(obj.pushing);
        }

        expect(test).to.throw(IOE);
    });

});