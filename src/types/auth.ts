import { registerSchema, updateProfileSchema } from "@/validation/authSchemas";
import { z } from "zod";

export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
