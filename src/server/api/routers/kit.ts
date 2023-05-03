import { z } from "zod";
import { CreateKitSchema, UpdateKitSchema } from "~/lib/server-types";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const kitRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z
        .object({
          grades: z.string().array().optional(),
          scales: z.string().array().optional(),
          series: z.string().array().optional(),
          statuses: z.string().array().optional(),
          page: z.number().optional(),
          pageSize: z.number().optional(),
          includeBacklog: z.boolean().optional(),
        })
        .optional()
    )
    .query(({ ctx, input }) => {
      // default page size IF pagination is requested
      const DEFAULT_PAGE_SIZE = 10;

      let pageInput = {};
      if (input?.page != null || input?.pageSize != null) {
        const pageSize = input.pageSize ?? DEFAULT_PAGE_SIZE;
        const page = input.page ?? 0;
        pageInput = {
          take: pageSize,
          skip: pageSize * page,
        };
      }

      return ctx.prisma.kit.findMany({
        where: input
          ? {
              userId: ctx.session.user.id,
              grade: input.grades?.length ? { in: input.grades } : undefined,
              scale: input.scales?.length ? { in: input.scales } : undefined,
              series: input.series?.length ? { in: input.series } : undefined,
              status: input.statuses?.length
                ? { in: input.statuses }
                : undefined,
              backlogOrder:
                input.includeBacklog != null || input.includeBacklog
                  ? undefined
                  : { equals: null },
            }
          : { userId: ctx.session.user.id },
        ...pageInput,
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
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.kit.findFirst({
      where: { id: input, userId: ctx.session.user.id },
    });
  }),
  createKit: protectedProcedure
    .input(CreateKitSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.kit.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),
  updateKit: protectedProcedure
    .input(UpdateKitSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.kit.update({
        where: { id: input.id },
        data: {
          ...input.kit,
          userId: ctx.session.user.id,
        },
      });
    }),
  getBacklog: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.kit.findMany({
      where: {
        status: "OWNED",
        backlogOrder: { not: null },
        userId: ctx.session.user.id,
      },
      orderBy: { backlogOrder: "asc" },
    });
  }),
  deleteKit: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.kit.deleteMany({
      where: { id: input, userId: ctx.session.user.id },
    });
  }),
});
