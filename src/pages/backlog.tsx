import { type NextPage } from "next";
import { getServerAuthSession } from "~/server/auth";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

import { api } from "~/utils/api";
import Nav from "~/components/nav";

const BacklogPage: NextPage = () => {
  const { data: backlog } = api.kit.getBacklog.useQuery();
  const { data: nonBacklog } = api.kit.getAll.useQuery({
    statuses: ["OWNED"],
    includeBacklog: false,
  });

  return (
    <div className="flex flex-col">
      <Nav />

      <div className="container pt-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Backlog
        </h1>
        {backlog?.map((b) => b.name).join(", ")}
        {(!backlog || !backlog.length) && "None"}
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Others
        </h1>
        {nonBacklog?.map((b) => b.name).join(", ")}
        {(!nonBacklog || !nonBacklog.length) && "None"}
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
