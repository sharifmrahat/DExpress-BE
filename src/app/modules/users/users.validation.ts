import { z } from "zod";

const createUserValidation = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required!",
      })
      .trim(),
    email: z
      .string({
        required_error: "Email is required!",
      })
      .email()
      .transform((val) => val.trim().toLowerCase()),
    password: z.string({
      required_error: "Password is required!",
    }),
    role: z.string().optional(),
    contactNo: z.string().optional(),
    addresses: z.array(z.string()).optional(),
    imageUrl: z.string().url().optional(),
  }),
});

const updateProfileValidation = z.object({
  body: z.object({
    name: z.string().trim().optional(),
    email: z
      .string()
      .email()
      .transform((val) => val.trim().toLowerCase())
      .optional(),
    contactNo: z.string().optional(),
    addresses: z.array(z.string()).optional(),
    imageUrl: z.string().url().optional(),
  }),
});

const updateUserValidation = z.object({
  body: z.object({
    name: z.string().trim().optional(),
    email: z
      .string()
      .email()
      .transform((val) => val.trim().toLowerCase())
      .optional(),
    role: z.string().optional(),
    contactNo: z.string().optional(),
    addresses: z.array(z.string()).optional(),
    imageUrl: z.string().url().optional(),
  }),
});

const updatePasswordValidation = z.object({
  body: z.object({
    password: z.string().optional(),
    newPassword: z.string(),
  }),
});

export const UserValidation = {
  createUserValidation,
  updateUserValidation,
  updatePasswordValidation,
  updateProfileValidation,
};
