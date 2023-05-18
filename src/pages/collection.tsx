import Head from "next/head";
import Link from "next/link";
import type { NextPage } from "next";
import React, { useState } from "react";
import { PlusSquare, MinusSquare } from "lucide-react";

import type { CheckedState } from "@radix-ui/react-checkbox";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

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
import { api } from "~/utils/api";
import Nav from "~/components/nav";
import { Label } from "~/ui/label";
import { Button } from "~/ui/button";
import { Checkbox } from "~/ui/checkbox";
import { Skeleton } from "~/ui/skeleton";
import { Separator } from "~/ui/separator";
import { ScrollArea } from "~/ui/scroll-area";
import { AspectRatio } from "~/ui/aspect-ratio";
import type { RouterInputs } from "~/utils/api";
import { getServerAuthSession } from "~/server/auth";
import AddKitSheet from "~/components/add-kit-sheet";
import CollectionCard from "~/components/collection-card";
import { TYPES, GRADES, SCALES, SERIES, STATUSES } from "~/lib/utils";

const Collection: NextPage = () => {
  const [page, setPage] = useState(0);

  const [filters, setFilters] = useState<RouterInputs["kit"]["getAll"]>({
    grades: [],
    scales: [],
    series: [],
    statuses: [],
    types: [],
  });
  const { data: kitData, isLoading: isLoadingKits } =
    api.kit.getPaginated.useQuery(
      { ...filters, page, pageSize: 8 },
      { keepPreviousData: true }
    );

  const updateFilters = (
    property: "grades" | "scales" | "series" | "statuses" | "types",
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
    setPage(0);
  };

  const [filtersExpanded, setFiltersExpanded] = useState<{
    grades: boolean;
    scales: boolean;
    series: boolean;
    statuses: boolean;
    types: boolean;
  }>({
    grades: true,
    scales: true,
    series: true,
    statuses: true,
    types: true,
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
        <aside className="w-full border-b border-r px-4 py-8 md:w-1/4 md:max-w-sm md:border-b-0">
          <h1 className="mb-4 text-2xl font-bold">Filters</h1>
          <Separator className="mt-4 block md:hidden" />

          <ScrollArea className="h-44 md:h-full">
            {/* Grades Filter */}
            <section className="pt-4 md:pt-0">
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
                      <li
                        className="mb-2 flex items-center space-x-2"
                        key={code}
                      >
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
                      <li
                        className="mb-2 flex items-center space-x-2"
                        key={code}
                      >
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
                      <li
                        className="mb-2 flex items-center space-x-2"
                        key={code}
                      >
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
                onOpenChange={(value) =>
                  updateFiltersExpanded("statuses", value)
                }
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-bold">Statuses</h3>

                  <FilterExpansionToggle expanded={filtersExpanded.statuses} />
                </div>
                <CollapsibleContent>
                  <ul>
                    {STATUSES.map(({ code, label }) => (
                      <li
                        className="mb-2 flex items-center space-x-2"
                        key={code}
                      >
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

            {/* Types Filter */}
            <section>
              <Collapsible
                open={filtersExpanded.types}
                onOpenChange={(value) => updateFiltersExpanded("types", value)}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-bold">Types</h3>

                  <FilterExpansionToggle expanded={filtersExpanded.types} />
                </div>
                <CollapsibleContent>
                  <ul>
                    {TYPES.map(({ code, label }) => (
                      <li
                        className="mb-2 flex items-center space-x-2"
                        key={code}
                      >
                        <Checkbox
                          id={`type-${code}`}
                          className="mr-2"
                          value={code}
                          onCheckedChange={(checked) =>
                            updateFilters("types", code, checked)
                          }
                        />

                        <Label htmlFor={`type-${code}`}>{label}</Label>
                      </li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            </section>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="w-full px-4 py-7 md:w-3/4 md:flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="inline text-2xl font-bold">Collection</h1>

            <AddKitSheet>
              <Button>Add Kit</Button>
            </AddKitSheet>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {!isLoadingKits && (!kitData || kitData.kits.length === 0) && (
              <Card>
                <CardHeader>
                  <CardTitle>No Kits Found</CardTitle>
                  <CardDescription>
                    No kits were found with the current filters. Adjust your
                    current selction or add a new kit below.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="justify-end">
                  <AddKitSheet>
                    <Button>Add Kit</Button>
                  </AddKitSheet>
                </CardFooter>
              </Card>
            )}

            {isLoadingKits
              ? Array.from(Array(8)).map((_, i) => (
                  <Card key={i}>
                    <AspectRatio ratio={4 / 3}>
                      <Skeleton className="h-full w-full" />
                    </AspectRatio>
                    <CardHeader className="p-6 pb-3 xl:p-3">
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                  </Card>
                ))
              : kitData?.kits.map((kit) => (
                  <Link key={kit.id} href={`/collection/${kit.id}`}>
                    <CollectionCard key={kit.id} kit={kit} />
                  </Link>
                ))}
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={!kitData || kitData.page === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!kitData || page + 1 >= kitData.totalPages}
            >
              Next
            </Button>
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

export default Collection;
