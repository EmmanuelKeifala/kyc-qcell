import { z } from "zod";

export const loginSchema = z.object({
  phone: z
    .string()
    .length(10, "Phone Number must be 10 digits")
    .regex(/^\d+$/, "Phone Number must contain only digits"),
  email: z.string().email("Invalid email address"),
});
