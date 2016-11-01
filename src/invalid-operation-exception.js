'use strict';

function InvalidOperationException(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message;
}

InvalidOperationException.prototype = new Error();
InvalidOperationException.prototype.constructor = InvalidOperationException;

export default InvalidOperationException;