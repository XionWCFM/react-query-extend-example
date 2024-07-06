"use client";

import { createLogger } from "./core";
import { ReactLogger } from "./react";

export const logger = createLogger<"hello">();

export const Logger = () => {
  return (
    <ReactLogger
      logger={logger}
      handler={(event) => {
        console.log(event);
      }}
    />
  );
};
