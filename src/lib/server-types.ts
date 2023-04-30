import { z } from "zod";

export const UpdateKitKitSchema = z.object({
  name: z.string(),
  grade: z.string(),
  scale: z.string(),
  status: z.string(),
  image: z.string().nullable().optional(),
  series: z.string(),
});

export const UpdateKitSchema = z.object({
  id: z.string(),
  kit: UpdateKitKitSchema,
});

export const CreateKitSchema = z.object({
  name: z.string(),
  grade: z.string(),
  scale: z.string(),
  status: z.string(),
  image: z.string().nullable().optional(),
  series: z.string(),
});
