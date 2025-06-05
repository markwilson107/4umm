import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Title must be less than 50 characters"),
  email: z.string().email("Email is not valid"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  avatar: z.enum(["marble", "beam", "pixel", "sunset", "ring", "bauhaus"], {
    message: "Avatar is not valid",
  }),
});

export const loginSchema = z.object({
  email: z.string().email("Email is not valid"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateProfileSchema =  z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Title must be less than 50 characters"),
  email: z.string().email("Email is not valid"),
  currentPassword: z.string().min(8, "Password must be at least 8 characters").nullable(),
  newPassword: z.string().min(8, "Password must be at least 8 characters").nullable(),
  avatar: z.enum(["marble", "beam", "pixel", "sunset", "ring", "bauhaus"], {
    message: "Avatar is not valid",
  }),
}).partial();
