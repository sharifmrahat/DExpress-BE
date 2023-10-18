import { z } from "zod";
const createReviewZodSchema = z.object({
  body: z.object({
    review: z.string({
      required_error: "review is required!",
    }),
    rating: z.number({
      required_error: "rating is required!",
    }),
    bookingId: z.string({
      required_error: "Booking id is required!",
    }),
  }),
});

const updateReviewZodSchema = z.object({
  body: z.object({
    review: z
      .string({
        required_error: "review is required!",
      })
      .optional(),
    rating: z
      .number({
        required_error: "rating is required!",
      })
      .optional(),
    bookingId: z
      .string({
        required_error: "Booking id is required!",
      })
      .optional(),
  }),
});

export const ReviewValidation = {
  createReviewZodSchema,
  updateReviewZodSchema,
};
