"use client";
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ClientOnlyPortalProps {
  children: ReactNode;
  selector: "#toast" | "#dialog";
}

export const ClientOnlyPortal = (props: ClientOnlyPortalProps) => {
  const { children, selector } = props;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted ? createPortal(children, document.querySelector(selector) as Element) : null;
};
