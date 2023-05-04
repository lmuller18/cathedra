import { useState } from "react";

import Head from "next/head";
import Link from "next/link";
import { type NextPage } from "next";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusSquare, MinusSquare } from "lucide-react";
import { type CheckedState } from "@radix-ui/react-checkbox";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

import { getServerAuthSession } from "~/server/auth";
import { type RouterInputs, api } from "~/utils/api";
import { CreateKitSchema } from "~/lib/server-types";
import { GRADES, SCALES, SERIES, STATUSES } from "~/lib/utils";

import Nav from "~/components/nav";
import CollectionCard from "~/components/collection-card";

import { Input } from "~/ui/input";
import { Label } from "~/ui/label";
import { Button } from "~/ui/button";
import { Checkbox } from "~/ui/checkbox";
import { Separator } from "~/ui/separator";
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardDescription,
} from "~/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/ui/collapsible";
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
  SheetFooter,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetDescription,
} from "~/ui/sheet";

const Collection: NextPage = () => {
  const [filters, setFilters] = useState<RouterInputs["kit"]["getAll"]>({
    grades: [],
    scales: [],
    series: [],
    statuses: [],
  });
  const { data: kits, isLoading: isLoadingKits } = api.kit.getAll.useQuery(
    filters,
    { keepPreviousData: true }
  );

  const updateFilters = (
    property: "grades" | "scales" | "series" | "statuses",
    value: string,
    checked: CheckedState
  ) => {
    if (checked) {
      setFilters((f) => ({
        ...f,
        [property]: [...(f?.[property] ?? []), value],
      }));
    } else {
      setFilters((f) => ({
        ...f,
        [property]: f?.[property]?.filter((g) => g !== value) ?? [],
      }));
    }
  };

  const [filtersExpanded, setFiltersExpanded] = useState<{
    grades: boolean;
    scales: boolean;
    series: boolean;
    statuses: boolean;
  }>({
    grades: true,
    scales: true,
    series: true,
    statuses: true,
  });

  const updateFiltersExpanded = (
    key: keyof typeof filtersExpanded,
    value: boolean
  ) => {
    setFiltersExpanded((f) => ({
      ...f,
      [key]: value,
    }));
  };

  return (
    <>
      <Head>
        <title>Collection</title>
        <meta name="description" content="My Gundam Kit Collection" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />
      <div className="flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <aside className="max-h-44 w-full overflow-y-auto border-b border-r px-4 py-8 md:max-h-[unset] md:w-1/4 md:max-w-sm md:border-b-0">
          <h1 className="mb-4 text-2xl font-bold">Filters</h1>

          {/* Grades Filter */}
          <section>
            <Collapsible
              open={filtersExpanded.grades}
              onOpenChange={(value) => updateFiltersExpanded("grades", value)}
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-bold">Grades</h3>

                <FilterExpansionToggle expanded={filtersExpanded.grades} />
              </div>
              <CollapsibleContent>
                <ul>
                  {GRADES.map(({ code, label }) => (
                    <li className="mb-2 flex items-center space-x-2" key={code}>
                      <Checkbox
                        id={`grade-${code}`}
                        className="mr-2"
                        value={code}
                        onCheckedChange={(checked) =>
                          updateFilters("grades", code, checked)
                        }
                      />

                      <Label htmlFor={`grade-${code}`}>
                        {code} - {label}
                      </Label>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </section>

          <Separator className="my-4" />

          {/* Scales Filter */}
          <section>
            <Collapsible
              open={filtersExpanded.scales}
              onOpenChange={(value) => updateFiltersExpanded("scales", value)}
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-bold">Scales</h3>

                <FilterExpansionToggle expanded={filtersExpanded.scales} />
              </div>
              <CollapsibleContent>
                <ul>
                  {SCALES.map(({ code, label }) => (
                    <li className="mb-2 flex items-center space-x-2" key={code}>
                      <Checkbox
                        id={`scale-${code}`}
                        className="mr-2"
                        value={code}
                        onCheckedChange={(checked) =>
                          updateFilters("scales", code, checked)
                        }
                      />

                      <Label htmlFor={`scale-${code}`}>{label}</Label>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </section>

          <Separator className="my-4" />

          {/* Series Filter */}
          <section>
            <Collapsible
              open={filtersExpanded.series}
              onOpenChange={(value) => updateFiltersExpanded("series", value)}
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-bold">Series</h3>

                <FilterExpansionToggle expanded={filtersExpanded.series} />
              </div>
              <CollapsibleContent>
                <ul>
                  {SERIES.map(({ code, name }) => (
                    <li className="mb-2 flex items-center space-x-2" key={code}>
                      <Checkbox
                        id={`series-${code}`}
                        className="mr-2"
                        value={code}
                        onCheckedChange={(checked) =>
                          updateFilters("series", code, checked)
                        }
                      />

                      <Label htmlFor={`series-${code}`}>{name}</Label>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </section>

          <Separator className="my-4" />

          {/* Status Filter */}
          <section>
            <Collapsible
              open={filtersExpanded.statuses}
              onOpenChange={(value) => updateFiltersExpanded("statuses", value)}
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-bold">Statuses</h3>

                <FilterExpansionToggle expanded={filtersExpanded.statuses} />
              </div>
              <CollapsibleContent>
                <ul>
                  {STATUSES.map(({ code, label }) => (
                    <li className="mb-2 flex items-center space-x-2" key={code}>
                      <Checkbox
                        id={`status-${code}`}
                        className="mr-2"
                        value={code}
                        onCheckedChange={(checked) =>
                          updateFilters("statuses", code, checked)
                        }
                      />

                      <Label htmlFor={`status-${code}`}>{label}</Label>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </section>
        </aside>

        {/* Main Content */}
        <main className="w-full px-4 py-7 md:w-3/4 md:flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="inline text-2xl font-bold">Collection</h1>

            <AddKit />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {!isLoadingKits && (!kits || kits.length === 0) && (
              <Card>
                <CardHeader>
                  <CardTitle>No Kits Found</CardTitle>
                  <CardDescription>
                    No kits were found with the current filters. Adjust your
                    current selction or add a new kit below.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="justify-end">
                  <AddKit />
                </CardFooter>
              </Card>
            )}

            {kits?.map((kit) => (
              <Link key={kit.id} href={`/collection/${kit.id}`}>
                <CollectionCard key={kit.id} kit={kit} />
              </Link>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

interface FilterExpansionToggleProps {
  expanded: boolean;
}

const FilterExpansionToggle = (props: FilterExpansionToggleProps) => {
  return (
    <CollapsibleTrigger asChild>
      <button type="button">
        {props.expanded ? <MinusSquare size={16} /> : <PlusSquare size={16} />}
      </button>
    </CollapsibleTrigger>
  );
};

const AddKit = () => {
  const [open, setOpen] = useState(false);
  const utils = api.useContext();
  const { mutate } = api.kit.createKit.useMutation({
    onSuccess() {
      handleOpenChange(false);
      return utils.kit.getAll.invalidate();
    },
  });

  const { register, handleSubmit, control, formState, reset } = useForm<
    RouterInputs["kit"]["createKit"]
  >({
    resolver: zodResolver(CreateKitSchema),
  });

  const onSubmit = (data: RouterInputs["kit"]["updateKit"]["kit"]) => {
    const image = data.image;
    mutate({
      ...data,
      image: image && image.length ? image : null,
    });
  };

  const handleOpenChange = (o: boolean) => {
    if (!o) reset();
    setOpen(o);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button>Add Kit</Button>
      </SheetTrigger>
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
            {formState.errors.image && (
              <div className="-mt-2 grid grid-cols-4 items-center gap-4">
                <span className="col-span-3 col-start-2 text-sm text-destructive-foreground">
                  {formState.errors.image.message}
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
            <Button type="submit">Create Kit</Button>
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
    const callbackUrl = req.cookies?.["next-auth.callback-url"] ?? "";
    const params = req.headers.host
      ? `?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "";
    return {
      redirect: { destination: `/api/auth/signin${params}` },
    };
  }

  return { props: { session } };
};

export default Collection;
