import { z } from "zod";
import { CreateKitSchema, UpdateKitSchema } from "~/lib/server-types";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const kitRouter = createTRPCRouter({
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
    .input(CreateKitSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.kit.create({
        data: {
          ...input,
          userId: "user-1",
        },
      });
    }),
  updateKit: publicProcedure
    .input(UpdateKitSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.kit.update({
        where: { id: input.id },
        data: {
          ...input.kit,
          userId: "user-1",
        },
      });
    }),
});
