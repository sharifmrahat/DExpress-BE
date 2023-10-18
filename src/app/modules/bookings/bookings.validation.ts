import { z } from "zod";
const createBookingZodSchema = z.object({
  body: z.object({
    startTime: z.string({
      required_error: "Start time and date is required!",
    }),
    endTime: z.string({
      required_error: "End time and date is required!",
    }),
    lorryId: z.string({
      required_error: "End time and date is required!",
    }),
  }),
});

const updateBookingZodSchema = z.object({
  body: z.object({
    startTime: z
      .string({
        required_error: "Start time and date is required!",
      })
      .optional(),
    endTime: z
      .string({
        required_error: "End time and date is required!",
      })
      .optional(),
    lorryId: z
      .string({
        required_error: "End time and date is required!",
      })
      .optional(),
    status: z
      .enum(["Pending", "Booked", "Cancelled", "Rejected", "Completed"], {
        required_error: "End time and date is required!",
      })
      .optional(),
  }),
});

export const BookingValidation = {
  createBookingZodSchema,
  updateBookingZodSchema,
};
