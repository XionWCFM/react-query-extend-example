"use client";

import { useRef, useState, useEffect } from "react";
import { WorkerMessageT, CryptoWorkConfigT } from "~/workers/types";

type CryptoDataT = {
  bitcoin: string;
  ethereum: string;
  monero: string;
  litecoin: string;
};

export default function Page() {
  const workerRef = useRef<Worker>();
  const initPrice = "waiting for data...";
  const [status, setStatus] = useState<string>("Stopped");
  const [prices, setPrices] = useState<CryptoDataT>({
    bitcoin: "",
    ethereum: "",
    monero: "",
    litecoin: "",
  });

  useEffect(() => {
    workerRef.current = new Worker("/workers/crypto.js", {
      type: "module",
    });
    workerRef.current.onmessage = (event) => {
      setPrices((prev) => {
        const newState = { ...prev, ...event.data };
        return newState;
      });
    };
    workerRef.current.onerror = (error) => {
      console.error("Worker error:", error);
    };
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const startWorker = () => {
    setStatus("Running");

    const workerMessage: WorkerMessageT<CryptoWorkConfigT> = {
      type: "init",
      payload: {
        data: {
          assets: "bitcoin,ethereum,monero,litecoin",
        },
      },
    };
    if (workerRef.current) {
      workerRef.current.postMessage(workerMessage);
    }
  };

  const stopWorker = () => {
    setStatus("Stopped");
    const workerMessage: WorkerMessageT<CryptoWorkConfigT> = {
      type: "stop",
    };
    if (workerRef.current) {
      workerRef.current.postMessage(workerMessage);
    }
  };

  const terminateWorker = () => {
    setStatus("Terminated");
    const workerMessage: WorkerMessageT<CryptoWorkConfigT> = {
      type: "stop",
    };
    if (workerRef.current) {
      workerRef.current.postMessage(workerMessage);
      workerRef.current.terminate();
    }
  };

  return (
    <section>
      <div className="mb-40 gap-12">
        <button onClick={startWorker}>start</button>
        <button onClick={stopWorker}>stop</button>
        <button onClick={terminateWorker}>terminate</button>
      </div>
      <div>
        <h2 className="heading-md mb-12">Stream data: {status}</h2>
        <div className="gap-12 flex-column">
          {Object.keys(prices).map((key) => {
            const price = prices[key as keyof CryptoDataT];
            return (
              <div key={key}>
                <span className="mr-12 capitalize">{key}:</span>
                <span className={`${!price && "opacity-20"}`}>{price ? "$" + price : initPrice}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
