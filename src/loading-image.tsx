"use client";

import { cn } from "@xionwcfm/xds";
import { type ComponentProps, type ComponentPropsWithoutRef, Fragment, type ReactNode, useState } from "react";
import Image from "next/image";

export const LoadingImage = (props: ComponentProps<typeof Image> & { fallback?: ReactNode }) => {
  const { onLoad, fallback, className, ...rest } = props;
  const [isLoaded, setLoaded] = useState(false);
  const isRenderFallback = !isLoaded;
  return (
    <Fragment>
      {isRenderFallback ? fallback : null}
      <Image
        className={cn(!isLoaded && " absolute invisible", className)}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        {...rest}
      />
    </Fragment>
  );
};

const createLoadingImage = (ImageComponent: (props: ComponentPropsWithoutRef<"img">) => ReactNode) => {
  
};
