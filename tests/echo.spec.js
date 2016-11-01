'use strict';

const expect = require('chai').expect;
const property = require('../bundle.js').property;
const IAE = require('../bundle.js').InvalidArgumentException;
const IOE = require('../bundle.js').InvalidOperationException;

describe('echo', function () {

    it('should return value of property', function () {
        class Foo {
            constructor() {
                this.prop = 'some value';

                const prop = property.bind(this);
                prop('echoed').echo('prop');
            }
        }

        const foo = new Foo();
        expect(foo.echoed).to.equal(foo.prop);
    });

    it('should reflect value changes in echoed property', function () {
        class Foo {
            constructor() {
                this.prop = 'some value';

                const prop = property.bind(this);
                prop('echoed').echo('prop');
            }
        }

        const foo = new Foo();
        expect(foo.echoed).to.equal(foo.prop);
        foo.prop = 'other string';
        expect(foo.echoed).to.equal(foo.prop);
    });

    it('should return value of nested property', function () {
        class Foo {
            constructor() {
                this.sub = {
                    prop: 'some value'
                };

                const prop = property.bind(this);
                prop('echoed').echo('sub.prop');
            }
        }

        const foo = new Foo();
        expect(foo.echoed).to.equal(foo.sub.prop);
    });

    it('should attach echoed property to specified object', function () {
        const obj = {
            prop: 'some value'
        };
        property(obj, 'echoed').echo('prop');

        expect(obj.echoed).to.equal(obj.prop);
    });

    it('should echo property of foreign object', function () {
        const obj = {};
        const other = { prop: 'some value' };

        property(obj, 'echoed').echo(other, 'prop');
        expect(obj.echoed).to.equal(other.prop);
    });

    it('should throw InvalidOperationException on attempt to set value', function () {
        const obj = { prop: 'value' };
        property(obj, 'echoed').echo('prop');

        function test() {
            obj.echoed = 'other value';
        }

        expect(test).to.throw(IOE);
    });

});