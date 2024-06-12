import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(4, "Username must be atleast 4 characters")
    .max(15, "Username must be no more than 15 character")
    .regex(/^[a-zA-Z0-9_]+$/, "Username nust not contain special character")




export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address" }),
    password: z.string().min(6, {message: "Password must be at least 6 characters"})
})    