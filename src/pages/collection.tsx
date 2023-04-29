import { type Kit } from "@prisma/client";
import { type CheckedState } from "@radix-ui/react-checkbox";
import { MinusSquare, PlusSquare } from "lucide-react";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useMemo, useState } from "react";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { GRADES, SCALES, SERIES, STATUSES, getStatusByCode } from "~/lib/utils";
import { type RouterInputs, api } from "~/utils/api";

const Collection: NextPage = () => {
  const [filters, setFilters] = useState<RouterInputs["kit"]["getAll"]>({
    grades: [],
    scales: [],
    series: [],
    statuses: [],
  });
  const { data: kits, isLoading: isLoadingKits } =
    api.kit.getAll.useQuery(filters);

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

      <AspectRatio className="bg-muted" ratio={16 / 3}>
        <Image
          src="/images/hangar-1.jpg"
          fill
          className="object-cover [object-position:center_20%]"
          alt=""
        />
      </AspectRatio>
      <div className="flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <aside className="max-h-44 w-full overflow-y-auto border-b border-r px-4 py-8 md:max-h-[unset] md:w-1/4 md:border-b-0">
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
        <main className="w-full px-4 py-7 md:w-3/4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="inline text-2xl font-bold">Collection</h1>

            <AddKit />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
              <CollectionCard key={kit.id} kit={kit} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

interface CollectionCardProps {
  kit: Kit;
}

const CollectionCard = (props: CollectionCardProps) => {
  return (
    <Card className="overflow-hidden">
      <AspectRatio ratio={4 / 3} className="bg-muted-foreground">
        <Image
          fill
          // loader={() => "/images/gundam-placeholder.png"}
          src={props.kit.image ?? "/images/gundam-placeholder.png"}
          className="object-cover"
          alt={props.kit.name}
        />
      </AspectRatio>
      <CardHeader>
        <CardTitle>{props.kit.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>
            {props.kit.grade} {props.kit.scale}
          </Badge>
          <Separator orientation="vertical" className="h-4" />
          <Badge variant="outline" className="whitespace-nowrap">
            {props.kit.series}
          </Badge>
          <Separator orientation="vertical" className="h-4" />
          <Badge variant="outline">
            {getStatusByCode(props.kit.status)?.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
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
  const utils = api.useContext();
  const { mutate } = api.kit.createKit.useMutation({
    onSuccess() {
      void utils.kit.getAll.invalidate();
    },
  });

  const [formState, setFormState] = useState<RouterInputs["kit"]["createKit"]>({
    grade: "",
    image: null,
    name: "",
    scale: "",
    series: "",
    status: "",
  });

  const formValid = useMemo(() => {
    for (const key in formState) {
      if (
        key !== "image" &&
        typeof formState[key as keyof typeof formState] !== "string"
      )
        return false;
      const value = formState[key as keyof typeof formState];
      if (key === "image") continue;
      if (value == null || value.length === 0) return false;
    }
    return true;
  }, [formState]);

  const updateForm = (key: keyof typeof formState, value: string) => {
    if (key === "image") {
      setFormState((f) => ({
        ...f,
        image: value.length === 0 ? null : value,
      }));
    } else {
      setFormState((f) => ({
        ...f,
        [key]: value,
      }));
    }
  };

  const createKit = () => {
    mutate(formState);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Kit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add kit</DialogTitle>
          <DialogDescription>
            Add a gundam kit to your collection. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Kit name"
              className="col-span-3"
              onChange={(e) => updateForm("name", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Image
            </Label>
            <Input
              id="image"
              placeholder="Image link"
              className="col-span-3"
              onChange={(e) => updateForm("image", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="grade" className="text-right">
              Grade
            </Label>
            <Select onValueChange={(val) => updateForm("grade", val)}>
              <SelectTrigger id="grade" className="col-span-3">
                <SelectValue placeholder="Select a grade" />
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
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="series" className="text-right">
              Series
            </Label>
            <Select onValueChange={(val) => updateForm("series", val)}>
              <SelectTrigger id="series" className="col-span-3">
                <SelectValue placeholder="Select a series" />
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
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="scale" className="text-right">
              Scale
            </Label>
            <Select onValueChange={(val) => updateForm("scale", val)}>
              <SelectTrigger id="scale" className="col-span-3">
                <SelectValue placeholder="Select a scale" />
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
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Status" className="text-right">
              Status
            </Label>
            <Select onValueChange={(val) => updateForm("status", val)}>
              <SelectTrigger id="status" className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="Wishlist">Wishlist</SelectItem>
                  <SelectItem value="Ordered">Ordered</SelectItem>
                  <SelectItem value="Owned">Owned</SelectItem>
                  <SelectItem value="Assembled">Assembled</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={createKit} disabled={!formValid}>
              Create Kit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Collection;
