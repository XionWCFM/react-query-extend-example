import { WorkerMessageT, CryptoWorkConfigT } from "./types";

// Define pricesWs at the top-level scope of the worker
let pricesWs: WebSocket | null = null;

self.onmessage = (e) => {
  const BASE_URL = "wss://ws.coincap.io/prices";
  switch (e.data.type) {
    case "init":
      const message: WorkerMessageT<CryptoWorkConfigT> = e.data;

      // Initialize the WebSocket connection
      pricesWs = new WebSocket(`${BASE_URL}?assets=${message.payload?.data.assets}`);

      const initSubscription = () => {
        pricesWs?.addEventListener("message", function (event) {
          self.postMessage(JSON.parse(event.data));
        });
      };

      initSubscription();

      break;

    case "stop":
      // Safely close the WebSocket if it's open
      if (pricesWs) {
        console.log("Closing WebSocket connection...", pricesWs);
        pricesWs.close();
        pricesWs = null; // Clear the reference after closing
      }
      break;

    case "error":
      // Handle error, possibly closing WebSocket
      if (pricesWs) {
        pricesWs.close();
        pricesWs = null; // Ensure clean up on error
      }
      // Implement additional error handling logic here
      break;

    default:
      // Handle any cases that are not explicitly mentioned
      console.error("Unhandled message type:", e.data.type);
  }
};
