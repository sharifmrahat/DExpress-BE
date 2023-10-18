"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackValidation = void 0;
const zod_1 = require("zod");
const createFeedbackZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        topic: zod_1.z.string({
            required_error: "Topic is required!",
        }),
        message: zod_1.z.string({
            required_error: "Message is required!",
        }),
    }),
});
const updateFeedbackZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        topic: zod_1.z
            .string({
            required_error: "Topic is required!",
        })
            .optional(),
        message: zod_1.z
            .string({
            required_error: "Message is required!",
        })
            .optional(),
    }),
});
exports.FeedbackValidation = {
    createFeedbackZodSchema,
    updateFeedbackZodSchema,
};
