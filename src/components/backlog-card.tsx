import Image from "next/image";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";

import type { Kit } from "@prisma/client";

import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
} from "~/elements/card";
import { Badge } from "~/elements/badge";
import { Button } from "~/elements/button";
import { Separator } from "~/elements/separator";
import { AspectRatio } from "~/elements/aspect-ratio";
import { getTypeByCode, PLACEHOLDER_IMAGE } from "~/lib/utils";

interface BacklogCardProps {
  kit: Kit;
  reorder: (id: string, action: 1 | -1) => void;
  backlogCount: number;
}

const BacklogCard = (props: BacklogCardProps) => {
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
      <CardFooter className="justify-end gap-2">
        <Button
          variant="outline"
          className="rounded-full p-2"
          disabled={props.kit.backlogOrder === 0}
          onClick={() => props.reorder(props.kit.id, -1)}
        >
          <ArrowBigUp />
        </Button>
        <Button
          variant="outline"
          className="rounded-full p-2"
          disabled={props.kit.backlogOrder === props.backlogCount - 1}
          onClick={() => props.reorder(props.kit.id, 1)}
        >
          <ArrowBigDown />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BacklogCard;
