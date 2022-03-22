function isObject(obj: any): boolean {
    return obj !== undefined && obj !== null && obj.constructor === Object;
}

function isElement(el: any): boolean {
    return el instanceof Element;
}

function isArray(arr: any): boolean {
    return arr !== undefined && arr !== null && arr.constructor === Array;
}

function isPromise(p: any): boolean {
    return typeof p === 'object' && typeof p.then === 'function';
}

function returnsPromise(f: any): boolean {
    return f.constructor.name === 'AsyncFunction' || (typeof f === 'function' && isPromise(f()));
}

function isFunction(f: any): boolean {
    return f instanceof Function;
}

function isset(obj: any): boolean {
    return obj !== undefined;
}

function isFloat(obj: any): boolean {
    return obj !== undefined && obj !== null && !!(obj % 1);
}

function isInteger(obj: any): boolean {
    return obj !== undefined && obj !== null && parseInt(obj, 10) === obj;
}


export { isObject, isElement, isArray, returnsPromise, isFunction, isset, isFloat, isInteger };
