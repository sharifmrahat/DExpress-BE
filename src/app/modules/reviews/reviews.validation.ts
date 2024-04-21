import { z } from "zod";
const createReviewZodSchema = z.object({
  body: z.object({
    bookingId: z.string({
      required_error: "BookingId is required!",
    }),
    rating: z
      .number({
        required_error: "Rating is required!",
      })
      .transform((value) => value.toFixed(1)),
    description: z.string().optional(),
    imageUrls: z.array(z.string()).optional(),
  }),
});

const updateReviewZodSchema = z.object({
  body: z.object({
    rating: z
      .number()
      .transform((value) => value.toFixed(1))
      .optional(),
    description: z.string().optional(),
    imageUrls: z.array(z.string()).optional(),
  }),
});

export const ReviewValidation = {
  createReviewZodSchema,
  updateReviewZodSchema,
};
