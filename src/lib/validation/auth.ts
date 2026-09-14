import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().min(1).email(),
  password: z.string().min(1),
});

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().min(1).email(),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?962|0)?7[789]\d{7}$/, {
      message: "invalid_phone",
    }),
  password: z.string().min(8).max(72),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1).email(),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8).max(72),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
