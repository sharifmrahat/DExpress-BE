import { z } from "zod";

const createPackageValidation = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required!",
    }),
    price: z.number({
      required_error: "Price is required!",
    }),
    serviceId: z.string({
      required_error: "ServiceId is required!",
    }),
    imageUrl: z.string().url().optional(),
    description: z.string().optional(),
    unit: z.string().optional(),
  }),
});

const updatePackageValidation = z.object({
  body: z.object({
    title: z.string().optional(),
    price: z.number().optional(),
    serviceId: z.string().optional(),
    imageUrl: z.string().url().optional(),
    description: z.string().optional(),
    unit: z.string().optional(),
    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const PackageValidation = {
  createPackageValidation,
  updatePackageValidation,
};
