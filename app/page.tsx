"use client";

import { useExtendedMutation } from "~/src/hooks/builder";

export default function Home() {
  const mutationFn = async () => {
    console.log("hello world");
  };
  const { isPendingRef, createMutation } = useExtendedMutation({ mutationFn });
  const mutation = createMutation().pendingRef().singleFlight().debounce({ ms: 500, leading: false }).done();
  const handleClick = () => {
    mutation();
  };
  return (
    <div className="">
      <button id="hello" onClick={handleClick}>
        클릭
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
