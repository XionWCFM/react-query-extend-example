"use client";
import { useState } from "react";
import { Flow, useFlow } from "~/src/hooks/observer-flow";

const steps = ["step1", "step2", "step3"] as const;

export default function Page() {
  const [Funnel, flow] = useFlow(steps);
  return (
    <div>
      <div className=" flex gap-x-4">
        {steps.map((step) => (
          <button key={step} onClick={() => flow.pushStep(step)}>
            push {step}
          </button>
        ))}
      </div>
      <div className=" flex gap-x-4">
        {steps.map((step) => (
          <button key={step} onClick={() => flow.replaceStep(step)}>
            replace {step}
          </button>
        ))}
      </div>
      <div className=" flex gap-x-4">
        <button onClick={() => flow.back(5)}>backstep</button>
      </div>
      <div className=" "> historyStackWithCurrent : {flow.historyStack.concat(flow.step).join(", ")}</div>
      <div className="">stackCount : {flow.getStackCount()}</div>
      <div className="">prevStep: {flow.getPrevStep()}</div>
      <div className="">currentSTep : {flow.step}</div>
      <div className="">historyStack : {flow.historyStack.join(", ")}</div>

      <div className=" mt-32"></div>
      <Funnel>
        <Funnel.Step name="step1">
          <div>현재 : Step 1</div>
        </Funnel.Step>
        <Funnel.Step name="step2">
          <div>현재 : Step 2</div>
        </Funnel.Step>
        <Funnel.Step name="step3">
          <div>현재 : Step 3</div>
        </Funnel.Step>
      </Funnel>
    </div>
  );
}
