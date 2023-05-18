import type { ReactNode } from "react";
import { cva } from "class-variance-authority";
import { Home, Gift, Truck, Hammer } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

import type { Kit } from "@prisma/client";

import { cn } from "~/lib/utils";

const progressStepperVariants = cva(
  "z-10 flex items-center justify-center rounded-full border bg-foreground",
  {
    variants: {
      size: {
        default: "h-6 w-6 p-1",
        lg: "h-8 w-8 p-1.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface ProgressStepperProps
  extends VariantProps<typeof progressStepperVariants> {
  status: Kit["status"];
}

const ProgressStepper = (props: ProgressStepperProps) => {
  return (
    <div className="relative grid grid-cols-4">
      <ProgressIcon
        size={props.size}
        active={["WISHLIST", "ORDERED", "OWNED", "ASSEMBLED"].includes(
          props.status
        )}
        icon={<Gift />}
      />
      <ProgressIcon
        size={props.size}
        active={["ORDERED", "OWNED", "ASSEMBLED"].includes(props.status)}
        icon={<Truck />}
        showProgress
      />
      <ProgressIcon
        size={props.size}
        active={["OWNED", "ASSEMBLED"].includes(props.status)}
        icon={<Home />}
        showProgress
      />
      <ProgressIcon
        size={props.size}
        active={["ASSEMBLED"].includes(props.status)}
        icon={<Hammer />}
        showProgress
      />
    </div>
  );
};

const ProgressIcon = (props: {
  active?: boolean;
  showProgress?: boolean;
  size?: "default" | "lg" | null | undefined;
  icon: ReactNode;
}) => {
  return (
    <div className="relative flex w-full items-center justify-center">
      {props.showProgress && (
        <div
          className={cn(
            "absolute -left-1/2 bottom-1/2 right-1/2 top-1/2 h-1 w-full",
            props.active ? "bg-white" : "bg-muted-foreground"
          )}
        />
      )}

      <div
        className={cn(
          progressStepperVariants({ size: props.size }),
          props.active
            ? "border-transparent bg-white text-background"
            : "bg-secondary"
        )}
      >
        {props.icon}
      </div>
    </div>
  );
};

export default ProgressStepper;
