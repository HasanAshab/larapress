"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToMockable = exports.passErrorsToHandler = exports.performance = void 0;
function performance(constructor) {
    const methodNames = Object.getOwnPropertyNames(constructor.prototype);
    for (const methodName of methodNames) {
        const method = constructor.prototype[methodName];
        if (methodName === "constructor" || typeof method !== "function") {
            continue;
        }
        constructor.prototype[methodName] = async function (...args) {
            console.time(`${constructor.name}.${methodName}`);
            const result = await method.apply(constructor, args);
            console.timeEnd(`${constructor.name}.${methodName}`);
            return result;
        };
    }
}
exports.performance = performance;
function passErrorsToHandler(constructor) {
    const methodNames = Object.getOwnPropertyNames(constructor.prototype);
    for (const methodName of methodNames) {
        const method = constructor.prototype[methodName];
        if (methodName === "constructor" || typeof method !== "function") {
            continue;
        }
        constructor.prototype[methodName] = async function (...args) {
            try {
                return await method.apply(constructor, args);
            }
            catch (err) {
                for (const arg of args) {
                    if (typeof arg === "function") {
                        arg(err);
                        break;
                    }
                }
            }
        };
    }
}
exports.passErrorsToHandler = passErrorsToHandler;
function convertToMockable(mockClass) {
    return function (targetClass) {
        const staticMethods = Object.getOwnPropertyNames(mockClass).filter((method) => method !== 'constructor' &&
            method !== 'length' &&
            method !== 'name' &&
            method !== 'prototype');
        staticMethods.forEach((method) => {
            if (method.endsWith("Logger")) {
                const targetMethodName = method.replace("Logger", "");
                const targetMethod = targetClass[targetMethodName];
                targetClass[targetMethodName] = function (...args) {
                    this.isMocked && mockClass[method].apply(this, args);
                    return targetMethod.apply(this, args);
                };
            }
            else if (targetClass[method]) {
                const realMethod = targetClass[method];
                targetClass[method] = function (...args) {
                    return this.isMocked ? mockClass[method].apply(this, args) : realMethod.apply(this, args);
                };
            }
            else {
                targetClass[method] = mockClass[method];
            }
        });
    };
}
exports.convertToMockable = convertToMockable;
