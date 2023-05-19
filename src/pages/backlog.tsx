import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import type { NextPage } from "next";
import { MinusSquare, MoreVertical, ArrowBigDownDash } from "lucide-react";

import type { Kit } from "@prisma/client";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "~/ui/table";
import {
  getTypeByCode,
  getGradeByCode,
  getScaleByCode,
  getSeriesByCode,
  getStatusByCode,
  PLACEHOLDER_IMAGE,
} from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/ui/dropdown-menu";
import { api } from "~/utils/api";
import Nav from "~/components/nav";
import { Button } from "~/ui/button";
import { useToast } from "~/ui/use-toast";
import { ScrollArea } from "~/ui/scroll-area";
import type { RouterInputs } from "~/utils/api";
import { AspectRatio } from "~/ui/aspect-ratio";
import BacklogCard from "~/components/backlog-card";
import { getServerAuthSession } from "~/server/auth";

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
    <>
      <Head>
        <title>Backlog</title>
        <meta name="description" content="My Gundam Kit Backlog" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Nav />

        <div>
          {loadingBacklog ? (
            "Loading..."
          ) : backlog ? (
            <Backlog kits={backlog} />
          ) : (
            "No kits"
          )}

          {!loadingNonBacklog && nonBacklog && nonBacklog.length > 0 && (
            <div className="container">
              <h3 className="mb-2 mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                Other
              </h3>
              <ScrollArea orientation="horizontal">
                <div className="flex space-x-4 pb-4">
                  {nonBacklog?.map((kit) => (
                    <div
                      className="w-[150px] space-y-3 sm:w-[250px]"
                      key={kit.id}
                    >
                      <Link href={`/collection/${kit.id}`}>
                        <div className="overflow-hidden rounded-md">
                          <Image
                            src={kit.image ?? PLACEHOLDER_IMAGE}
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
          )}
        </div>
      </div>
    </>
  );
};

interface BacklogProps {
  kits: Kit[];
}

const Backlog = (props: BacklogProps) => {
  const [featured, ...rest] = props.kits;
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
    <div className="sm:pt-8">
      <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:container sm:grid-cols-12">
        <h2 className="container mb-4 mt-3 block scroll-m-20 text-3xl font-semibold tracking-tight sm:hidden">
          Up Next: {featured.name}
        </h2>

        <div className="sm:col-span-5">
          <AspectRatio
            ratio={4 / 3}
            className="overflow-hidden rounded-sm bg-muted-foreground"
          >
            <Image
              fill
              src={featured.image ?? PLACEHOLDER_IMAGE}
              className="object-cover"
              alt={featured.name}
            />
          </AspectRatio>
        </div>
        <div className="px-4 sm:col-span-7 sm:px-0">
          <h2 className="mb-4 hidden scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight [text-wrap:balance] sm:mb-0 sm:block">
            Up Next: {featured.name}
          </h2>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Kit Info</TableHead>
                <TableHead className="text-right">
                  <FeaturedActions kit={featured} />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold">Grade</TableCell>
                <TableCell>{getGradeByCode(featured.grade)?.label}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Series</TableCell>
                <TableCell>{getSeriesByCode(featured.series)?.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Scale</TableCell>
                <TableCell>{getScaleByCode(featured.scale)?.label}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Type</TableCell>
                <TableCell>{getTypeByCode(featured.type)?.label}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Status</TableCell>
                <TableCell>{getStatusByCode(featured.status)?.label}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {rest.length && (
        <div className="container mt-4">
          <h2 className="mb-4 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
            Backlog
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            {rest.map((kit) => (
              <div key={kit.id}>
                <BacklogCard
                  kit={kit}
                  backlogCount={props.kits.length}
                  reorder={reorder}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface FeaturedActionsProps {
  kit: Kit;
}

const FeaturedActions = (props: FeaturedActionsProps) => {
  const { toast } = useToast();
  const utils = api.useContext();

  const { mutate: removeFromBacklog, isLoading: removingFromBacklog } =
    api.kit.removeFromBacklog.useMutation({
      onSuccess() {
        toast({
          title: "Kit removed from backlog",
        });
        return utils.kit.invalidate();
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
        <DropdownMenuItem
          onClick={() => removeFromBacklog(props.kit.id)}
          disabled={removingFromBacklog}
        >
          <MinusSquare className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Backlog
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => removeFromBacklog(props.kit.id)}
          disabled={removingFromBacklog}
        >
          <ArrowBigDownDash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Move Down
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
    const params = `?callbackUrl=${encodeURIComponent("/backlog")}`;
    return {
      redirect: { destination: `/auth/signin${params}` },
    };
  }

  return { props: { session } };
};

export default BacklogPage;
