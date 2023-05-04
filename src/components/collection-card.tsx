import Image from "next/image";
import { type Kit } from "@prisma/client";

import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { AspectRatio } from "./ui/aspect-ratio";
import ProgressStepper from "./progress-stepper";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface CollectionCardProps {
  kit: Kit;
}

const CollectionCard = (props: CollectionCardProps) => {
  return (
    <Card className="flex cursor-pointer flex-col overflow-hidden">
      <AspectRatio ratio={4 / 3} className="bg-muted-foreground">
        <Image
          fill
          src={props.kit.image ?? "/images/gundam-placeholder.png"}
          className="object-cover"
          alt={props.kit.name}
        />
      </AspectRatio>
      <CardHeader>
        <CardTitle className="line-clamp-1">{props.kit.name}</CardTitle>
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
        </div>
      </CardContent>
      <div className="mt-1 flex flex-grow flex-col justify-end p-4 pt-0">
        <ProgressStepper status={props.kit.status} />
      </div>
    </Card>
  );
};

export default CollectionCard;
