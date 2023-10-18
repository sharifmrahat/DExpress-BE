import { z } from "zod";
const createLorryZodSchema = z.object({
  body: z.object({
    model: z.string({
      required_error: "Model is required!",
    }),
    type: z.string({
      required_error: "Type is required!",
    }),
    plateNumber: z.string({
      required_error: "Plate Number is required!",
    }),
    price: z.number({
      required_error: "Price is required!",
    }),
    categoryId: z.string({
      required_error: "Category Id is required!",
    }),
    imageUrl: z
      .string({
        required_error: "image is required!",
      })
      .optional(),
  }),
});

const updateLorryZodSchema = z.object({
  body: z.object({
    model: z
      .string({
        required_error: "Model is required!",
      })
      .optional(),
    type: z
      .string({
        required_error: "Type is required!",
      })
      .optional(),
    plateNumber: z
      .string({
        required_error: "Plate Number is required!",
      })
      .optional(),
    price: z
      .number({
        required_error: "Price is required!",
      })
      .optional(),
    categoryId: z
      .string({
        required_error: "Category Id is required!",
      })
      .optional(),
    imageUrl: z
      .string({
        required_error: "image is required!",
      })
      .optional(),
  }),
});

export const LorryValidation = {
  createLorryZodSchema,
  updateLorryZodSchema,
};
