"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const push = async () => {
    router.push(`/router?name=${Math.random().toString()}`);
  };
  const clean = async () => {};
  return (
    <div className=" flex flex-col gap-y-4">
      <button onClick={push}> push</button>
      <button>historyClean</button>
    </div>
  );
}
