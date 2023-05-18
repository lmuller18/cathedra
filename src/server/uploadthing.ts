import { getServerSession } from "next-auth";

import type { FileRouter } from "uploadthing/next-legacy";
import { createUploadthing } from "uploadthing/next-legacy";

import { authOptions } from "./auth";

const f = createUploadthing();

// const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f
    // Set permissions and file types for this FileRoute
    .fileTypes(["image"])
    .maxSize("32MB")
    .middleware(async (req, res) => {
      const session = await getServerSession(req, res, authOptions);
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(() => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete");
    }),
  editKitImage: f
    .fileTypes(["image"])
    .maxSize("32MB")
    .middleware(async (req, res) => {
      const session = await getServerSession(req, res, authOptions);
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(() => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete");
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
