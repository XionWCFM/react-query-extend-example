"use client";
import type { ReactNode } from "react";
import { OverlayProvider as OriginalOverlayProvider } from "overlay-kit";
type OverlayProviderProps = {
  children?: ReactNode;
};

export function OverlayProvider(props: OverlayProviderProps) {
  const { children } = props;
  return <OriginalOverlayProvider>{children}</OriginalOverlayProvider>;
}
