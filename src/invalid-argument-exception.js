'use strict';

function InvalidArgumentException(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message;
}

InvalidArgumentException.prototype = new Error();
InvalidArgumentException.prototype.constructor = InvalidArgumentException;

export default InvalidArgumentException;