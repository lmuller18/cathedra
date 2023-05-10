import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { type NextPage } from "next";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { type Kit } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

import { UpdateKitKitSchema } from "~/lib/server-types";

import Nav from "~/components/nav";
import ProgressStepper from "~/components/progress-stepper";

import { type RouterInputs, api } from "~/utils/api";
import { getServerAuthSession } from "~/server/auth";
import {
  GRADES,
  SCALES,
  SERIES,
  STATUSES,
  getSeriesByCode,
  getStatusByCode,
} from "~/lib/utils";

import { Label } from "~/ui/label";
import { Badge } from "~/ui/badge";
import { Input } from "~/ui/input";
import { Button } from "~/ui/button";
import { Separator } from "~/ui/separator";
import { AspectRatio } from "~/ui/aspect-ratio";
import { ScrollArea, ScrollBar } from "~/ui/scroll-area";
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
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetFooter,
  SheetContent,
  SheetTrigger,
  SheetDescription,
} from "~/ui/sheet";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
} from "~/components/ui/card";

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
      <div className="container pt-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-12">
          {/* <!-- Kit Image --> */}
          <div className="sm:col-span-5">
            <AspectRatio
              ratio={4 / 3}
              className="overflow-hidden rounded-sm bg-muted-foreground"
            >
              <Image
                fill
                src={kit.image ?? "/images/gundam-placeholder.png"}
                className="object-cover"
                alt={kit.name}
              />
            </AspectRatio>
          </div>

          {/* <!-- Kit Details --> */}
          <div className="sm:col-span-7">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {kit.name}
            </h1>

            <div className="my-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge size="lg">
                  {kit.grade} {kit.scale}
                </Badge>
                <Separator orientation="vertical" className="h-4" />
                <Badge size="lg" variant="outline">
                  {getSeriesByCode(kit.series)?.name}
                </Badge>
              </div>
            </div>

            <div className="mb-4">
              <ProgressStepper status={kit.status} size="lg" />
            </div>

            <EditKit kit={kit} />
          </div>
        </div>

        <div className="mt-6">
          <h2 className="mb-4 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Related Kits
          </h2>

          {!isLoadingRelated && (!relatedKits || relatedKits.length === 0) && (
            <Card className="w-[160px] sm:w-[250px]">
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

interface EditKitProps {
  kit: Kit;
}

const EditKit = (props: EditKitProps) => {
  const utils = api.useContext();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { mutate: doDeleteKit, isLoading: isDeleting } =
    api.kit.deleteKit.useMutation({
      onSuccess() {
        handleOpenChange(false);
        void utils.kit.invalidate();
        void router.push("/collection");
      },
    });
  const { mutate, isLoading: isSubmitting } = api.kit.updateKit.useMutation({
    onSuccess() {
      setOpen(false);
      void utils.kit.invalidate();
    },
  });

  const { register, handleSubmit, control, reset } = useForm<
    RouterInputs["kit"]["updateKit"]["kit"]
  >({
    defaultValues: {
      grade: props.kit.grade,
      image: props.kit.image,
      name: props.kit.name,
      scale: props.kit.scale,
      series: props.kit.series,
      status: props.kit.status,
    },
    resolver: zodResolver(UpdateKitKitSchema),
  });

  const onSubmit = (data: RouterInputs["kit"]["updateKit"]["kit"]) => {
    const image = data.image;

    mutate({
      id: props.kit.id,
      kit: {
        ...data,
        image: image && image.length ? image : null,
      },
    });
  };

  const deleteKit = () => {
    doDeleteKit(props.kit.id);
  };

  const handleOpenChange = (o: boolean) => {
    if (!o) reset();
    setOpen(o);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button>Edit Kit</Button>
      </SheetTrigger>
      <SheetContent position="right" className="w-full sm:w-[420px]">
        <SheetHeader>
          <SheetTitle>Edit Kit Details</SheetTitle>
          <SheetDescription>
            Adjust the details of one of your kits
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={(e) =>
            void handleSubmit(onSubmit, (err) => console.error(err))(e)
          }
        >
          <div className="grid gap-4 py-4">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <Input
                id="image"
                {...register("image")}
                placeholder="Image link"
                className="col-span-3"
              />
            </div>
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
          </div>
          <SheetFooter>
            <Button
              type="button"
              variant="destructive"
              onClick={deleteKit}
              disabled={isSubmitting || isDeleting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Kit
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Kit
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
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
