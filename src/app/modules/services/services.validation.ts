import { z } from "zod";

const createUpdateServiceValidation = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required!",
    }),
    imageUrl: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const ServiceValidation = {
  createUpdateServiceValidation,
};
