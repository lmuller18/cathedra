/** server/uploadthing.ts */
import { createFilething, type FileRouter } from "uploadthing/server";
const f = createFilething();

// const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f
    // Set permissions and file types for this FileRoute
    .fileTypes(["image"])
    .maxSize("32MB")
    // .middleware(async (req) => {
    //   // This code runs on your server before upload
    //   const user = await auth(req);

    //   // If you throw, the user will not be able to upload
    //   if (!user) throw new Error("Unauthorized");

    //   // Whatever is returned here is accessible in onUploadComplete as `metadata`
    //   return { userId: user.id };
    // })
    .onUploadComplete(() => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete");
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
