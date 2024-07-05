"use client";

import { logger } from "~/src/logger/root";

export default function Home() {
  return (
    <div className="">
      <button onClick={() => logger.track("signup")}>하이</button>
    </div>
  );
}
