"use client";
import { MutationLoader } from "~/src/mutation-loader";
import { myMutationOption } from "../page";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const handleError = () => {
    alert("hello error");
  };

  const handleSuccess = () => {
    alert("hello success");
  };
  return (
    <MutationLoader {...myMutationOption()} onError={handleError} onSuccess={handleSuccess} delay={10000}>
      <div>loading...</div>
    </MutationLoader>
  );
}
