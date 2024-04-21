import { z } from "zod";
const loginAuthZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required!",
    }),
    password: z.string({
      required_error: "password is required!",
    }),
  }),
});

const signupAuthZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required!",
    }),
    email: z
      .string({
        required_error: "Email is required!",
      })
      .email(),
    password: z.string({
      required_error: "Password is required!",
    }),
    imageUrl: z.string().optional(),
  }),
});

const socialAuthZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z
      .string({
        required_error: "Email is required!",
      })
      .email(),
    imageUrl: z.string().optional(),
  }),
});

export const AuthValidation = {
  signupAuthZodSchema,
  loginAuthZodSchema,
  socialAuthZodSchema,
};
