"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LorryValidation = void 0;
const zod_1 = require("zod");
const createLorryZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        model: zod_1.z.string({
            required_error: "Model is required!",
        }),
        type: zod_1.z.string({
            required_error: "Type is required!",
        }),
        plateNumber: zod_1.z.string({
            required_error: "Plate Number is required!",
        }),
        price: zod_1.z.number({
            required_error: "Price is required!",
        }),
        categoryId: zod_1.z.string({
            required_error: "Category Id is required!",
        }),
        imageUrl: zod_1.z
            .string({
            required_error: "image is required!",
        })
            .optional(),
    }),
});
const updateLorryZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        model: zod_1.z
            .string({
            required_error: "Model is required!",
        })
            .optional(),
        type: zod_1.z
            .string({
            required_error: "Type is required!",
        })
            .optional(),
        plateNumber: zod_1.z
            .string({
            required_error: "Plate Number is required!",
        })
            .optional(),
        price: zod_1.z
            .number({
            required_error: "Price is required!",
        })
            .optional(),
        categoryId: zod_1.z
            .string({
            required_error: "Category Id is required!",
        })
            .optional(),
        imageUrl: zod_1.z
            .string({
            required_error: "image is required!",
        })
            .optional(),
    }),
});
exports.LorryValidation = {
    createLorryZodSchema,
    updateLorryZodSchema,
};
