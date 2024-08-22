"use client";

import { ScrollRestorer } from "next-scroll-restorer";
import { useRouter } from "next/navigation";
import { ClientSideScrollRestorer } from "~/src/client-restorer";

export default function Home() {
  const router = useRouter();
  return (
    <div className="">
      <div className=" min-h-screen bg-purple-50"></div>
      <button
        onClick={() => {
          router.push(`/?foo=${Math.random()}`);
        }}
      >
        dsadsa
      </button>
      <div className=" min-h-screen bg-purple-50"></div>
      <ClientSideScrollRestorer />
    </div>
  );
}
