import Image from "next/image";

import type { Kit } from "@prisma/client";

import { getTypeByCode, PLACEHOLDER_IMAGE } from "~/lib/utils";

import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { AspectRatio } from "./ui/aspect-ratio";
import ProgressStepper from "./progress-stepper";
import { Card, CardTitle, CardHeader, CardContent } from "./ui/card";

interface CollectionCardProps {
  kit: Kit;
}

const CollectionCard = (props: CollectionCardProps) => {
  return (
    <Card className="flex flex-col overflow-hidden">
      <AspectRatio
        ratio={4 / 3}
        className="overflow-hidden bg-muted-foreground"
      >
        <Image
          fill
          src={props.kit.image ?? PLACEHOLDER_IMAGE}
          className="object-cover transition-all hover:scale-105"
          alt={props.kit.name}
        />
      </AspectRatio>
      <CardHeader className="p-6 pb-3 xl:p-3">
        <CardTitle className="line-clamp-1">{props.kit.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 xl:p-3 xl:pt-0">
        <div className="flex flex-wrap items-center gap-2">
          {props.kit.type === "MODEL" ? (
            <Badge>
              {props.kit.grade} {props.kit.scale}
            </Badge>
          ) : (
            <Badge>{getTypeByCode(props.kit.type)?.label}</Badge>
          )}
          <Separator orientation="vertical" className="h-4" />
          <Badge variant="outline" className="whitespace-nowrap">
            {props.kit.series}
          </Badge>
        </div>
      </CardContent>
      <div className="mt-1 flex flex-grow flex-col justify-end p-4 pt-0">
        <ProgressStepper status={props.kit.status} />
      </div>
    </Card>
  );
};

export default CollectionCard;
