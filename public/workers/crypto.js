// Define pricesWs at the top-level scope of the worker
var pricesWs = null;
self.onmessage = function (e) {
    var _a;
    var BASE_URL = "wss://ws.coincap.io/prices";
    switch (e.data.type) {
        case "init":
            var message = e.data;
            // Initialize the WebSocket connection
            pricesWs = new WebSocket("".concat(BASE_URL, "?assets=").concat((_a = message.payload) === null || _a === void 0 ? void 0 : _a.data.assets));
            var initSubscription = function () {
                pricesWs === null || pricesWs === void 0 ? void 0 : pricesWs.addEventListener("message", function (event) {
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
export {};
