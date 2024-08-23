"use client";

import { useRouter } from "next/navigation";
import { http } from "~/src/http/http";

export default function Home() {
  const router = useRouter();
  return (
    <div className="">
      <div className=" min-h-screen bg-purple-50"></div>
      <button
        onClick={async () => {
          const result = http.get("api/simple");
        }}
      >
        dsadsa
      </button>
      <div className=" min-h-screen bg-purple-50"></div>
    </div>
  );
}
