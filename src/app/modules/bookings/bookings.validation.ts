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
    deliveryDate: z
      .string({
        required_error: "Delivery Date is required!",
      })
      .transform((str) => new Date(str)),
    shippingAddress: z.string({
      required_error: "Shipping Address is required!",
    }),
    billingAddress: z.string({
      required_error: "Billing Address is required!",
    }),
    remarks: z.string().optional(),
    paymentMethod: z
      .enum(["COD", "Stripe", "SSLCommerze"], {
        required_error: "Payment Method is required!",
      })
      .default("COD"),
    totalCost: z.number().optional().default(0),
    status: z.enum(["Drafted", "Created"]).default("Created").optional(),
  }),
});

const createQuotationZodSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: "UserId is required!",
    }),
    bookingType: z
      .enum(["Package", "Custom"], {
        required_error: "Booking type is required!",
      })
      .default("Package"),
    serviceId: z.string({
      required_error: "ServiceId is required!",
    }),
    packageId: z.string().optional(),
    deliveryDate: z
      .string({
        required_error: "Delivery Date is required!",
      })
      .transform((str) => new Date(str)),
    shippingAddress: z.string({
      required_error: "Shipping Address is required!",
    }),
    billingAddress: z.string({
      required_error: "Billing Address is required!",
    }),
    remarks: z.string().optional(),
    paymentMethod: z
      .enum(["COD", "Stripe", "SSLCommerze"], {
        required_error: "Payment Method is required!",
      })
      .default("COD"),
    totalCost: z.number().optional().default(0),
    status: z.enum(["Drafted", "Created"]).default("Created").optional(),
  }),
});

const updateBookingZodSchema = z.object({
  body: z.object({
    bookingType: z.enum(["Package", "Custom"]).optional(),
    packageId: z.string().optional(),
    deliveryDate: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    shippingAddress: z.string().optional(),
    billingAddress: z.string().optional(),
    remarks: z.string().optional(),
    paymentMethod: z.enum(["COD", "Stripe", "SSLCommerze"]).optional(),
    totalCost: z.number().optional().default(0),
  }),
});

const updateBookingStatusZodSchema = z.object({
  body: z.object({
    status: z.enum(
      [
        "Drafted",
        "Created",
        "Cancelled",
        "Reverted",
        "Confirmed",
        "Shipped",
        "Delivered",
      ],
      {
        required_error: "Status is required!",
      }
    ),
  }),
});

export const BookingValidation = {
  createBookingZodSchema,
  createQuotationZodSchema,
  updateBookingZodSchema,
  updateBookingStatusZodSchema,
};
