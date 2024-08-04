"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FunnelStepChangeFunction, useFlow } from "~/src/flow/flow";
import { getOriginAndPathname, updateQueryParams } from "~/src/flow/query-string";

const list = ["a", "b", "c", "d", "e"] as const;

export default function Home() {
  const FUNNEL_ID = "step-1";
  const router = useRouter();
  const queryStep = useSearchParams().get(FUNNEL_ID);
  const step = (queryStep ?? list[0]) as (typeof list)[number];

  const [Funnel, controller] = useFlow(list, {
    funnelId: FUNNEL_ID,
    initialStep: list[0],
    step: step,
  });

  const setStep: FunnelStepChangeFunction = (param, options) => {
    const newUrl = `${getOriginAndPathname()}${updateQueryParams({ [FUNNEL_ID]: param })}`;
    if (options?.type === "replace") {
      router.replace(newUrl);
    }
    if (options?.type === "push") {
      router.push(newUrl);
    }
    if (options?.type === "back") {
      router.back();
    }
    router.push(newUrl);
  };

  return (
    <div className="">
      <Funnel>
        <Funnel.Step name={"a"}>
          <div className="">
            <div className="">현재 위치 A</div>
            <button onClick={() => setStep("b")}>다음</button>
          </div>
        </Funnel.Step>

        <Funnel.Step
          name={"b"}
          onFunnelRestrictEvent={() => {
            console.log("work?");
            router.replace("/?step-1=a");
          }}
        >
          <Funnel.Guard condition={true} fallback={<>...check...can 넘어가기</>}>
            <div className="">
              <div className="">현재 위치 B</div>
              <button onClick={() => setStep("c")}>다음</button>
            </div>
          </Funnel.Guard>
        </Funnel.Step>

        <Funnel.Step name={"c"}>
          <div className="">
            <div className="">현재 위치 C</div>
            <button onClick={() => setStep("a")}>다음</button>
          </div>
        </Funnel.Step>
      </Funnel>
    </div>
  );
}
