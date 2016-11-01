import InvalidArgumentException from './invalid-argument-exception';
import InvalidOperationException from './invalid-operation-exception';

class SyncedPropertyCreator {
    constructor(target, key) {

        const _this = this;

        //
        // sanity checks
        //

        if (!target) {
            throw new InvalidArgumentException('target must be specified');
        }

        if (typeof target !== 'object') {
            throw new InvalidArgumentException('target must be of type object');
        }

        if (!key) {
            throw new InvalidArgumentException('key must be specified');
        }

        if (typeof key !== 'string') {
            throw new InvalidArgumentException('key must be of type string');
        }

        //
        // classes
        //

        /**
         * specifies obj and path of property on obj from which to sync
         */
        class SyncConfig {
            constructor(obj, path) {
                if (typeof obj !== 'object') {
                    throw new InvalidArgumentException('obj must be of type object');
                }

                if (typeof path !== 'string') {
                    throw new InvalidArgumentException('path must be of type string');
                }

                this.obj = obj;
                this.path = path;
            }
        }

        //
        // public methods
        //

        /**
         * schedule decoration of synced property with specified decorators
         *
         * @param {function[]} decorators       array of decorators
         * @throws InvalidArgumentException
         * @returns {object}
         */
        this.decorate = function (decorators) {
            if (!Array.isArray(decorators)) {
                decorators = [decorators];
            }

            decorators.forEach(function (dec) {
                if (typeof dec !== 'function') {
                    throw new InvalidArgumentException('decorator must be of type function');
                }
            });

            _this.decorators = decorators;
            return _this;
        };

        /**
         * creates property that echoes value of property specified in arguments
         *
         * @see createSyncConfig
         */
        this.echo = function () {
            const config = createSyncConfig.apply(null, arguments);
            let descriptor = {
                get: getEchoGetter(config.obj, config.path),
                set: getEchoSetter(config.obj, config.path)
            };

            descriptor = applyDecorators(target, key, descriptor, _this.decorators) || descriptor;
            Object.defineProperty(target, key, descriptor);
        };

        /**
         * creates property that pushes values to property specified in arguments
         *
         * @see createSyncConfig
         */
        this.push = function () {
            const config = createSyncConfig.apply(null, arguments);
            let  descriptor = {
                get: getPushGetter(config.obj, config.path),
                set: getPushSetter(config.obj, config.path)
            };

            descriptor = applyDecorators(target, key, descriptor, _this.decorators) || descriptor;
            Object.defineProperty(target, key, descriptor);
        };

        /**
         * creates property that synchronizes value with property specified in arguments
         *
         * @see createSyncConfig
         */
        this.sync = function () {
            const config = createSyncConfig.apply(null, arguments);
            let descriptor = {
                get: getEchoGetter(config.obj, config.path),
                set: getPushSetter(config.obj, config.path)
            };

            descriptor = applyDecorators(target, key, descriptor, _this.decorators) || descriptor;
            Object.defineProperty(target, key, descriptor);
        };

        //
        // helper functions
        //

        /**
         * returns SyncConfig from variable number of arguments
         *
         * @param {object} obj      Source object whose property will be synced
         * @param {string} path     Path to property of source obj
         *
         * OR
         *
         * @param {string} path     Path to property of obj
         *                          obj will be set to target specified in property() method
         *
         * @throws InvalidArgumentException
         */
        function createSyncConfig() {
            if (arguments.length === 1) {
                return new SyncConfig(target, arguments[0]);
            }
            else if (arguments.length > 1) {
                return new SyncConfig(arguments[0], arguments[1]);
            }
            else {
                throw new InvalidArgumentException('at least one argument must be given');
            }
        }

        /**
         * apply array of decorators (in order) to descriptor
         *
         * @param {object} target
         * @param {string} key
         * @param {object} decorator
         * @param {function[]} decorators
         * @returns {object}
         */
        function applyDecorators(target, key, descriptor, decorators) {
            if (Array.isArray(decorators)) {
                for (let i = 0; i < decorators.length; i++) {
                    descriptor = decorators[i](target, key, descriptor) || descriptor;
                }
            }

            return descriptor;
        }

        /**
         * resolve nested property of obj specified in path
         * and return its value.
         *
         * @param {object} obj
         * @param {string} path
         * @returns {any}
         */
        function resolve (obj, path) {
            if (!path || path === '') {
                return obj;
            }

            function index(obj, key) {
                if (obj === undefined) {
                    return undefined;
                }
                else if (obj === null) {
                    return null;
                }
                else {
                    return obj[key];
                }
            }

            return path.split('.').reduce(index, obj);
        }

        /**
         * returns getter for property specified by path on obj
         *
         * @param {object} obj
         * @param {string} path
         * @throws InvalidArgumentException
         * @returns {any}
         */
        function getEchoGetter(obj, path) {
            if (typeof path !== 'string') {
                throw new InvalidArgumentException('path must be of type string');
            }

            return function () {
                return resolve(obj, path);
            };
        }

        /**
         * returns function throwing InvalidOperationException
         */
        function getEchoSetter(obj, path) {
            return function (value) {
                throw new InvalidOperationException('cannot set value of echoed property');
            };
        }

        /**
         * returns function throwing InvalidOperationException
         */
        function getPushGetter(obj, path) {
            return function () {
                throw new InvalidOperationException('cannot get value of pushing property');
            };
        }

        /**
         * returns setter method for property specified by path on obj
         *
         * @param {object} obj
         * @throws InvalidArgumentException
         * @param {string} path
         */
        function getPushSetter(obj, path) {
            if (typeof path !== 'string') {
                throw new InvalidArgumentException('path must be of type string');
            }

            const pathArray = path.split('.');
            const ref = pathArray.slice(0,-1).join('.') || '';
            const name = pathArray[pathArray.length - 1];

            return function (value) {
                resolve(obj, ref)[name] = value;
            };
        }
    }
}

export default SyncedPropertyCreator;