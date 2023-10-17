import { z } from "zod";

const createUserValidation = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required!",
    }),
    email: z
      .string({
        required_error: "Email is required!",
      })
      .email(),
    password: z
      .string({
        required_error: "Password is required!",
      })
      .optional(),
    role: z.string().optional(),
    contactNo: z.string().optional(),
    address: z.string().optional(),
  }),
});

const updateUserValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().optional(),
    role: z.string().optional(),
    contactNo: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const UserValidation = {
  createUserValidation,
  updateUserValidation,
};
