import React from "react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

const LOGO_URL = "https://media.base44.com/images/public/6a6c3fe05c7bc26e77fa1781/e552bf983_ChatGPTImageJul30202605_08_20PM.png";

export default function Logo({ className }) {
  return (
    <span className={cn("block h-8 w-8 overflow-hidden rounded-full border border-border bg-black", className)}>
      <Image
        src={LOGO_URL}
        alt="Clarity logo"
        className="h-full w-full scale-150"
        fittingType="fill"
        focalPointX={0.5}
        focalPointY={0.39}
      />
    </span>
  );
}