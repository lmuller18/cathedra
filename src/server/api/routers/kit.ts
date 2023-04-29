import { Prisma } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const kitRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure
    .input(
      z
        .object({
          grades: z.string().array().optional(),
          scales: z.string().array().optional(),
          series: z.string().array().optional(),
          statuses: z.string().array().optional(),
        })
        .optional()
    )
    .query(({ ctx, input }) => {
      console.log(input);

      return ctx.prisma.kit.findMany({
        where: input
          ? {
              grade: input.grades?.length ? { in: input.grades } : undefined,
              scale: input.scales?.length ? { in: input.scales } : undefined,
              series: input.series?.length ? { in: input.series } : undefined,
              status: input.statuses?.length
                ? { in: input.statuses }
                : undefined,
            }
          : {},
      });
    }),
  getFilterOptions: publicProcedure.query(async ({ ctx }) => {
    const [grades, scales, series, statuses] = await Promise.all([
      ctx.prisma.kit.groupBy({ by: ["grade"] }),
      ctx.prisma.kit.groupBy({ by: ["scale"] }),
      ctx.prisma.kit.groupBy({ by: ["series"] }),
      ctx.prisma.kit.groupBy({ by: ["status"] }),
    ]);

    return {
      grades: grades.map((g) => g.grade),
      scales: scales.map((s) => s.scale),
      series: series.map((s) => s.series),
      statuses: statuses.map((s) => s.status),
    };
  }),
  createKit: publicProcedure
    .input(
      z.object({
        name: z.string(),
        grade: z.string(),
        scale: z.string(),
        status: z.string(),
        image: z.string().nullable().optional(),
        series: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      console.log("in create kit", input);
      return ctx.prisma.kit.create({
        data: {
          ...input,
          userId: "user-1",
        },
      });
    }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
