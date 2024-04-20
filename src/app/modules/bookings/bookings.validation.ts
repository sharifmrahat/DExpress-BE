import { z } from "zod";
const createBookingZodSchema = z.object({
  body: z.object({
    bookingType: z
      .enum(["Package", "Custom"], {
        required_error: "Booking type is required!",
      })
      .default("Package"),
    serviceId: z.string({
      required_error: "ServiceId is required!",
    }),
    packageId: z.string().optional(),
    departureDate: z.date({
      required_error: "Departure Date is required!",
    }),
    deliveryDate: z.date({
      required_error: "Delivery Date is required!",
    }),
    shippingAddress: z.string({
      required_error: "Shipping Address is required!",
    }),
    pickingAddress: z.string().optional(),
    remarks: z.string().optional(),
    paymentMethod: z
      .enum(["COD", "Stripe", "SSLCommerze"], {
        required_error: "Payment Method is required!",
      })
      .default("COD"),
  }),
});

const updateBookingZodSchema = z.object({
  body: z.object({
    bookingType: z.enum(["Package", "Custom"]).optional(),
    packageId: z.string().optional(),
    departureDate: z.date().optional(),
    deliveryDate: z.date().optional(),
    shippingAddress: z.string().optional(),
    pickingAddress: z.string().optional(),
    remarks: z.string().optional(),
    paymentMethod: z.enum(["COD", "Stripe", "SSLCommerze"]).optional(),
  }),
});

export const BookingValidation = {
  createBookingZodSchema,
  updateBookingZodSchema,
};
