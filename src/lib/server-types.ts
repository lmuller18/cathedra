import { z } from "zod";

export const UpdateKitKitSchema = z.object({
  name: z.string().min(1, { message: "Grade is required" }),
  grade: z
    .string({ required_error: "Grade is required" })
    .min(1, { message: "Grade is required" }),
  scale: z
    .string({ required_error: "Scale is required" })
    .min(1, { message: "Scale is required" }),
  status: z
    .string({ required_error: "Status is required" })
    .min(1, { message: "Status is required" }),
  image: z.string().nullable().optional(),
  series: z
    .string({ required_error: "Series is required" })
    .min(1, { message: "Series is required" }),
  type: z
    .string({ required_error: "Type is required" })
    .min(1, { message: "Type is required" }),
});

export const UpdateKitSchema = z.object({
  id: z.string(),
  kit: UpdateKitKitSchema,
});

export const CreateKitSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  grade: z
    .string({ required_error: "Grade is required" })
    .min(1, { message: "Grade is required" }),
  scale: z
    .string({ required_error: "Scale is required" })
    .min(1, { message: "Scale is required" }),
  status: z
    .string({ required_error: "Status is required" })
    .min(1, { message: "Status is required" }),
  image: z.string().nullable().optional(),
  series: z
    .string({ required_error: "Series is required" })
    .min(1, { message: "Series is required" }),
  type: z
    .string({ required_error: "Type is required" })
    .min(1, { message: "Type is required" }),
});
