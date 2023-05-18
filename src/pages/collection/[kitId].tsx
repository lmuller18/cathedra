import {
  X,
  Pen,
  Trash,
  Loader2,
  PlusSquare,
  MinusSquare,
  MoreVertical,
} from "lucide-react";
import {
  useForm,
  Controller,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import type { FileWithPath } from "react-dropzone";
import type { Dispatch, SetStateAction } from "react";
import { useState, useEffect, useCallback } from "react";

import type { Kit } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

import {
  Table,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  TableHeader,
} from "~/ui/table";
import {
  TYPES,
  GRADES,
  SCALES,
  SERIES,
  STATUSES,
  getTypeByCode,
  getGradeByCode,
  getScaleByCode,
  getSeriesByCode,
  getStatusByCode,
} from "~/lib/utils";
import {
  Select,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "~/ui/select";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "~/ui/dropdown-menu";
import { api } from "~/utils/api";
import Nav from "~/components/nav";
import { Badge } from "~/ui/badge";
import { Input } from "~/ui/input";
import { Button } from "~/ui/button";
import { AspectRatio } from "~/ui/aspect-ratio";
import type { RouterInputs } from "~/utils/api";
import { getServerAuthSession } from "~/server/auth";
import { UpdateKitKitSchema } from "~/lib/server-types";
import { ScrollBar, ScrollArea } from "~/ui/scroll-area";
import type { UploadRouter } from "~/server/uploadthing";
import UploadDropzone from "~/components/upload-dropzone";
import { Card, CardTitle, CardHeader, CardDescription } from "~/ui/card";

const { useUploadThing } = generateReactHelpers<UploadRouter>();

const KitPage: NextPage = () => {
  const router = useRouter();
  const { kitId } = router.query as { kitId: string };

  const { data: kit, isLoading } = api.kit.getById.useQuery(kitId, {
    enabled: !!kitId,
  });
  const { data: relatedKits, isLoading: isLoadingRelated } =
    api.kit.getRelated.useQuery(kitId, {
      enabled: !!kitId,
    });

  if (isLoading) return <div>...loading</div>;
  if (!kit) return <div>kit not found</div>;
  return (
    <div>
      <Nav />

      <div className="sm:pt-8">
        <KitDetails kit={kit}></KitDetails>

        <div className="container mt-6">
          <h2 className="mb-4 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Related Kits
          </h2>

          {!isLoadingRelated && (!relatedKits || relatedKits.length === 0) && (
            <Card className="max-w-[300px]">
              <CardHeader>
                <CardTitle>No Related Kits Found</CardTitle>
                <CardDescription>
                  No kits were found with similar grades or series.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <div className="relative">
            <ScrollArea>
              <div className="flex space-x-4 pb-4">
                {relatedKits?.map((kit) => (
                  <div
                    className="w-[160px] space-y-3 sm:w-[250px]"
                    key={kit.id}
                  >
                    <Link href={`/collection/${kit.id}`}>
                      <div className="overflow-hidden rounded-md">
                        <Image
                          src={kit.image ?? "/images/gundam-placeholder.png"}
                          alt={kit.name}
                          width={250}
                          height={330}
                          className="aspect-square h-auto w-auto bg-muted-foreground object-cover transition-all hover:scale-105"
                        />
                      </div>
                    </Link>
                    <div className="space-y-1 text-sm">
                      <Link href={`/collection/${kit.id}`}>
                        <h3 className="line-clamp-1 font-medium leading-none">
                          {kit.name}
                        </h3>
                      </Link>
                      <div className="flex gap-2">
                        <Badge>
                          {kit.grade} {kit.scale}
                        </Badge>
                        <Badge variant="secondary">
                          {getStatusByCode(kit.status)?.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

interface KitDetailsProps {
  kit: Kit;
}

const KitDetails = (props: KitDetailsProps) => {
  const utils = api.useContext();
  const [editing, setEditing] = useState(false);

  const methods = useForm<RouterInputs["kit"]["updateKit"]["kit"]>({
    defaultValues: {
      grade: props.kit.grade,
      name: props.kit.name,
      scale: props.kit.scale,
      series: props.kit.series,
      status: props.kit.status,
      type: props.kit.type,
    },
    resolver: zodResolver(UpdateKitKitSchema),
  });

  const { mutate, isLoading: isSubmitting } = api.kit.updateKit.useMutation({
    onSuccess() {
      setEditing(false);
      void utils.kit.invalidate();
    },
  });

  const onSubmit = (data: RouterInputs["kit"]["updateKit"]["kit"]) => {
    mutate({
      id: props.kit.id,
      kit: data,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:container sm:grid-cols-12">
      <div className="sm:col-span-5">
        {!editing ? (
          <AspectRatio
            ratio={4 / 3}
            className="overflow-hidden rounded-sm bg-muted-foreground"
          >
            <Image
              fill
              src={props.kit.image ?? "/images/gundam-placeholder.png"}
              className="object-cover"
              alt={props.kit.name}
            />
          </AspectRatio>
        ) : (
          <EditKitImage
            image={props.kit.image ?? "/images/gundam-placeholder.png"}
            kitId={props.kit.id}
            setEditing={setEditing}
          />
        )}
      </div>
      <FormProvider {...methods}>
        <form
          className="px-4 sm:col-span-7 sm:px-0"
          onSubmit={(e) => {
            if (editing) {
              void methods.handleSubmit(onSubmit, (err) => console.error(err))(
                e
              );
            }
          }}
        >
          {!editing ? (
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {props.kit.name}
            </h1>
          ) : (
            <Input
              id="name"
              {...methods.register("name")}
              placeholder="Kit name"
              className="mt-4 sm:mt-0"
            />
          )}

          <KitDetailsTable
            kit={props.kit}
            editing={editing}
            setEditing={setEditing}
          />

          {editing && (
            <div className="mt-2 flex flex-col-reverse flex-wrap gap-2 sm:flex-row sm:justify-end sm:px-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setEditing(false);
                  methods.reset();
                }}
              >
                Discard Changes
              </Button>
              <Button variant="default" type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
};

interface EditKitImageProps {
  kitId: string;
  image: string;
  setEditing: Dispatch<SetStateAction<boolean>>;
}

const EditKitImage = (props: EditKitImageProps) => {
  const utils = api.useContext();
  const [editingImage, setEditingImage] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const { startUpload, permittedFileInfo, isUploading } = useUploadThing({
    endpoint: "editKitImage",
  });

  const { mutate, isLoading } = api.kit.updateKitImage.useMutation();
  const [preview, setPreview] = useState<string | null>(null);
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      if (preview) URL.revokeObjectURL(preview);
      setFiles(acceptedFiles);
    },
    [preview]
  );

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

  const submitImage = async () => {
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
        id: props.kitId,
        imageUrl: image.fileUrl,
      },
      {
        onSuccess() {
          setEditingImage(false);
          props.setEditing(false);
          return utils.kit.invalidate();
        },
      }
    );
  };

  if (!editingImage)
    return (
      <AspectRatio
        ratio={4 / 3}
        className="relative overflow-hidden rounded-sm bg-muted-foreground"
      >
        <Image
          fill
          src={props.image}
          className="object-cover"
          alt="Editable kit image"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
          <Button onClick={() => setEditingImage(true)}>Change Image</Button>
        </div>
      </AspectRatio>
    );

  return (
    <div>
      <div className="relative">
        <AspectRatio ratio={4 / 3}>
          {preview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
              <img src={preview} className="h-full w-full object-cover" />

              <button
                type="button"
                onClick={() => setFiles([])}
                className="absolute right-1 top-1 rounded-full bg-black/25 p-1 transition-colors hover:bg-black/40 active:bg-black/40"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <UploadDropzone
              onDrop={onDrop}
              permittedFileInfo={permittedFileInfo}
            />
          )}
        </AspectRatio>
      </div>

      {files[0] && (
        <div className="mt-2 flex flex-col px-4 sm:flex-row sm:justify-end sm:px-0">
          <Button
            disabled={isUploading || isLoading}
            onClick={() => void submitImage()}
          >
            Save Image
          </Button>
        </div>
      )}
    </div>
  );
};

interface KitDetailsTableProps {
  kit: Kit;
  setEditing: Dispatch<SetStateAction<boolean>>;
  editing: boolean;
}

const KitDetailsTable = (props: KitDetailsTableProps) => {
  const { control } = useFormContext<RouterInputs["kit"]["updateKit"]["kit"]>();

  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold">Kit Info</TableHead>
          <TableHead className="text-right">
            <KitActions
              kit={props.kit}
              editing={props.editing}
              setEditing={props.setEditing}
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-bold">Grade</TableCell>
          {!props.editing ? (
            <TableCell>{getGradeByCode(props.kit.grade)?.label}</TableCell>
          ) : (
            <TableCell>
              <Controller
                control={control}
                name="grade"
                render={({ field: { ref: _ref, onChange, ...rest } }) => (
                  <Select onValueChange={onChange} {...rest}>
                    <SelectTrigger>
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
            </TableCell>
          )}
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Series</TableCell>
          {!props.editing ? (
            <TableCell>{getSeriesByCode(props.kit.series)?.name}</TableCell>
          ) : (
            <TableCell>
              <Controller
                control={control}
                name="series"
                render={({ field: { ref: _ref, onChange, ...rest } }) => (
                  <Select onValueChange={onChange} {...rest}>
                    <SelectTrigger>
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
            </TableCell>
          )}
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Scale</TableCell>
          {!props.editing ? (
            <TableCell>{getScaleByCode(props.kit.scale)?.label}</TableCell>
          ) : (
            <TableCell>
              <Controller
                control={control}
                name="scale"
                render={({ field: { ref: _ref, onChange, ...rest } }) => (
                  <Select onValueChange={onChange} {...rest}>
                    <SelectTrigger>
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
            </TableCell>
          )}
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Type</TableCell>
          {!props.editing ? (
            <TableCell>{getTypeByCode(props.kit.type)?.label}</TableCell>
          ) : (
            <TableCell>
              <Controller
                control={control}
                name="type"
                render={({ field: { ref: _ref, onChange, ...rest } }) => (
                  <Select onValueChange={onChange} {...rest}>
                    <SelectTrigger>
                      <SelectValue id="type" placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Type</SelectLabel>
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
            </TableCell>
          )}
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Status</TableCell>
          {!props.editing ? (
            <TableCell>{getStatusByCode(props.kit.status)?.label}</TableCell>
          ) : (
            <TableCell>
              <Controller
                control={control}
                name="status"
                render={({ field: { ref: _ref, onChange, ...rest } }) => (
                  <Select onValueChange={onChange} {...rest}>
                    <SelectTrigger>
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
            </TableCell>
          )}
        </TableRow>
      </TableBody>
    </Table>
  );
};

interface KitActionsProps {
  kit: Kit;
  setEditing: Dispatch<SetStateAction<boolean>>;
  editing: boolean;
}

const KitActions = (props: KitActionsProps) => {
  const router = useRouter();
  const utils = api.useContext();

  const { mutate: addToBacklog, isLoading: addingToBacklog } =
    api.kit.addToBacklog.useMutation({
      onSuccess() {
        return utils.kit.invalidate();
      },
    });

  const { mutate: removeFromBacklog, isLoading: removingFromBacklog } =
    api.kit.removeFromBacklog.useMutation({
      onSuccess() {
        return utils.kit.invalidate();
      },
    });

  const { mutate: deleteKit, isLoading: isDeleting } =
    api.kit.deleteKit.useMutation({
      onSuccess() {
        void utils.kit.invalidate();
        void router.push("/collection");
      },
    });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => props.setEditing(true)}>
          <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Edit Kit
        </DropdownMenuItem>
        {props.kit.status === "OWNED" && props.kit.type === "MODEL" ? (
          props.kit.backlogOrder == null ? (
            <DropdownMenuItem
              onClick={() => addToBacklog(props.kit.id)}
              disabled={addingToBacklog}
            >
              <PlusSquare className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Backlog
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => removeFromBacklog(props.kit.id)}
              disabled={removingFromBacklog}
            >
              <MinusSquare className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Backlog
            </DropdownMenuItem>
          )
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="group focus:bg-destructive focus:text-destructive-foreground"
          onClick={() => deleteKit(props.kit.id)}
          disabled={isDeleting}
        >
          <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70 group-focus:text-destructive-foreground" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const getServerSideProps = async ({
  req,
  res,
}: CreateNextContextOptions) => {
  const session = await getServerAuthSession({ req, res });

  if (!session?.user) {
    const params = `?callbackUrl=${encodeURIComponent("/collection")}`;
    return {
      redirect: { destination: `/auth/signin${params}` },
    };
  }

  return { props: { session } };
};

export default KitPage;
