import { z } from "zod";

import type { Kit, Prisma, PrismaClient } from "@prisma/client";

import {
  publicProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { CreateKitSchema, UpdateKitSchema } from "~/lib/server-types";

type PrismaContext = PrismaClient<
  Prisma.PrismaClientOptions,
  never,
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;

const getRelatedPriority = (
  kit: { series: string; grade: string },
  relatedKit: Kit
) => {
  if (kit.series === relatedKit.series && kit.grade === relatedKit.grade)
    return 3;
  if (kit.series === relatedKit.series) return 2;
  if (kit.grade === relatedKit.grade) return 1;
  return 0;
};

const removeFromBacklog = async (
  id: string,
  userId: string,
  prisma: PrismaContext
) => {
  const kit = await prisma.kit.findFirst({
    where: { id, userId },
  });

  if (!kit) return null;

  const updatedKit = await prisma.kit.update({
    where: { id: kit.id },
    data: { backlogOrder: null },
  });

  const backlog = await prisma.kit.findMany({
    where: {
      type: "MODEL",
      backlogOrder: { not: null },
      userId,
    },
    orderBy: { backlogOrder: "asc" },
  });

  await prisma.$transaction(
    backlog.map((kit, index) =>
      prisma.kit.update({
        where: { id: kit.id },
        data: { backlogOrder: index },
      })
    )
  );

  return updatedKit;
};

const getBacklog = async (userId: string, prisma: PrismaContext) => {
  return prisma.kit.findMany({
    where: {
      type: "MODEL",
      backlogOrder: { not: null },
      userId,
    },
    orderBy: { backlogOrder: "asc" },
  });
};

export const kitRouter = createTRPCRouter({
  getPaginated: protectedProcedure
    .input(
      z.object({
        grades: z.string().array().optional(),
        scales: z.string().array().optional(),
        series: z.string().array().optional(),
        statuses: z.string().array().optional(),
        types: z.string().array().optional(),
        includeBacklog: z.boolean().optional(),
        page: z.number().optional(),
        pageSize: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // default page size IF pagination is requested
      const DEFAULT_PAGE_SIZE = 10;

      let pageInput = {};
      const pageSize = input.pageSize ?? DEFAULT_PAGE_SIZE;
      const page = input.page ?? 0;
      pageInput = {
        take: pageSize,
        skip: pageSize * page,
      };

      const where = {
        userId: ctx.session.user.id,
        grade: input.grades?.length ? { in: input.grades } : undefined,
        scale: input.scales?.length ? { in: input.scales } : undefined,
        series: input.series?.length ? { in: input.series } : undefined,
        status: input.statuses?.length ? { in: input.statuses } : undefined,
        type: input.types?.length ? { in: input.types } : undefined,
        backlogOrder:
          input.includeBacklog != null || input.includeBacklog
            ? undefined
            : { equals: null },
      };

      const [kits, count] = await ctx.prisma.$transaction([
        ctx.prisma.kit.findMany({
          where,
          ...pageInput,
        }),
        ctx.prisma.kit.count({ where }),
      ]);
      return {
        kits,
        page,
        pageSize,
        totalElements: count,
        totalPages: Math.ceil(count / pageSize),
      };
    }),
  getAll: protectedProcedure
    .input(
      z
        .object({
          grades: z.string().array().optional(),
          scales: z.string().array().optional(),
          series: z.string().array().optional(),
          statuses: z.string().array().optional(),
          types: z.string().array().optional(),
          includeBacklog: z.boolean().optional(),
        })
        .optional()
    )
    .query(({ ctx, input }) => {
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
              type: input.types?.length ? { in: input.types } : undefined,
              backlogOrder:
                input.includeBacklog === false ? { equals: null } : undefined,
            }
          : { userId: ctx.session.user.id },
      });
    }),
  updateBacklogOrder: protectedProcedure
    .input(
      z.object({ id: z.string(), backlogOrder: z.number() }).array().min(1)
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(
        input.map((kit) =>
          ctx.prisma.kit.updateMany({
            where: { id: kit.id, userId: ctx.session.user.id },
            data: { backlogOrder: kit.backlogOrder },
          })
        )
      );
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
  updateKitImage: protectedProcedure
    .input(z.object({ id: z.string(), imageUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const kit = await ctx.prisma.kit.findUnique({
        where: { id: input.id },
        select: { userId: true },
      });

      if (!kit || kit.userId !== ctx.session.user.id) return;

      return ctx.prisma.kit.update({
        where: { id: input.id },
        data: { image: input.imageUrl },
      });
    }),
  updateKit: protectedProcedure
    .input(UpdateKitSchema)
    .mutation(async ({ ctx, input }) => {
      const kit = await ctx.prisma.kit.findUnique({
        where: { id: input.id },
        select: { userId: true },
      });

      if (!kit || kit.userId !== ctx.session.user.id) return;

      const updatedKit = await ctx.prisma.kit.update({
        where: { id: input.id },
        data: input.kit,
      });

      if (
        updatedKit.backlogOrder !== null &&
        updatedKit.status === "ASSEMBLED"
      ) {
        await removeFromBacklog(updatedKit.id, ctx.session.user.id, ctx.prisma);
      }

      return updatedKit;
    }),
  getBacklog: protectedProcedure.query(({ ctx }) => {
    return getBacklog(ctx.session.user.id, ctx.prisma);
  }),
  addToBacklog: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const count = await ctx.prisma.kit.count({
        where: { backlogOrder: { not: null }, userId: ctx.session.user.id },
      });

      return ctx.prisma.kit.updateMany({
        where: { id: input, userId: ctx.session.user.id },
        data: {
          backlogOrder: count,
        },
      });
    }),
  removeFromBacklog: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return removeFromBacklog(input, ctx.session.user.id, ctx.prisma);
    }),
  getRelated: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const kit = await ctx.prisma.kit.findFirst({
        where: { id: input, userId: ctx.session.user.id },
        select: { grade: true, series: true, type: true },
      });

      if (!kit) return [];

      const relatedDbKits = await ctx.prisma.kit.findMany({
        where: {
          userId: ctx.session.user.id,
          id: { not: input },
          type: kit.type,
          OR: [{ grade: kit.grade }, { series: kit.series }],
        },
      });

      return relatedDbKits.sort((a, b) => {
        const aPriority = getRelatedPriority(kit, a);
        const bPriority = getRelatedPriority(kit, b);
        return bPriority - aPriority;
      });
    }),
  deleteKit: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.kit.deleteMany({
      where: { id: input, userId: ctx.session.user.id },
    });
  }),
});
