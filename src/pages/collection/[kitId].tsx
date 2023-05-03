import { zodResolver } from "@hookform/resolvers/zod";
import { type Kit } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { type NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Nav from "~/components/nav";
import ProgressStepper from "~/components/progress-stepper";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { UpdateKitKitSchema } from "~/lib/server-types";
import {
  GRADES,
  SCALES,
  SERIES,
  STATUSES,
  getSeriesByCode,
  getStatusByCode,
} from "~/lib/utils";
import { AspectRatio } from "~/ui/aspect-ratio";
import { Badge } from "~/ui/badge";
import { Separator } from "~/ui/separator";
import { type RouterInputs, api } from "~/utils/api";

const KitPage: NextPage = () => {
  const router = useRouter();
  const { kitId } = router.query as { kitId: string };

  const { data: kit, isLoading } = api.kit.getById.useQuery(kitId, {
    enabled: !!kitId,
  });
  const { data: relatedKits } = api.kit.getAll.useQuery({
    page: 0,
    pageSize: 5,
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
          <div className="relative">
            <ScrollArea>
              <div className="flex space-x-4 pb-4">
                {relatedKits?.map((kit) => (
                  <div
                    className="w-[160px] space-y-3 sm:w-[250px]"
                    key={kit.id}
                  >
                    <div className="overflow-hidden rounded-md">
                      <Image
                        src={kit.image ?? "/images/gundam-placeholder.png"}
                        alt={kit.name}
                        width={250}
                        height={330}
                        className="aspect-square h-auto w-auto bg-muted-foreground object-cover transition-all hover:scale-105"
                      />
                    </div>
                    <div className="space-y-1 text-sm">
                      <h3 className="line-clamp-1 font-medium leading-none">
                        {kit.name}
                      </h3>
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

  const { mutate: doDeleteKit, isLoading: isDeleting } =
    api.kit.deleteKit.useMutation({
      onSuccess() {
        setOpen(false);
        return utils.kit.getAll.invalidate();
      },
    });
  const { mutate, isLoading: isSubmitting } = api.kit.updateKit.useMutation({
    async onMutate(updatedKit) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.kit.getAll.cancel();

      // Get the data from the queryCache
      const prevData = utils.kit.getAll.getData();

      // Optimistically update the data with our new post
      utils.kit.getAll.setData(undefined, (old) =>
        old?.map((k) =>
          k.id === updatedKit.id ? { ...k, ...updatedKit.kit } : k
        )
      );

      // Return the previous data so we can revert if something goes wrong
      return { prevData };
    },
    onError(err, newPost, ctx) {
      if (ctx) {
        // If the mutation fails, use the context-value from onMutate
        utils.kit.getAll.setData(undefined, ctx.prevData);
      }
    },
    onSuccess() {
      setOpen(false);
      void utils.kit.getAll.invalidate();
      return utils.kit.getById.invalidate();
    },
  });

  const { register, handleSubmit, control } = useForm<
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

  return (
    <Sheet open={open} onOpenChange={(o) => setOpen(o)}>
      <SheetTrigger asChild>
        <Button>Edit Kit</Button>
      </SheetTrigger>
      <SheetContent position="right" className="w-full sm:w-1/2 lg:w-1/3">
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

export default KitPage;