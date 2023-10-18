"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidation = void 0;
const zod_1 = require("zod");
const createReviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        review: zod_1.z.string({
            required_error: "review is required!",
        }),
        rating: zod_1.z.number({
            required_error: "rating is required!",
        }),
        bookingId: zod_1.z.string({
            required_error: "Booking id is required!",
        }),
    }),
});
const updateReviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        review: zod_1.z
            .string({
            required_error: "review is required!",
        })
            .optional(),
        rating: zod_1.z
            .number({
            required_error: "rating is required!",
        })
            .optional(),
        bookingId: zod_1.z
            .string({
            required_error: "Booking id is required!",
        })
            .optional(),
    }),
});
exports.ReviewValidation = {
    createReviewZodSchema,
    updateReviewZodSchema,
};
