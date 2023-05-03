import { type NextPage } from "next";

import Nav from "~/components/nav";
import { api } from "~/utils/api";

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

export default BacklogPage;
