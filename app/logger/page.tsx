"use client";

import { logger } from "~/src/logger/example";

export default function Home() {
  const handleClick = () => {
    logger.track("hello");
  };
  return (
    <div className="">
      <button onClick={handleClick}>track event</button>
    </div>
  );
}
