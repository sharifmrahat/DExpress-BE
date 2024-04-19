import { z } from "zod";
const createFeedbackZodSchema = z.object({
  body: z.object({
    subject: z.string({
      required_error: "Subject is required!",
    }),
    message: z.string({
      required_error: "Message is required!",
    }),
    attachments: z.array(
      z.string({
        required_error: "Attachments is required!",
      })
    ),
    userId: z.string({
      required_error: "UserId is required!",
    }),
  }),
});

const updateFeedbackZodSchema = z.object({
  body: z.object({
    subject: z.string().optional(),
    message: z.string().optional(),
    attachments: z.array(z.string()).optional(),
    userId: z.string().optional(),
    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const FeedbackValidation = {
  createFeedbackZodSchema,
  updateFeedbackZodSchema,
};
