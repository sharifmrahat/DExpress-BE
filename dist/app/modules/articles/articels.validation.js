"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleValidation = void 0;
const zod_1 = require("zod");
const createArticleZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: "Title is required!",
        }),
        description: zod_1.z.string({
            required_error: "Description is required!",
        }),
        imageUrl: zod_1.z
            .string({
            required_error: "Description is required!",
        })
            .optional(),
    }),
});
const updateArticleZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({
            required_error: "Title is required!",
        })
            .optional(),
        description: zod_1.z
            .string({
            required_error: "Description is required!",
        })
            .optional(),
        imageUrl: zod_1.z
            .string({
            required_error: "Description is required!",
        })
            .optional(),
    }),
});
exports.ArticleValidation = {
    createArticleZodSchema,
    updateArticleZodSchema,
};
