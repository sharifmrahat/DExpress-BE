import { z } from "zod";

const createServiceValidation = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required!",
    }),
    imageUrl: z.string().url().optional(),
    description: z.string().optional(),
  }),
});

const updateServiceValidation = z.object({
  body: z.object({
    title: z.string().optional(),
    imageUrl: z.string().url().optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const ServiceValidation = {
  createServiceValidation,
  updateServiceValidation,
};
