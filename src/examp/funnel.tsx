"use client";
import { useFunnel } from "@xionhub/funnel-app-router-adapter";
import { useRouter } from "next/navigation";
import { funnelOptions, useFunnelDefaultStep } from "@xionhub/funnel-core";

export const basicFunnelOptions = () =>
  funnelOptions({
    steps: ["a", "b", "c"] as const,
    funnelId: "hello-this-is-funnel-id",
    defaultPrefix:'/funnel'
  });

type Props = {
  setStep: () => void;
  step: string;
};

export const BasicFunnel = () => {
  const [Funnel, controller] = useFunnel(basicFunnelOptions());
  const router = useRouter();
  useFunnelDefaultStep(controller.step , () => {
    router.replace(controller.createStep("a"));
  })
  return (
    <>
      <Funnel>
        <Funnel.Step name="a">
          <FunnelItem
            setStep={() => {
              router.push(controller.createStep("b"));
            }}
            step="a"
          />
        </Funnel.Step>
        <Funnel.Step name="b">
          <FunnelItem
            setStep={() => {
              router.push(controller.createStep("c"));
            }}
            step="b"
          />
        </Funnel.Step>
        <Funnel.Step name="c">
          <FunnelItem
            setStep={() => {
              router.push(controller.createStep("a"));
            }}
            step="c"
          />
        </Funnel.Step>
      </Funnel>
    </>
  );
};

const FunnelItem = ({ setStep, step }: Props) => {
  return (
    <div className=" flex flex-col gap-y-16 justify-center items-center">
      <div>current location {step}</div>
      <button className=" bg-purple-400 rounded-full py-4 px-4" onClick={() => setStep()}>
        go to next funnel
      </button>
    </div>
  );
};
