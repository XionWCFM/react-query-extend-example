"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { useFlow } from "./flow";

const Page = () => {
  const [Funnel, flow] = useFlow(["hello", "world", "mot"] as const);
  const handle = useCallback(() => {
    confirm("hello");
  }, []);

  return (
    <div>
      <div className="">{flow.stepList}</div>
      <div className="">{flow.currentStep}</div>
      <div className="">{flow.historyStack.join(" -> ")}</div>
      <div className="">{flow.stackCount}</div>
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
          flow.nextStep("mot");
          flow.filteredStep(["hello"]);
        }}
      >
        없애기 hello 스택
      </button>
      <Component handleClick={flow.nextStep} />
    </div>
  );
};

export default Page;

type Props = {
  handleClick: (hi: any) => void;
};
const Component = memo((props: Props) => {
  const { handleClick } = props;

  return <div>is Rerender?</div>;
});
