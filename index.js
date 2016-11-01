'use strict';

import InvalidArgumentException from './src/invalid-argument-exception';
import InvalidOperationException from './src/invalid-operation-exception';
import SyncedPropertyCreator from './src/synced-property-creator';

/**
 * @param {object} target       object to which property should be attached
 * @param {string} key          name of property
 *
 * OR
 *
 * @param {string} key          name of property
 *                              target will be set to "this" (needs to be set via bind)
 */
function property() {
    if (arguments.length === 1) {
        if (typeof this !== 'object') {
            throw new InvalidArgumentException('"this" must be bound to an object');
        }

        return new SyncedPropertyCreator(this, arguments[0]);
    }
    else if (arguments.length > 1) {
        return new SyncedPropertyCreator(arguments[0], arguments[1]);
    }

    throw new InvalidArgumentException('at least one argument must be given');
}

export {InvalidArgumentException, InvalidOperationException, property};
