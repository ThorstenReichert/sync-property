# sync-property

Simple tool to synchronize properties. 

# Example usage

With objects:

```
import {property} from './sync-property/index';
import {InvalidOperationException} from './sync-property/index';

let source = {
  propOne: 'prop 1 value',
  propTwo: 'prop 2 value',
  propThree: 'prop 3 value'
};
let obj = {};

property(obj, 'synced').sync(source, 'propOne');
property(obj, 'echoed').echo(source, 'propTwo');
property(obj, 'pushing').push(source, 'propThree);

console.log(obj.synced); // 'prop 1 value'
obj.synced = 'other value';
console.log(source.prop); // 'other value'

console.log(obj.echoed) // 'prop 2 value';
obj.echoed = 'other value' // throws InvalidOperationException

obj.pushing = 'other value';
console.log(source.propThree); // 'other value'
console.log(obj.pushing) // throws InvalidOperationException
```

With classes: `this` can be bound to `property`

```
import {property} from './sync-property/index';

class Foo {
  constructor(obj) {
    const prop = property.bind(this);
    
    this.ownProp = 'own value';
    
    prop('synced').sync(obj, 'prop');
    prop('syncedOwn').sync('own');
  }
}

let obj = { prop: 'prop value' };
let foo = new Foo(obj);

console.log(foo.synced); // 'prop value'
console.log(foo.syncedOwn); // 'own value'
```

Properties can be decorated. Decorators are expected to be functions sith signature `function decorator(target, key, descriptor)` and will be applied in order.

```
property(obj, 'synced')
  .decorate([
    decorator1,   // applied first
    decorator2    // applied second
  ])
  .sync(source, 'prop');
```
