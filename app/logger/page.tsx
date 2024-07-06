"use client";

import { logger } from "~/src/logger/example";
import { useBatchThrottle } from "~/src/packages/use-batch-throttle";

export default function Home() {
  const logging = useBatchThrottle(logger.track, 50000);
  return (
    <div className="">
      <button
        onClick={() => {
          logging("hello");
        }}
      >
        하이
      </button>
      <div className=""></div>
      <button
        onClick={() => {
          logging.reset();
        }}
      >
        로깅 쓰로틀링 초기화
      </button>
    </div>
  );
}
