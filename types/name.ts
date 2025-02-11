import {z} from "zod";

export const NameFormSchema = z.object({
    fullName: z.string().min(2).max(200),
    gender: z.string().max(200).optional(),
    description: z.string().max(200).optional(),
});

export type NameFormType = z.infer<typeof NameFormSchema>;
