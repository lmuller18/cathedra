import { createTRPCRouter } from "~/server/api/trpc";
import { kitRouter } from "~/server/api/routers/kit";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  kit: kitRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
