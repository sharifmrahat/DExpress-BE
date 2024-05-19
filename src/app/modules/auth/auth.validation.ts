import { z } from "zod";
const loginAuthZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required!",
      })
      .email()
      .transform((val) => val.trim().toLowerCase()),
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
      .email()
      .transform((val) => val.trim().toLowerCase()),
    password: z.string({
      required_error: "Password is required!",
    }),
  }),
});

const socialAuthZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required!",
    }),
    email: z
      .string({
        required_error: "Email is required!",
      })
      .email()
      .transform((val) => val.trim().toLowerCase()),
    imageUrl: z.string().url().optional(),
  }),
});

const verifyEmailZodSchema = z.object({
  body: z.object({
    otp: z.string({
      required_error: "OTP is required!",
    }),
  }),
});

export const AuthValidation = {
  signupAuthZodSchema,
  loginAuthZodSchema,
  socialAuthZodSchema,
  verifyEmailZodSchema,
};
