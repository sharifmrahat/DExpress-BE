"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pick = (obj, keys) => {
    const options = {};
    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            options[key] = obj[key];
        }
    }
    return options;
};
exports.default = pick;
