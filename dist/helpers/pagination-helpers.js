"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paginationHelpers = (options) => {
    const page = Number(options.page || 1);
    const size = Number(options.size || 10);
    const skip = (page - 1) * size;
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';
    return {
        page,
        size,
        skip,
        sortBy,
        sortOrder,
    };
};
exports.default = paginationHelpers;
