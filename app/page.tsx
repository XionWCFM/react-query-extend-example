"use client";
import { useMutation } from "@tanstack/react-query";
import { createMutationOptions, MutationBoundary } from "@xionwcfm/react-query";
import { delay } from "es-toolkit";
import { useRouter } from "next/navigation";

export default function Home() {
  const { mutate } = useMutation(myMutationOption());
  const router = useRouter();
  return (
    <div>
      <MutationBoundary
        {...myMutationOption()}
        caseBy={{
          success: () => <div>success</div>,
          pending: () => <div>pending</div>,
          error: (state) => <div>error</div>,
        }}
      >
        <div>default</div>
      </MutationBoundary>
      <button
        onClick={() => {
          mutate();
          router.push("/loader");
        }}
      >
        das
      </button>
    </div>
  );
}

export const myMutationOption = createMutationOptions({
  mutationKey: ["test"],
  mutationFn: async () => {
    await delay(5000);
    if (Math.random() > 0.5) {
      throw new Error("error");
    }
    return {
      id: "hello",
    };
  },
});
