import { z } from "zod";
const createFeedbackZodSchema = z.object({
  body: z.object({
    topic: z.string({
      required_error: "Topic is required!",
    }),
    message: z.string({
      required_error: "Message is required!",
    }),
  }),
});

const updateFeedbackZodSchema = z.object({
  body: z.object({
    topic: z
      .string({
        required_error: "Topic is required!",
      })
      .optional(),
    message: z
      .string({
        required_error: "Message is required!",
      })
      .optional(),
  }),
});

export const FeedbackValidation = {
  createFeedbackZodSchema,
  updateFeedbackZodSchema,
};
