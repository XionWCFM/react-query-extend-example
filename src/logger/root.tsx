"use client";
import { useCallback } from "react";
import { createLogger } from "./package";

type EventName = "signup";

export const [LoggerPrimitives, logger] = createLogger<EventName>();

export const Logger = () => {
  const handler = useCallback(() => {
    console.log("hello");
  }, []);
  return <LoggerPrimitives handler={handler} />;
};
