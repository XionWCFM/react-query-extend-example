"use client";
import { ReactNode, useEffect } from "react";
import { usePreservedCallback } from "../packages/use-preserved-callback";
import { GetCallbackHandlerParam, LoggerReturnStructure } from "./core";

type LoggerProps<T extends LoggerReturnStructure> = {
  children?: ReactNode;
  logger: T;
  handler: GetCallbackHandlerParam<T["subscribe"]>;
};

export const ReactLogger = <T extends LoggerReturnStructure>(props: LoggerProps<T>) => {
  const { children, logger, handler } = props;
  const callback = usePreservedCallback(handler);

  useEffect(() => {
    logger.subscribe(callback);

    return () => {
      logger.unsubscribe(callback);
    };
  }, [callback, logger]);

  return children;
};

export type LogEvent<T extends { subscribe: (...args: any[]) => void }> = Parameters<
  Parameters<T["subscribe"]>["0"]
>["0"];
