import { batchRequestsOf } from "./batch-request-of";
import { throttle } from "./throttle";
import { usePreservedCallback } from "./use-preserved-callback";

type CallbackFunctionType = (...args: any[]) => any;
export const useBatchThrottle = <T extends CallbackFunctionType>(fn: T, ms: number) => {
  const throttleFn = throttle(batchRequestsOf(fn), ms);
  const preservedCallback = usePreservedCallback(throttleFn);
  preservedCallback.reset = throttleFn.reset;
  return preservedCallback;
};
