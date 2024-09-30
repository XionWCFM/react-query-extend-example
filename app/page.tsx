"use client";

import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [state, setState] = useState({ hello: "world" });

  const hi = useCallback(() => {
    console.log(state);
  }, []);

  useEffect(() => {
    const handler = () => {
      console.log("");
    };
    window?.addEventListener("popstate", handler);
    return () => {
      window.removeEventListener("popstate", handler);
    };
  }, []);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          hi();
        }}
      >
        유즈콜백 클릭
      </button>
      <button
        type="button"
        onClick={() => {
          console.log(state);
        }}
      >
        콜백안한 클릭
      </button>

      <button
        type="button"
        onClick={() => {
          setState({ hello: "hi" });
        }}
      >
        상태 변경
      </button>
    </div>
  );
}
