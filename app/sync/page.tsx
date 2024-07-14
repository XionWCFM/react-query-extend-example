"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import useRouterWithEvents from "use-router-with-events";
import useBeforeUnload from "./use-before-unload";
import { overlay } from "overlay-kit";
import { useFlow } from "./use-flow";

const Page = () => {
  const [Funnel, flow] = useFlow(["hello", "world", "mot"] as const);
  useBeforeUnload(async () => {
    const result = await new Promise<boolean>((res) =>
      overlay.open(() => {
        return (
          <div className="">
            <button onClick={() => res(true)}>나가기</button>
            <button onClick={() => res(false)}>그대로있기</button>
          </div>
        );
      }),
    );
    return false;
  });
  return (
    <div>
      <div className="">{flow.stepList}</div>
      <div className="">{flow.step}</div>
      <div className="">{flow.historyStack.join(" -> ")}</div>
      <Funnel>
        <Funnel.Step name={"hello"}>
          <div className="">
            지금은 hello
            <button onClick={() => flow.nextStep("world")}>나는 월드로 간다</button>
          </div>
        </Funnel.Step>
        <Funnel.Step name={"mot"}>
          <div className="">
            지금은 mot
            <button onClick={() => flow.back(1)}>뒤로 간다</button>
            <button onClick={() => flow.nextStep("hello")}>나는 hello로 간다</button>
          </div>
        </Funnel.Step>
        <Funnel.Step name={"world"}>
          <div className="">
            지금은 world
            <button></button>
            <button onClick={() => flow.nextStep("mot")}>나는 mot로 간다</button>
          </div>
        </Funnel.Step>
      </Funnel>

      <button onClick={() => flow.clear()}>클리어하기</button>
      <div className=" mt-60"></div>
      <button
        onClick={() => {
          flow.removeStep("hello");
        }}
      >
        없애기 hello 스택
      </button>
    </div>
  );
};

export default Page;
