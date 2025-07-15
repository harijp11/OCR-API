import { z } from "zod";

export const AadharDataSchema = z.object({
    name: z.string().min(1, "Name is required"),
    fatherName: z
        .string()
        .nullable()
        .optional()
        .refine(
            (val) => !val || val.trim().length >= 3,
            { message: "Father's name must be at least 3 characters if provided" }
        ),
    aadharNumber: z.string().regex(/^\d{4} \d{4} \d{4}$/, "Invalid Aadhaar number"),
    dob: z
        .string()
        .refine(
            (val) => /^\d{4}-\d{2}-\d{2}$/.test(val),
            { message: "Invalid date of birth format (yyyy-mm-dd)" }
        ),
    gender: z.enum(["Male", "Female", "Others"]),
    address: z.string().min(1, "Address is required")
});

export type AadharData = z.infer<typeof AadharDataSchema>;