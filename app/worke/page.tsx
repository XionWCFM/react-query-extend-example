"use client";

import { useRef, useState, useEffect } from "react";

export default function Page() {
  const workerRef = useRef<Worker | null>(null);
  const [state, setState] = useState<{ type: "DEFAULT" | "HELLO"; content: string }[]>([]);

  useEffect(() => {
    // 워커를 생성하고 workerRef에 저장해
    workerRef.current = new Worker("/workers/exmaple.js", { type: "module" });

    // 워커에서 메시지를 받을 때 처리하는 함수
    workerRef.current.onmessage = (e) => {
      setState(e.data);
    };

    // 컴포넌트가 언마운트될 때 워커를 종료해
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const sendMessageToWorker = () => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        list: Array.from({ length: 10000000 }).map((_, i) => ({
          type: Math.random() > 0.5 ? "HELLO" : "DEFAULT",
          content: `Hello ${i}`,
        })),
      });
    }
  };

  return (
    <div>
      <button onClick={sendMessageToWorker}>Send Message to Worker</button>
      <div className="">
        {state.map((item) => (
          <div key={item.content}>
            {item.type}
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
