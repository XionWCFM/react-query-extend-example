"use client";

import { useExtendedMutation } from "~/src/hooks/builder";
import { MutationBuilder } from "~/src/hooks/mutation-builder";
import { SingleFlight } from "~/src/hooks/single-flight";
import { ClientOnlyPortal } from "~/src/portal/client-only-portal";
import { toast } from "~/src/portal/toast";

const singleFLight = new SingleFlight();
export default function Home() {
  const mutationFn = async () => {
    await new Promise((res) => setTimeout(res, 1000));
    console.log("hello world");
  };
  const { isPendingRef, mutateAsync, createMutation } = useExtendedMutation({ mutationFn });
  const mutation = createMutation().singleFlight().debounce({ ms: 500, leading: false }).done();
  const mutationBuilder = new MutationBuilder(mutateAsync, singleFLight);
  const hello = mutationBuilder.singleFlight().done();

  return (
    <div className="">
      <div className=""></div>
      <button
        onClick={() => {
          toast.show({ title: "hello" });
        }}
      >
        토스트
      </button>
      <button
        onClick={() => {
          const button = document.querySelector("#hello");
          for (let i = 0; i < 10; i++) {
            //@ts-ignore
            button?.click();
          }
        }}
      >
        인위적 여러번 클릭
      </button>
    </div>
  );
}
