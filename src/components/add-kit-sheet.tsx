import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useRouter } from "next/router";
import type { FileWithPath } from "react-dropzone";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect, useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { generateReactHelpers } from "@uploadthing/react/hooks";

import { api } from "~/utils/api";
import type { RouterInputs } from "~/utils/api";
import { CreateKitSchema } from "~/lib/server-types";
import type { UploadRouter } from "~/server/uploadthing";
import { TYPES, GRADES, SCALES, SERIES, STATUSES } from "~/lib/utils";

import {
  Sheet,
  SheetTitle,
  SheetFooter,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetDescription,
} from "./ui/sheet";
import {
  Select,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "./ui/select";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import UploadDropzone from "./upload-dropzone";
import { AspectRatio } from "./ui/aspect-ratio";

const { useUploadThing } = generateReactHelpers<UploadRouter>();

interface AddKitProps {
  children: ReactNode;
}

const AddKitSheet = (props: AddKitProps) => {
  const router = useRouter();
  const utils = api.useContext();

  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string | null>(null);

  const { startUpload, permittedFileInfo } = useUploadThing({
    endpoint: "imageUploader",
  });

  const { mutate } = api.kit.createKit.useMutation({
    onSuccess() {
      handleOpenChange(false);
      return utils.kit.invalidate();
    },
  });

  const { register, handleSubmit, control, formState, reset } = useForm<
    RouterInputs["kit"]["createKit"]
  >({
    resolver: zodResolver(CreateKitSchema.omit({ image: true })),
    defaultValues: {
      type: "MODEL",
    },
  });

  useEffect(() => {
    if (files.length > 0 && files[0] != null) {
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setPreview(null);
    }
  }, [files]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onSubmit = async (data: RouterInputs["kit"]["updateKit"]["kit"]) => {
    try {
      const response = await startUpload(files);
      if (!response) {
        console.error("No image upload response");
        return;
      }

      const image = response[0];
      if (!image) {
        console.error("No image in response");
        return;
      }

      mutate(
        {
          ...data,
          image: image.fileUrl,
        },
        {
          onSuccess(data) {
            void router.push(`/collection/${data.id}`);
          },
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenChange = (o: boolean) => {
    if (!o) reset();
    setOpen(o);
  };

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      if (preview) URL.revokeObjectURL(preview);
      setFiles(acceptedFiles);
    },
    [preview]
  );

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{props.children}</SheetTrigger>
      <SheetContent position="right" className="w-full sm:w-[420px]">
        <SheetHeader>
          <SheetTitle>Add kit</SheetTitle>
          <SheetDescription>
            Add a gundam kit to your collection. Click save when you&apos;re
            done.
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={(e) =>
            void handleSubmit(onSubmit, (err) => console.error(err))(e)
          }
        >
          <div className="grid gap-4 py-4">
            {preview ? (
              <div className="relative">
                <AspectRatio ratio={4 / 3}>
                  {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
                  <img src={preview} className="h-full w-full object-cover" />
                </AspectRatio>

                <button
                  type="button"
                  onClick={() => setFiles([])}
                  className="absolute right-1 top-1 rounded-full bg-black/25 p-1 transition-colors hover:bg-black/40 active:bg-black/40"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <UploadDropzone
                onDrop={onDrop}
                permittedFileInfo={permittedFileInfo}
              />
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Kit name"
                className="col-span-3"
              />
            </div>
            {formState.errors.name && (
              <div className="-mt-2 grid grid-cols-4 items-center gap-4">
                <span className="col-span-3 col-start-2 text-sm text-destructive-foreground">
                  {formState.errors.name.message}
                </span>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="grade" className="text-right">
                Grade
              </Label>
              <Controller
                control={control}
                name="grade"
                render={({ field: { ref: _ref, onChange, ...rest } }) => (
                  <Select onValueChange={onChange} {...rest}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue id="grade" placeholder="Select a grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Grades</SelectLabel>
                        {GRADES.map((grades) => (
                          <SelectItem key={grades.code} value={grades.code}>
                            {grades.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {formState.errors.grade && (
              <div className="-mt-2 grid grid-cols-4 items-center gap-4">
                <span className="col-span-3 col-start-2 text-sm text-destructive-foreground">
                  {formState.errors.grade.message}
                </span>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="series" className="text-right">
                Series
              </Label>
              <Controller
                control={control}
                name="series"
                render={({ field: { ref: _ref, onChange, ...rest } }) => (
                  <Select onValueChange={onChange} {...rest}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue id="series" placeholder="Select a series" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Series</SelectLabel>
                        {SERIES.map((series) => (
                          <SelectItem key={series.code} value={series.code}>
                            {series.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {formState.errors.series && (
              <div className="-mt-2 grid grid-cols-4 items-center gap-4">
                <span className="col-span-3 col-start-2 text-sm text-destructive-foreground">
                  {formState.errors.series.message}
                </span>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="scale" className="text-right">
                Scale
              </Label>
              <Controller
                control={control}
                name="scale"
                render={({ field: { ref: _ref, onChange, ...rest } }) => (
                  <Select onValueChange={onChange} {...rest}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue id="scale" placeholder="Select a scale" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Scales</SelectLabel>
                        {SCALES.map((scale) => (
                          <SelectItem key={scale.code} value={scale.code}>
                            {scale.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {formState.errors.scale && (
              <div className="-mt-2 grid grid-cols-4 items-center gap-4">
                <span className="col-span-3 col-start-2 text-sm text-destructive-foreground">
                  {formState.errors.scale.message}
                </span>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Controller
                control={control}
                name="type"
                render={({ field: { ref: _ref, onChange, ...rest } }) => (
                  <Select onValueChange={onChange} {...rest}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue id="type" placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Types</SelectLabel>
                        {TYPES.map((type) => (
                          <SelectItem key={type.code} value={type.code}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {formState.errors.type && (
              <div className="-mt-2 grid grid-cols-4 items-center gap-4">
                <span className="col-span-3 col-start-2 text-sm text-destructive-foreground">
                  {formState.errors.type.message}
                </span>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Status" className="text-right">
                Status
              </Label>
              <Controller
                control={control}
                name="status"
                render={({ field: { ref: _ref, onChange, ...rest } }) => (
                  <Select onValueChange={onChange} {...rest}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue id="status" placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        {STATUSES.map((status) => (
                          <SelectItem key={status.code} value={status.code}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {formState.errors.status && (
              <div className="-mt-2 grid grid-cols-4 items-center gap-4">
                <span className="col-span-3 col-start-2 text-sm text-destructive-foreground">
                  {formState.errors.status.message}
                </span>
              </div>
            )}
          </div>

          <SheetFooter>
            <Button type="submit" disabled={files.length === 0}>
              Create Kit
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AddKitSheet;
