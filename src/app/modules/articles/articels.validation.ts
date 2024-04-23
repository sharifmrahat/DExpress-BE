import { z } from "zod";
const createArticleZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required!",
    }),
    description: z.string({
      required_error: "Description is required!",
    }),
    status: z.enum(["Drafted", "Published", "Archived"], {
      required_error: "Status is required!",
    }),
    thumbnail: z.string().optional(),
  }),
});

const updateArticleZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(["Drafted", "Published", "Archived"]).optional(),
    thumbnail: z.string().optional(),
    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const ArticleValidation = {
  createArticleZodSchema,
  updateArticleZodSchema,
};
