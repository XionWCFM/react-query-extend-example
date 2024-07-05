"use client";

import { useMutation } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useCallback, useRef, useState } from "react";
import { throttle } from "~/src/packages/throttle";

const useThrottle = <T extends (...args: any[]) => void>(fn: T, ms: number) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(throttle(fn, ms), []);
};

export default function Home() {
  const [_, setForce] = useState(0);
  const tanstack = useMutation({
    mutationFn: async () => {
      console.log("몇번이나 실행될까요?");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return "tanstack";
    },
  });
  const throttleFn = useThrottle(tanstack.mutateAsync, 1000);
  const handleClick = throttle(async () => {
    await throttleFn();
  }, 5000);

  const handleAbnormalClick = () => {
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(() => {
      document.getElementById("tanstack")?.click();
    });
  };

  return (
    <div>
      <div className="">
        <button onClick={() => setForce((p) => p + 1)}>상태업데이트</button>
      </div>
      <div>
        <button className=" px-4 py-2 bg-purple-700 rounded-full text-white" id="tanstack" onClick={handleClick}>
          클릭 당할 버튼
        </button>
      </div>

      <div className=" mt-16">
        <button
          className=" px-4 py-2 bg-purple-700 rounded-full text-white"
          id="tanstack"
          onClick={handleAbnormalClick}
        >
          인위적인 수차례의 클릭
        </button>
      </div>
    </div>
  );
}
