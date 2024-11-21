import { cn } from "@xionwcfm/xds";
import type { ComponentPropsWithoutRef, Ref } from "react";

import { forwardRef } from "react";

export const Slide = (props: ComponentPropsWithoutRef<"div"> & { flex?: number | string }) => {
  const { children, className, flex = 100, ...rest } = props;
  const value = typeof flex === "number" ? `${flex}%` : flex;
  return (
    <div
      className={cn("w-full h-full  flex", className)}
      style={{
        flex: `0 0 ${value}`,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

export const Carousel = forwardRef(function CarouselViewport(
  props: ComponentPropsWithoutRef<"div">,
  ref: Ref<HTMLDivElement>,
) {
  const { children, className, ...rest } = props;
  return (
    <div className=" relative w-full">
      <div ref={ref} className={cn("overflow-hidden w-full")} {...rest}>
        <div className={cn(" flex touch-pan-x touch-pan-y", className)}>{children}</div>
      </div>
    </div>
  );
});
