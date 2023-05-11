import Link from "next/link";
import Image from "next/image";
import { type NextPage } from "next";
import { useMemo, useState } from "react";
import { type Kit } from "@prisma/client";

import { getServerAuthSession } from "~/server/auth";
import { type RouterInputs, api } from "~/utils/api";

import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

import Nav from "~/components/nav";
import BacklogCard from "~/components/backlog-card";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "~/ui/table";
import { Badge } from "~/ui/badge";
import { Button } from "~/ui/button";
import { ScrollArea } from "~/ui/scroll-area";

const BacklogPage: NextPage = () => {
  const utils = api.useContext();
  const { data: backlog, isLoading: loadingBacklog } =
    api.kit.getBacklog.useQuery();
  const { mutate: addToBacklog, isLoading: addingToBacklog } =
    api.kit.addToBacklog.useMutation({
      onSuccess() {
        return utils.kit.invalidate();
      },
    });

  const { data: nonBacklog, isLoading: loadingNonBacklog } =
    api.kit.getAll.useQuery({
      includeBacklog: false,
      types: ["MODEL"],
      statuses: ["OWNED"],
    });

  return (
    <div className="flex flex-col">
      <Nav />

      <div className="container pt-8">
        {loadingBacklog ? (
          "Loading..."
        ) : backlog ? (
          <Backlog kits={backlog} />
        ) : (
          "No kits"
        )}

        {!loadingNonBacklog && nonBacklog && nonBacklog.length > 0 && (
          <>
            <h3 className="mb-2 mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
              Other
            </h3>
            <div className="relative">
              <ScrollArea>
                <div className="flex space-x-4 pb-4">
                  {nonBacklog?.map((kit) => (
                    <div
                      className="w-[150px] space-y-3 sm:w-[250px]"
                      key={kit.id}
                    >
                      <Link href={`/collection/${kit.id}`}>
                        <div className="overflow-hidden rounded-md">
                          <Image
                            src={kit.image ?? "/images/gundam-placeholder.png"}
                            alt={kit.name}
                            width={250}
                            height={250}
                            className="aspect-square h-auto w-auto bg-muted-foreground object-cover transition-all hover:scale-105"
                          />
                        </div>
                      </Link>
                      <div className="space-y-2 text-sm">
                        <Link href={`/collection/${kit.id}`}>
                          <h3 className="line-clamp-1 font-medium leading-none">
                            {kit.name}
                          </h3>
                        </Link>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => addToBacklog(kit.id)}
                            disabled={addingToBacklog}
                          >
                            Add to backlog
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface BacklogProps {
  kits: Kit[];
}

const Backlog = (props: BacklogProps) => {
  const [featured] = props.kits;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(() => {
    return selectedId === null
      ? props.kits[0]
      : props.kits.find((kit) => kit.id === selectedId);
  }, [selectedId, props.kits]);
  const { mutate: doReorder } = api.kit.updateBacklogOrder.useMutation();
  const utils = api.useContext();

  const reorder = (id: string, action: 1 | -1) => {
    const index = props.kits.findIndex((kit) => kit.id === id);
    const newIndex = index + action;
    const updatedKit = props.kits[index];
    if (!updatedKit) return;
    const updatedKits: RouterInputs["kit"]["updateBacklogOrder"] = [
      {
        id: updatedKit.id,
        backlogOrder: newIndex,
      },
    ];

    const displacedKit = props.kits[newIndex];
    if (displacedKit) {
      updatedKits.push({ id: displacedKit.id, backlogOrder: index });
    }

    doReorder(updatedKits, {
      onSuccess() {
        return utils.kit.invalidate();
      },
    });
  };

  if (!featured) return <div>No kits</div>;

  return (
    <div>
      <h1 className="mb-2 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Next Build
      </h1>
      <h2 className="w-fit scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        {featured.name}
      </h2>

      <h3 className="mb-2 mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        Backlog
      </h3>
      <div className="relative flex gap-4 overflow-scroll">
        <div className="flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Series</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.kits.map((kit) => (
                <TableRow
                  key={kit.id}
                  onMouseEnter={() => setSelectedId(kit.id)}
                  data-state={kit.id === selected?.id ? "selected" : ""}
                >
                  <TableCell className="font-medium">
                    <Button
                      asChild
                      variant="link"
                      className="whitespace-nowrap"
                    >
                      <Link href={`/collection/${kit.id}`}>{kit.name}</Link>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge>
                      {kit.grade} {kit.scale}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{kit.series}</Badge>
                  </TableCell>
                  <TableCell className="w-full"></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="sticky top-0">
          {selected && (
            <BacklogCard
              kit={selected}
              backlogCount={props.kits.length}
              reorder={reorder}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({
  req,
  res,
}: CreateNextContextOptions) => {
  const session = await getServerAuthSession({ req, res });

  if (!session?.user) {
    const params = `?callbackUrl=${encodeURIComponent("/backlog")}`;
    return {
      redirect: { destination: `/auth/signin${params}` },
    };
  }

  return { props: { session } };
};

export default BacklogPage;
