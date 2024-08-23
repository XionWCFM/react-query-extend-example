"use client";

import { useRouter } from "next/navigation";
import { http, httpClientAuth } from "~/src/http/http";

export default function Home() {
  const router = useRouter();
  return (
    <div className="">
      <button
        onClick={async () => {
          const login = await http.instance.get("api/auth/login");
          const accessToken = login.headers.get("Authorization");
          if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
          }
          const result = await httpClientAuth.get("api/simple", { credentials: "include" });
        }}
      >
        dsadsa
      </button>
    </div>
  );
}
